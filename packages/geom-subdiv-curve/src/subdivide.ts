import type { SubdivKernel } from "@thi.ng/geom-api";
import { isArray } from "@thi.ng/checks/is-array";
import { comp } from "@thi.ng/transducers/comp";
import { mapcatIndexed } from "@thi.ng/transducers/mapcat-indexed";
import { partition } from "@thi.ng/transducers/partition";
import { push } from "@thi.ng/transducers/push";
import { transduce } from "@thi.ng/transducers/transduce";
import type { ReadonlyVec, Vec } from "@thi.ng/vectors";
import { repeat } from "@thi.ng/transducers/repeat";

/**
 * http://algorithmicbotany.org/papers/subgpu.sig2003.pdf
 *
 * @param kernel - subdivision scheme(s)
 * @param pts - source points
 * @param iter - number of iterations
 */
export function subdivide(
	pts: ReadonlyVec[],
	kernel: SubdivKernel,
	iter?: number
): ReadonlyVec[];
export function subdivide(
	pts: ReadonlyVec[],
	kernels: SubdivKernel[]
): ReadonlyVec[];
export function subdivide(
	pts: ReadonlyVec[],
	kernels: SubdivKernel | SubdivKernel[],
	iter = 1
) {
	kernels = isArray(kernels) ? kernels : [...repeat(kernels, iter)];
	for (let { fn, pre, size } of kernels) {
		const nump = pts.length;
		pts = transduce<ReadonlyVec, ReadonlyVec, Vec[]>(
			comp(
				partition(size, 1),
				mapcatIndexed((i, pts) => fn(pts, i, nump))
			),
			push(),
			pre ? pre(pts) : pts
		);
	}
	return pts;
}
