// SPDX-License-Identifier: Apache-2.0
import { EPS } from "@thi.ng/math/api";
import type { ReadonlyVec } from "@thi.ng/vectors";
import { normalize3, normalize4 } from "@thi.ng/vectors/normalize";

/**
 * Computes a quaternion representing the rotation `theta` around
 * `axis`.
 *
 * @param axis -
 * @param theta -
 */
export const quatFromAxisAngle = (axis: ReadonlyVec, theta: number) => {
	theta *= 0.5;
	return normalize3([0, 0, 0, Math.cos(theta)], axis, Math.sin(theta));
};

/**
 * Decomposes quaternion into `[axis, theta]` tuple.
 *
 * @param quat -
 */
export const quatToAxisAngle = (quat: ReadonlyVec) => {
	const n = normalize4([], quat);
	const w = n[3];
	const m = Math.sqrt(1 - w * w);
	const theta = 2 * Math.acos(w);
	return m > EPS
		? [[n[0] / m, n[1] / m, n[2] / m], theta]
		: [[n[0], n[1], n[2]], theta];
};
