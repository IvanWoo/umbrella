import { adaptDPI } from "@thi.ng/canvas";
import { start } from "@thi.ng/hdom";
import { canvasWebGL } from "@thi.ng/hdom-components";
import { PI } from "@thi.ng/math";
import { lookAt, ortho, scale44 } from "@thi.ng/matrices";
import { mapcat, range2d } from "@thi.ng/transducers";
import { normalize3, rotateY } from "@thi.ng/vectors";
import {
	LAMBERT,
	TextureFilter,
	TextureRepeat,
	checkerboard,
	clearCanvas,
	compileModel,
	defCubeModel,
	defShader,
	defTexture,
	defaultViewport,
	draw,
	type GLMat4,
	type GLVec3,
	type ModelSpec,
} from "@thi.ng/webgl";

const BG_COL = [0.1, 0.1, 0.1];

const app = () => {
	let model: ModelSpec;
	const GRID = 16;
	const canvas = canvasWebGL({
		init: (_, gl) => {
			const C1 = [0.5, 0.5, 0.5];
			const C2 = [1, 1, 1];
			model = compileModel(gl, {
				...defCubeModel({ size: 0.9 }),
				instances: {
					attribs: {
						offset: {
							data: new Float32Array(
								mapcat(
									([x, z]) => [
										x * 2,
										Math.sin(x * 0.4) + Math.sin(z * 0.4),
										z * 2,
									],
									range2d(-GRID + 1, GRID, -GRID + 1, GRID)
								)
							),
							size: 3,
						},
						icol: {
							data: new Float32Array(
								mapcat(
									() => (Math.random() < 0.5 ? C1 : C2),
									range2d(-GRID + 1, GRID, -GRID + 1, GRID)
								)
							),
							size: 3,
						},
					},
					num: (GRID * 2 - 1) ** 2,
				},
				shader: defShader(
					gl,
					LAMBERT({
						uv: "uv",
						instancePos: "offset",
						instanceColor: "icol",
						state: { cull: true },
					})
				),
				uniforms: {},
				textures: [
					defTexture(gl, {
						image: checkerboard({
							size: 8,
							col1: 0xff808080,
							col2: 0xffffffff,
							corners: true,
						}),
						filter: TextureFilter.NEAREST,
						wrap: TextureRepeat.CLAMP,
					}),
				],
			});
		},
		update: (el, gl, __, time) => {
			adaptDPI(el, window.innerWidth, window.innerHeight);
			const cam = [0, 2, 5];
			const eye = rotateY(
				[],
				cam,
				-PI / 4 + Math.sin(time * 0.0005) * 0.1
			);
			const aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
			const zoom = Math.sin(time * 0.0005) * 0.4 + 0.5;
			const scl = ((GRID * 2) / 3) * zoom;
			Object.assign(model.uniforms!, {
				proj: <GLMat4>(
					ortho(
						[],
						-scl * aspect,
						scl * aspect,
						-scl,
						scl,
						-GRID * 2,
						GRID * 2
					)
				),
				view: <GLMat4>lookAt([], eye, [0, 0, 0], [0, 1, 0]),
				model: <GLMat4>scale44([], [1, Math.sin(time * 0.001) + 1, 1]),
				lightDir: <GLVec3>(
					rotateY(null, normalize3(null, [-0.25, 1, 1]), 0)
				),
			});
			defaultViewport(gl);
			clearCanvas(gl, BG_COL);
			draw(model);
		},
	});
	return () => [
		canvas,
		{ width: window.innerWidth, height: window.innerHeight },
	];
};

start(app());
