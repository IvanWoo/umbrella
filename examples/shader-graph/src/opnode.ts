// SPDX-License-Identifier: Apache-2.0
import type { IObjectOf } from "@thi.ng/api";
import { mat23to44 } from "@thi.ng/matrices";
import { F, S2D } from "@thi.ng/shader-ast";
import {
	FBO,
	FX_SHADER_SPEC_UV,
	Shader,
	Texture,
	TextureFilter,
	defFBO,
	defShader,
	defTexture,
	draw,
	type GLMat4,
	type GLVec,
	type ModelSpec,
} from "@thi.ng/webgl";
import type { AppCtx, OpSpec, UserUniforms } from "./api.js";

export class OpNode<T extends UserUniforms> {
	tex: Texture;
	fbo: FBO;
	shader: Shader;
	params: IObjectOf<number | GLVec>;

	updateSpec: ModelSpec;
	drawSpec: ModelSpec;

	constructor(public ctx: AppCtx, public spec: OpSpec<T>) {
		// create texture as render target
		this.tex = defTexture(ctx.gl, {
			width: ctx.texSize,
			height: ctx.texSize,
			filter: TextureFilter.LINEAR,
			image: null,
		});

		// wrap texture in frame buffer object
		this.fbo = defFBO(ctx.gl, { tex: [this.tex] });

		// compile shader, incl. user provided fragment shader parts
		this.shader = defShader(ctx.gl, {
			...FX_SHADER_SPEC_UV,
			fs: <any>spec.main,
			uniforms: <any>{
				u_in0: [S2D, 0],
				u_in1: [S2D, 1],
				u_in2: [S2D, 2],
				u_in3: [S2D, 3],
				u_time: [F, 0],
				...spec.unis,
			},
		});

		// expose uniforms as plain JS object
		this.params = Object.entries(spec.unis).reduce((acc, [id, val]) => {
			acc[id] = val[1];
			return acc;
		}, <any>{});

		// define stub ModelSpec's for drawing
		// re-use pre-defined geometries defined in AppCtx
		this.updateSpec = {
			...this.ctx.opQuad,
			shader: this.shader,
			textures: this.spec.inputs,
			uniforms: { u_time: 0 },
		};
		this.drawSpec = {
			...ctx.mainQuad,
			textures: [this.tex],
			uniforms: {
				model: <GLMat4>mat23to44([], this.spec.node.mat),
			},
		};
	}

	/**
	 * Takes time value (in frames) and renders shader to offscreen texture.
	 *
	 * @param time -
	 */
	update(time: number) {
		const unis = this.updateSpec.uniforms!;
		unis.u_time = time;
		Object.assign(unis, this.params);
		this.fbo.bind();
		this.ctx.gl.viewport(0, 0, this.ctx.texSize, this.ctx.texSize);
		draw(this.updateSpec);
		this.fbo.unbind();
	}

	/**
	 * Draws texture into main canvas at position, size & rotation defined by
	 * associated scenegraph node
	 */
	draw() {
		this.drawSpec.uniforms!.model = <GLMat4>(
			mat23to44([], this.spec.node.mat)
		);
		draw(this.drawSpec);
	}
}
