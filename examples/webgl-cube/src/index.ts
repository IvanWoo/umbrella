// SPDX-License-Identifier: Apache-2.0
import { start } from "@thi.ng/hdom";
import { canvasWebGL } from "@thi.ng/hdom-components";
import {
	concat,
	lookAt,
	perspective,
	rotationX44,
	rotationY44,
} from "@thi.ng/matrices";
import { SOA } from "@thi.ng/soa";
import { permutations, repeat } from "@thi.ng/transducers";
import { normalize3 } from "@thi.ng/vectors";
import {
	LAMBERT,
	clearCanvas,
	compileModel,
	defShader,
	draw,
	type GLMat4,
	type GLVec3,
	type ModelSpec,
} from "@thi.ng/webgl";

const BG_COL = [0, 0, 0, 1];

const cube = (): Partial<ModelSpec> => {
	const soa = new SOA(36, {
		pos: { size: 3 },
		normal: { size: 3 },
		col: { size: 3 },
	});
	const [a, b, c, d, e, f, g, h] = [
		...permutations([-1, 1], [-1, 1], [-1, 1]),
	];
	[
		// tuples of: quad verts, normal, color
		[a, b, c, d, [-1, 0, 0], [1, 0, 0]],
		[f, e, h, g, [1, 0, 0], [0, 1, 0]],
		[e, f, a, b, [0, -1, 0], [0, 0, 1]],
		[c, d, g, h, [0, 1, 0], [1, 1, 0]],
		[e, a, g, c, [0, 0, -1], [1, 0, 1]],
		[b, f, d, h, [0, 0, 1], [0, 1, 1]],
	].forEach(([a, b, c, d, n, col], i: number) => {
		i *= 6;
		soa.setAttribValues("pos", [a, b, d, a, d, c], i);
		soa.setAttribValues("normal", repeat(n, 6), i);
		soa.setAttribValues("col", repeat(col, 6), i);
	});
	return {
		// THIS WILL BE SIMPLIFIED!
		attribs: {
			position: { data: <Float32Array>soa.buffers.pos, size: 3 },
			normal: { data: <Float32Array>soa.buffers.normal, size: 3 },
			col: { data: <Float32Array>soa.buffers.col, size: 3 },
		},
		num: 36,
	};
};

const app = () => {
	let model: ModelSpec;
	const canvas = canvasWebGL({
		init(_, gl) {
			model = compileModel(gl, <ModelSpec>{
				shader: defShader(gl, LAMBERT({ color: "col" })),
				uniforms: {
					proj: <GLMat4>perspective([], 60, 1, 0.1, 10),
					view: <GLMat4>lookAt([], [0, 0, 4], [0, 0, 0], [0, 1, 0]),
					lightDir: <GLVec3>normalize3(null, [0.5, 0.75, 1]),
				},
				...cube(),
			});
		},
		update(_, gl, __, time) {
			if (!model) return;
			time *= 0.001;
			model.uniforms!.model = <GLMat4>(
				concat([], rotationX44([], time), rotationY44([], time * 0.66))
			);
			clearCanvas(gl, BG_COL);
			draw(model);
		},
	});
	return [canvas, { width: 600, height: 600 }];
};

start(app());
