// SPDX-License-Identifier: Apache-2.0
import type { FnU4 } from "@thi.ng/api";
import { closestPointSegment } from "@thi.ng/geom-closest-point/line";
import { EPS } from "@thi.ng/math/api";
import { eqDelta } from "@thi.ng/math/eqdelta";
import type { ReadonlyVec } from "@thi.ng/vectors";
import { mixN2 } from "@thi.ng/vectors/mixn";
import { IntersectionType, type IntersectionResult } from "./api.js";

/**
 * 2D only. Computes intersection between two lines defined by pairs `a`,`b` and
 * `c`,`d`.
 *
 * @param a
 * @param b
 * @param c
 * @param d
 * @param eps
 */
export const intersectLineLine = (
	a: ReadonlyVec,
	b: ReadonlyVec,
	c: ReadonlyVec,
	d: ReadonlyVec,
	eps = EPS
): IntersectionResult => {
	const bax = b[0] - a[0];
	const bay = b[1] - a[1];
	const dcx = d[0] - c[0];
	const dcy = d[1] - c[1];
	const acx = a[0] - c[0];
	const acy = a[1] - c[1];
	const det = dcy * bax - dcx * bay;
	let alpha = dcx * acy - dcy * acx;
	let beta = bax * acy - bay * acx;
	if (eqDelta(det, 0, eps)) {
		if (eqDelta(alpha, 0, eps) && eqDelta(beta, 0, eps)) {
			let isec =
				closestPointSegment(c, a, b, undefined, true) ||
				closestPointSegment(d, a, b, undefined, true);
			return {
				type: isec
					? IntersectionType.COINCIDENT
					: IntersectionType.COINCIDENT_NO_INTERSECT,
				isec: isec ? [isec] : isec,
			};
		}
		return { type: IntersectionType.PARALLEL };
	}
	alpha /= det;
	beta /= det;
	const ieps = 1 - eps;
	return {
		type:
			eps < alpha && alpha < ieps && eps < beta && beta < ieps
				? IntersectionType.INTERSECT
				: IntersectionType.INTERSECT_OUTSIDE,
		isec: [mixN2([], a, b, alpha)],
		alpha,
		beta,
		det,
	};
};

/**
 * 2D only. Returns true if line `a`,`b` is parallel (or coincident) to
 * line `c`,`d`.
 *
 * @param a - line 1 start point
 * @param b - line 1 end point
 * @param c - line 2 start point
 * @param d - line 2 end point
 */
export const isParallelLine: FnU4<ReadonlyVec, boolean> = (a, b, c, d) =>
	eqDelta((d[1] - c[1]) * (b[0] - a[0]) - (d[0] - c[0]) * (b[1] - a[1]), 0);
