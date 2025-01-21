// SPDX-License-Identifier: Apache-2.0
import { pixelCanvas2d } from "@thi.ng/canvas";
import { FLOAT_GRAY, floatBuffer } from "@thi.ng/pixel";
import {
	$x,
	$xyz,
	F,
	V2,
	assign,
	defMain,
	fract,
	length,
	mul,
	pow,
	sin,
	sub,
	sym,
	texture,
	vec3,
	vec4,
	type Vec2Sym,
	type Vec4Sym,
} from "@thi.ng/shader-ast";
import { clamp01, fit1101, fragUV } from "@thi.ng/shader-ast-stdlib";
import {
	TextureFormat,
	TextureType,
	defMultiPass,
	glCanvas,
	readTexture,
} from "@thi.ng/webgl";

// create WebGL canvas
const canvas = glCanvas({
	// width: window.innerWidth,
	// height: window.innerHeight,
	width: 512,
	height: 512,
	parent: document.body,
	version: 2,
});

// init multipass shader pipeline
const toy = defMultiPass({
	gl: canvas.gl,
	width: 32,
	height: 32,
	textures: {
		foo: { format: TextureFormat.RGBA32F },
		bar: { format: TextureFormat.R32F },
	},
	passes: [
		{
			fs: (gl, unis, _, outs) => [
				defMain(() => {
					let uv: Vec2Sym;
					return [
						(uv = sym(fragUV(gl.gl_FragCoord, unis.resolution))),
						assign(
							outs.output0,
							vec4(vec3(uv, fract(unis.time)), 1)
						),
						assign(
							outs.output1,
							vec4(clamp01(length(sub(uv, 0.5))))
						),
					];
				}),
			],
			inputs: [],
			outputs: ["foo", "bar"],
			uniforms: {
				time: F,
				resolution: V2,
			},
			uniformVals: {
				// foo: () => Math.random()
			},
		},
		{
			fs: (gl, unis, _, outs) => [
				defMain(() => {
					let uv: Vec2Sym;
					return [
						(uv = sym(fragUV(gl.gl_FragCoord, unis.resolution))),
						assign(
							<Vec4Sym>outs.fragColor,
							vec4(
								mul(
									$xyz(texture(unis.input0, uv)),
									pow(
										$x(texture(unis.input1, uv)),
										fit1101(sin(unis.time))
									)
								),
								1
							)
						),
					];
				}),
			],
			inputs: ["foo", "bar"],
			outputs: [],
			uniforms: {
				resolution: V2,
				time: F,
			},
		},
	],
});

toy.update(0);

const canv = pixelCanvas2d(32, 32, document.body);
floatBuffer(
	32,
	32,
	FLOAT_GRAY,
	readTexture(
		canvas.gl,
		toy.textures.bar,
		TextureFormat.RED,
		TextureType.FLOAT,
		new Float32Array(32 * 32)
	)
).blitCanvas(canv.canvas);

toy.start();
