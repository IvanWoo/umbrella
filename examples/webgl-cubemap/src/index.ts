// SPDX-License-Identifier: Apache-2.0
import { adaptDPI } from "@thi.ng/canvas";
import { sin } from "@thi.ng/dsp";
import { start } from "@thi.ng/hdom";
import { canvasWebGL, dropdown } from "@thi.ng/hdom-components";
import { concat, lookAt, perspective, transform44 } from "@thi.ng/matrices";
import { imageFromURL } from "@thi.ng/pixel";
import { fromPromise, metaStream, reactive } from "@thi.ng/rstream";
import {
	M4,
	V3,
	assign,
	defMain,
	mul,
	normalize,
	texture,
	vec4,
} from "@thi.ng/shader-ast";
import {
	BLEND_ADD,
	TextureFilter,
	clearCanvas,
	compileModel,
	defCubeModel,
	defShader,
	defTextureCubeMap,
	defaultViewport,
	draw,
	type GLMat4,
	type ModelSpec,
	type ShaderSpec,
} from "@thi.ng/webgl";

const CUBEMAP_SHADER: ShaderSpec = {
	vs: (gl, unis, ins, outs) => [
		defMain(() => [
			assign(outs.vnormal, ins.position),
			assign(gl.gl_Position, mul(unis.mvp, vec4(ins.position, 1))),
		]),
	],
	fs: (_, unis, ins, outs) => [
		defMain(() => [
			assign(outs.fragColor, texture(unis.tex, normalize(ins.vnormal))),
		]),
	],
	attribs: {
		position: V3,
	},
	varying: {
		vnormal: V3,
	},
	uniforms: {
		mvp: M4,
		tex: "samplerCube",
	},
	state: {
		depth: false,
		blend: true,
		blendFn: BLEND_ADD,
	},
};

const CUBE_MAPS = [
	["langholmen2", "Langholmen"],
	["golden-gate", "Golden Gate"],
	["maskonaive2", "Maskonaive"],
];

const BG_COL = [0.01, 0.01, 0.01];

const app = () => {
	const selection = reactive(CUBE_MAPS[0][0]);
	let model: ModelSpec;
	const canvas = canvasWebGL({
		init: (_, gl) => {
			selection
				.subscribe(
					metaStream((id: string) =>
						fromPromise(loadCubeMap(`./img/${id}/`))
					)
				)
				.subscribe({
					next(faces) {
						try {
							model = compileModel(gl, {
								...defCubeModel({ normal: false, uv: false }),
								shader: defShader(gl, CUBEMAP_SHADER),
								uniforms: {},
								textures: [
									defTextureCubeMap(gl, faces, {
										filter: [
											TextureFilter.LINEAR_MIPMAP_LINEAR,
											TextureFilter.LINEAR,
										],
										mipmap: true,
									}),
								],
							});
						} catch (err) {
							console.warn(err);
						}
					},
					error(e) {
						console.warn(e);
						return true;
					},
				});
		},
		update: (el, gl, __, time) => {
			if (!model) return;
			const p = perspective(
				[],
				45,
				gl.drawingBufferWidth / gl.drawingBufferHeight,
				0.01,
				10
			);
			const v = lookAt(
				[],
				[0, 0, sin(time, 0.00008, 1.99, 2)],
				[0, 0, 0],
				[0, 1, 0]
			);
			const m = transform44(
				[],
				[0, 0, 0],
				[sin(time, 0.0001, 0.7, 0.5), time * 0.0007, 0],
				1
			);
			model.uniforms!.mvp = <GLMat4>concat([], p, v, m);
			adaptDPI(el, window.innerWidth, window.innerHeight);
			defaultViewport(gl);
			clearCanvas(gl, BG_COL);
			draw(model);
		},
	});
	return () => [
		"div.sans-serif",
		[canvas, { width: window.innerWidth, height: window.innerHeight }],
		[
			"div.fixed.top-0.left-0.z-1.ma3",
			[
				dropdown,
				{
					onchange: (e: Event) =>
						selection.next((<HTMLSelectElement>e.target).value),
				},
				CUBE_MAPS,
				selection.deref(),
			],
		],
	];
};

const loadCubeMap = (base: string) =>
	Promise.all(
		["posx", "negx", "posy", "negy", "posz", "negz"].map((id) =>
			imageFromURL(base + id + ".jpg")
		)
	);

start(app());
