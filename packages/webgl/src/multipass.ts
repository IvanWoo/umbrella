import type { IObjectOf } from "@thi.ng/api";
import { assert } from "@thi.ng/errors/assert";
import { S2D, S3D, V2, V4 } from "@thi.ng/shader-ast/api/types";
import { assign } from "@thi.ng/shader-ast/ast/assign";
import { defMain } from "@thi.ng/shader-ast/ast/function";
import { INT0, ivec2 } from "@thi.ng/shader-ast/ast/lit";
import { $xy } from "@thi.ng/shader-ast/ast/swizzle";
import { texelFetch } from "@thi.ng/shader-ast/builtin/texture";
import { mapIndexed } from "@thi.ng/transducers";
import { assocObj } from "@thi.ng/transducers/assoc-obj";
import { map } from "@thi.ng/transducers/map";
import { range } from "@thi.ng/transducers/range";
import { some } from "@thi.ng/transducers/some";
import { transduce } from "@thi.ng/transducers/transduce";
import type { ExtensionBehaviors } from "./api/ext.js";
import type { Multipass, MultipassOpts, PassOpts } from "./api/multipass.js";
import type {
	ShaderOutputSpec,
	ShaderSpec,
	ShaderUniformSpecs,
	UniformDecl,
} from "./api/shader.js";
import {
	TextureFilter,
	TextureRepeat,
	TextureTarget,
	type ITexture,
} from "./api/texture.js";
import { compileModel } from "./buffer.js";
import { isFloatTexture, isGL2Context } from "./checks.js";
import { draw } from "./draw.js";
import { defFBO } from "./fbo.js";
import { defQuadModel } from "./geo/quad.js";
import { defShader } from "./shader.js";
import { PASSTHROUGH_VS } from "./shaders/pipeline.js";
import { defTexture } from "./texture.js";

export const defMultiPass = (opts: MultipassOpts) => {
	const gl = opts.gl;
	const numPasses = opts.passes.length;
	assert(numPasses > 0, "require at least one shader pass");

	const useMainBuffer = !opts.passes[numPasses - 1].outputs.length;
	const textures = __initTextures(opts);
	const passes = __initPasses(opts, textures);
	const fbos = __initBuffers(opts, textures, useMainBuffer);

	const drawPass = (i: number, time: number, isFBO = true) => {
		isFBO && fbos[i].bind();
		const spec = opts.passes[i];
		const pass = passes[i];
		const shader = pass.shader;
		const size = spec.outputs.length
			? textures[spec.outputs[0]].size
			: [gl.drawingBufferWidth, gl.drawingBufferHeight];
		shader.uniforms.resolution && (pass.uniforms!.resolution = size);
		shader.uniforms.time && (pass.uniforms!.time = time);
		gl.viewport(0, 0, size[0], size[1]);
		draw(pass);
		isFBO && fbos[i].unbind();
	};

	const update = (time: number) => {
		for (let i = 0; i < fbos.length; i++) {
			drawPass(i, time);
		}
		useMainBuffer && drawPass(numPasses - 1, time, false);
	};

	const updateRAF = () => {
		update((Date.now() - t0) * 1e-3);
		active && (rafID = requestAnimationFrame(updateRAF));
	};

	let active: boolean;
	let t0 = Date.now();
	let rafID: number;

	const instance: Multipass = {
		start() {
			t0 = Date.now();
			active = true;
			rafID = requestAnimationFrame(updateRAF);
		},
		stop() {
			if (active) {
				active = false;
				cancelAnimationFrame(rafID);
			}
		},
		update(time: number) {
			update(time);
		},
		singlePass(i: number, time: number) {
			drawPass(i, time, i < fbos.length);
		},
		passes: opts.passes,
		fbos,
		models: passes,
		textures,
	};

	return instance;
};

/** @internal */
const __initPasses = (opts: MultipassOpts, textures: IObjectOf<ITexture>) => {
	const gl = opts.gl;
	const model = compileModel(gl, defQuadModel({ uv: false }));
	return opts.passes.map((pass) => {
		const m = pass.model ? compileModel(gl, <any>pass.model) : { ...model };
		m.shader = __initShader(gl, pass, textures);
		m.uniforms = { ...pass.uniformVals };
		pass.inputs.length > 0 &&
			(m.textures = pass.inputs.map((id) => textures[id]));
		return m;
	});
};

