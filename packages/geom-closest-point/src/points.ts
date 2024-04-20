import type { FnU2, Maybe } from "@thi.ng/api";
import type { ReadonlyVec, Vec } from "@thi.ng/vectors";
import { distSq } from "@thi.ng/vectors/distsq";
import { set } from "@thi.ng/vectors/set";

/**
 * Returns closest point to `p` in given point array, optionally using custom
 * distance function `dist` (default:
 * [`distSq()`](https://docs.thi.ng/umbrella/vectors/functions/distSq.html)).
 *
 * @param p -
 * @param pts -
 * @param out -
 * @param dist -
 */
export const closestPointArray = (
	p: ReadonlyVec,
	pts: Vec[],
	out: Vec = [],
	dist: FnU2<ReadonlyVec, number> = distSq
) => {
	let minD = Infinity;
	let closest: Maybe<Vec>;
	for (let i = pts.length; i-- > 0; ) {
		const d = dist(pts[i], p);
		if (d < minD) {
			minD = d;
			closest = pts[i];
		}
	}
	return closest ? set(out, closest) : undefined;
};
