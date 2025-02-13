// SPDX-License-Identifier: Apache-2.0
import { minError } from "@thi.ng/math/min-error";
import type { ReadonlyVec, Vec } from "@thi.ng/vectors";
import { distSq } from "@thi.ng/vectors/distsq";
import { mixCubic } from "@thi.ng/vectors/mix-cubic";

/**
 * Performs recursive search for closest point to `p` on cubic curve defined by
 * control points `a`,`b`,`c`,`d`. The `res` and `recur` params are used to
 * control the recursion behavior. If `eps` is given, the search is terminated
 * as soon as a point with a shorter *squared* distance than `eps` is found.
 *
 * [`minError`](https://docs.thi.ng/umbrella/math/functions/minError.html)
 *
 * @param p - query point
 * @param a - control point 1
 * @param b - control point 2
 * @param c - control point 3
 * @param d - control point 4
 * @param res - search steps per iteration
 * @param iter - iterations
 * @param eps - epsilon value
 */
export const closestPointCubic = (
	p: ReadonlyVec,
	a: ReadonlyVec,
	b: ReadonlyVec,
	c: ReadonlyVec,
	d: ReadonlyVec,
	out: Vec = [],
	res?: number,
	iter?: number,
	eps?: number
) => {
	const fn = (t: number) => mixCubic(out, a, b, c, d, t);
	return fn(minError(fn, distSq, p, res, iter, 0, 1, eps));
};