/** @internal */
const TEX_TYPE_MAP: Record<number, string> = {
	[TextureTarget.TEXTURE_2D]: S2D,
	[TextureTarget.TEXTURE_3D]: S3D,
	[TextureTarget.TEXTURE_CUBE_MAP]: "samplerCube",
};

/** @internal */
const __initShader = (
	gl: WebGLRenderingContext,
	pass: PassOpts,
	textures: IObjectOf<ITexture>
) => {
	const isGL2 = isGL2Context(gl);
	const numOuts = pass.outputs.length;
	const ext: ExtensionBehaviors = { ...pass.ext };
	const spec: ShaderSpec = {
		vs: pass.vs || PASSTHROUGH_VS,
		fs: pass.fs,
		attribs: pass.attribs || { position: V2 },
		varying: pass.varying,
		uniforms: <ShaderUniformSpecs>{
			...pass.uniforms,
			...transduce(
				mapIndexed(
					(i, id) =>
						<[string, UniformDecl]>[
							`input${i}`,
							[TEX_TYPE_MAP[textures[id].target], i],
						]
				),
				assocObj(),
				pass.inputs
			),
		},
		outputs: numOuts
			? transduce(
					map(
						(i) =>
							<[string, ShaderOutputSpec]>[`output${i}`, [V4, i]]
					),
					assocObj(),
					range(numOuts)
			  )
			: undefined,
		state: pass.state,
		pre: pass.pre,
		post: pass.post,
		replacePrelude: pass.replacePrelude,
		generateDecls: pass.generateDecls,
		ext,
	};
	const floatIn = some((id) => isFloatTexture(textures[id]), pass.inputs);
	const floatOut = some((id) => isFloatTexture(textures[id]), pass.outputs);
	if (!isGL2) {
		floatIn && (ext.OES_texture_float = "require");
		numOuts > 1 && (ext.WEBGL_draw_buffers = "require");
	}
	if (floatOut) {
		ext[isGL2 ? "EXT_color_buffer_float" : "WEBGL_color_buffer_float"] =
			"require";
		isGL2 && (ext["EXT_float_blend"] = "require");
	}
	return defShader(gl, spec);
};

/** @internal */
const __initTextures = (opts: MultipassOpts) =>
	Object.keys(opts.textures).reduce((acc, id) => {
		acc[id] = defTexture(opts.gl, {
			width: opts.width,
			height: opts.height,
			depth: opts.depth,
			filter: TextureFilter.NEAREST,
			wrap: TextureRepeat.CLAMP,
			image: null,
			...opts.textures[id],
		});
		return acc;
	}, <IObjectOf<ITexture>>{});

/** @internal */
const __initBuffers = (
	opts: MultipassOpts,
	textures: IObjectOf<ITexture>,
	useMainBuffer: boolean
) =>
	(useMainBuffer
		? opts.passes.slice(0, opts.passes.length - 1)
		: opts.passes
	).map((pass) =>
		defFBO(opts.gl, { tex: pass.outputs.map((id) => textures[id]) })
	);

/**
 * Returns a dynamically generated single pass spec ({@link PassOpts}) for use
 * within a larger multipass pipeline spec, and which copies given `src`
 * textures into their respective `dest` textures (e.g. for feedback purposes).
 *
 * @remarks
 * Both arrays must have same length. The first `src` texture is written to the
 * first `dest` tex, etc.
 *
 * WebGL2 only (uses `texelFetch()`)
 *
 * @param src -
 * @param dest -
 */
export const passCopy = (src: string[], dest: string[]): PassOpts => {
	assert(
		src.length === dest.length,
		`require same number of in/out textures`
	);
	return {
		fs: (gl, unis, _, outs) => [
			defMain(() => [
				...map(
					(i) =>
						assign(
							outs[`output${i}`],
							texelFetch(
								unis[`input${i}`],
								ivec2($xy(gl.gl_FragCoord)),
								INT0
							)
						),
					range(src.length)
				),
			]),
		],
		inputs: src,
		outputs: dest,
	};
};

/**
 * Generates a shader pass spec which copies given named texture `src` to the
 * main drawing buffer as final step in a {@link defMultiPass} pipeline.
 *
 * @remarks
 * WebGL2 only (uses `texelFetch()`)
 *
 * @param src
 */
export const passCopyMain = (src: string): PassOpts => ({
	fs: (gl, unis, _, outs) => [
		defMain(() => [
			assign(
				outs.fragColor,
				texelFetch(unis.input0, ivec2($xy(gl.gl_FragCoord)), INT0)
			),
		]),
	],
	inputs: [src],
	outputs: [],
});
