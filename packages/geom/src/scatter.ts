import type { IShape } from "./api.js";
import { SYSTEM } from "@thi.ng/random/system";
import type { Vec } from "@thi.ng/vectors";
import { randMinMax } from "@thi.ng/vectors/rand-minmax";
import { bounds } from "./bounds.js";
import { pointInside } from "./point-inside.js";

/**
 * Produces `num` random points for which {@link pointInside} succeeds for the
 * given `shape`. Writes results into `out` array (or creates a new one).
 *
 * @remarks
 * Samples are only created with the shapes bounding box and are chosen using
 * optionally provided `rnd`
 * [`IRandom`](https://docs.thi.ng/umbrella/random/interfaces/IRandom.html)
 * instance.
 *
 * @param shape
 * @param num
 * @param rnd
 * @param out
 */
export const scatter = (
	shape: IShape,
	num: number,
	rnd = SYSTEM,
	out: Vec[] = []
) => {
	const b = bounds(shape);
	if (!b) return;
	const mi = b.pos;
	const mx = b.max();
	for (; num-- > 0; ) {
		while (true) {
			const p = randMinMax([], mi, mx, rnd);
			if (pointInside(shape, p)) {
				out.push(p);
				break;
			}
		}
	}
	return out;
};
