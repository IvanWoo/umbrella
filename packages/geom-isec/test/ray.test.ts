// SPDX-License-Identifier: Apache-2.0
import { eqDelta, maddN3, mulN3, normalize3, type Vec } from "@thi.ng/vectors";
import { expect, test } from "bun:test";
import { intersectRayAABB } from "../src/index.js";

test("rayBox inside", () => {
	const dirs: Vec[] = [
		[-1, -1, -1],
		[-1, -1, 0],
		[-1, -1, 1],
		[-1, 0, -1],
		[-1, 0, 0],
		[-1, 0, 1],
		[-1, 1, -1],
		[-1, 1, 0],
		[-1, 1, 1],
		[0, -1, -1],
		[0, -1, 0],
		[0, -1, 1],
		[0, 0, -1],
		[0, 0, 1],
		[0, 1, -1],
		[0, 1, 0],
		[0, 1, 1],
		[1, -1, -1],
		[1, -1, 0],
		[1, -1, 1],
		[1, 0, -1],
		[1, 0, 0],
		[1, 0, 1],
		[1, 1, -1],
		[1, 1, 0],
		[1, 1, 1],
	];
	for (let d of dirs) {
		const n = normalize3([], d);
		const i = intersectRayAABB([5, 5, 5], n, [0, 0, 0], [10, 10, 10]);
		const expected = maddN3([], n, i.alpha!, [5, 5, 5]);
		expect(i.inside).toBeTrue();
		expect(eqDelta(expected, <Vec>i.isec![0])).toBeTrue();
	}
});

test("rayBox outside", () => {
	const dirs: Vec[] = [
		[1, 0, 0],
		[0, 1, 0],
		[0, 0, 1],
	];
	for (let d of dirs) {
		let o = mulN3([], d, -10);
		let i = intersectRayAABB(o, d, [-5, -5, -5], [5, 5, 5]);
		let expected = maddN3([], d, i.alpha!, o);
		expect(eqDelta(expected, <Vec>i.isec![0])).toBeTrue();
		d = mulN3(d, d, -1);
		o = mulN3([], d, -10);
		i = intersectRayAABB(o, d, [-5, -5, -5], [5, 5, 5]);
		expected = maddN3([], d, i.alpha!, o);
		expect(eqDelta(expected, <Vec>i.isec![0])).toBeTrue();
	}
});
