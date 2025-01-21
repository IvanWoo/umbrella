// SPDX-License-Identifier: Apache-2.0
import { sincos } from "@thi.ng/math/angle";
import type { ReadonlyVec } from "@thi.ng/vectors";
import { normalize3 } from "@thi.ng/vectors/normalize";
import { setC } from "@thi.ng/vectors/setc";
import type { Mat } from "./api.js";
import { mat33to44 } from "./m33-m44.js";

/**
 * Constructs a 3x3 matrix representing a rotation of `theta` around
 * `axis` and writes result to `out`. If `normalize` is true (default
 * false), non-destructively first normalizes axis vector.
 *
 * @param out -
 * @param axis -
 * @param theta -
 * @param normalize -
 */
export const rotationAroundAxis33 = (
	out: Mat | null,
	axis: ReadonlyVec,
	theta: number,
	normalize = false
): Mat => {
	const [x, y, z] = normalize ? normalize3([], axis) : axis;
	const [s, c] = sincos(theta);
	const t = 1 - c;
	const xs = x * s;
	const ys = y * s;
	const zs = z * s;
	const xt = x * t;
	const yt = y * t;
	const zt = z * t;
	return setC(
		out || [],
		x * xt + c,
		y * xt + zs,
		z * xt - ys,
		x * yt - zs,
		y * yt + c,
		z * yt + xs,
		x * zt + ys,
		y * zt - xs,
		z * zt + c
	);
};

/**
 * Constructs a 4x4 matrix representing a rotation of `theta` around
 * `axis` and writes result to `out`. If `normalize` is true (default
 * false), non-destructively first normalizes axis vector.
 *
 * @param out -
 * @param axis -
 * @param theta -
 * @param normalize -
 */
export const rotationAroundAxis44 = (
	out: Mat | null,
	axis: ReadonlyVec,
	theta: number,
	normalize = false
) => mat33to44(out, rotationAroundAxis33([], axis, theta, normalize));
