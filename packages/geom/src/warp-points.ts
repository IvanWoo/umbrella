import { bounds2 } from "@thi.ng/geom-poly-utils/bounds";
import type { ReadonlyVec, Vec } from "@thi.ng/vectors/api";
import type { IShape } from "./api.js";
import type { BPatch } from "./api/bpatch.js";
import type { Rect } from "./api/rect.js";
import { mapPoint } from "./map-point.js";
import { rectFromMinMax } from "./rect.js";
import { unmapPoint } from "./unmap-point.js";

/**
 * Transfers/remaps point `p` (in world space) given in relation to `src` shape
 * to be relative to the space of `dest` shape. Writes results to `out` (or
 * creates new vector).
 *
 * @remarks
 * The type of `src` must be supported by {@link mapPoint}. The type of `dest`
 * must be supported by {@link unmapPoint}.
 *
 * @example
 * ```ts tangle:../export/warp-point.ts
 * import { rect, warpPoint } from "@thi.ng/geom";
 *
 * const p = [1075, -1975];
 *
 * // source rect [1000,-2000] .. [1100,-1900]
 * const src = rect([1000,-2000], 100);
 *
 * // destination rect [0,0] .. [0.5,0.5]
 * const dest = rect(0.5);
 *
 * // map `p` into the space of `dest` via `src`
 * console.log(warpPoint(p, dest, src));
 * // [ 0.375, 0.125 ]
 * ```
 *
 * @param p
 * @param dest
 * @param src
 * @param out
 */
export const warpPoint = (
	p: ReadonlyVec,
	dest: IShape,
	src: IShape,
	out?: Vec
) => unmapPoint(dest, mapPoint(src, p), out);

/**
 * Array version of {@link warpPoint}, transferring all points in the array from
 * world space to the local space of `dest` via the local space of `src`.
 *
 * @remarks
 * Note: Different arg orderThe type of `src` must be supported by {@link mapPoint}. The type of `dest`
 * must be supported by {@link unmapPoint}.
 *
 * @param pts
 * @param dest
 * @param src
 * @param out
 */
export const warpPoints = (
	pts: ReadonlyVec[],
	dest: IShape,
	src: IShape,
	out: Vec[] = []
) => {
	for (let n = pts.length, i = 0; i < n; i++) {
		out.push(unmapPoint(dest, mapPoint(src, pts[i])));
	}
	return out;
};

export const warpPointsBPatch = (
	pts: ReadonlyVec[],
	dest: BPatch,
	src?: Rect,
	out: Vec[] = []
) => {
	src = src || rectFromMinMax(...bounds2(pts));
	for (let i = pts.length; i-- > 0; ) {
		out[i] = dest.unmapPoint(mapPoint(src, pts[i]));
	}
	return out;
};
