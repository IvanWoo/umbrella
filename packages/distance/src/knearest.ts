// SPDX-License-Identifier: Apache-2.0
import type { IDeref } from "@thi.ng/api";
import { assert } from "@thi.ng/errors/assert";
import { Heap } from "@thi.ng/heaps/heap";
import { clamp0 } from "@thi.ng/math/interval";
import type { ReadonlyVec } from "@thi.ng/vectors";
import type { IDistance, INeighborhood, Neighbor } from "./api.js";
import { DIST_SQ, DIST_SQ1, DIST_SQ2, DIST_SQ3 } from "./squared.js";

/**
 * A {@link INeighborhood} implementation for K-nearest neighbor queries around
 * a given target location, initial query radius and {@link IDistance} metric to
 * determine proximity. See {@link Radial} for an unbounded and unsorted
 * version.
 *
 * @remarks
 * The K-nearest neighbors will be accumulated via an internal
 * [`Heap`](https://docs.thi.ng/umbrella/heaps/classes/Heap.html) and results
 * can be optionally returned in order of proximity (via {@link KNearest.deref}
 * or {@link KNearest.values}). For K=1 it will be more efficient to use
 * {@link Nearest} to avoid the additional overhead.
 *
 * @typeParam D - spatial position for distance metric
 * @typeParam T - indexed value
 */
export class KNearest<D, T>
	implements INeighborhood<D, T>, IDeref<Neighbor<T>[]>
{
	protected _currR!: number;
	protected _heap = new Heap<Neighbor<T>>(null, {
		compare: (a, b) => b[0] - a[0],
	});

	constructor(
		public readonly dist: IDistance<D>,
		public target: D,
		public k: number,
		public radius = Infinity,
		public sorted = false
	) {
		this.radius = clamp0(radius);
		this.setK(k);
	}

	reset() {
		this._currR = this.dist.to(this.radius);
		this._heap.clear();
		return this;
	}

	/**
	 * Resets search/reference position.
	 *
	 * @param target
	 */
	setTarget(target: D) {
		this.target = target;
	}

	/**
	 * Resets max. search/query radius and clears current results.
	 *
	 * @param r
	 */
	setRadius(r: number) {
		this.radius = clamp0(r);
		this.reset();
	}

	/**
	 * Resets `k-nearest` limit and clears current results.
	 *
	 * @param k
	 */
	setK(k: number) {
		assert(k > 0, `invalid k (must be > 0)`);
		this.k = k;
		this.reset();
	}

	/**
	 * Returns an array of current nearest neighbor result tuples (each `[dist,
	 * val]`). The array will contain at most `k` items and if the `sorted` ctor
	 * arg was true, will be sorted by distance.
	 *
	 * @remarks
	 * Use {@link KNearest.values} to obtain result values **without** their distance
	 * metrics.
	 */
	deref() {
		return this.sorted ? this._heap.max() : this._heap.values;
	}

	/**
	 * Similar to {@link KNearest.deref}, but returns array of result values **without**
	 * their distance metrics.
	 */
	values() {
		return this.deref().map((x) => x[1]);
	}

	includesDistance(d: number, eucledian = true) {
		return (eucledian ? this.dist.to(d) : d) <= this._currR;
	}

	includesPosition(pos: D) {
		return this.dist.metric(this.target, pos) < this._currR;
	}

	consider(pos: D, val: T) {
		const d = this.dist.metric(this.target, pos);
		if (d <= this._currR) {
			const heap = this._heap;
			if (heap.length === this.k) {
				heap.pushPop([d, val]);
				this._currR = heap.peek()![0];
			} else {
				heap.push([d, val]);
			}
		}
		return d;
	}
}

/**
 * Defines a {@link KNearest} instance for arbitrary length vector positions
 * and, by default, using an infinite region radius and {@link DIST_SQ} distance
 * metric.
 *
 * @param p -
 * @param k -
 * @param r -
 * @param dist -
 * @param sorted -
 */
export const knearest = <T>(
	p: ReadonlyVec,
	k: number,
	r?: number,
	dist = DIST_SQ,
	sorted?: boolean
) => new KNearest<ReadonlyVec, T>(dist, p, k, r, sorted);

/**
 * Defines a {@link KNearest} instance for 2D vector positions and, by default,
 * using an infinite region radius and {@link DIST_SQ2} distance metric.
 *
 * @param p -
 * @param k -
 * @param r -
 * @param dist -
 * @param sorted -
 */
export const knearest2 = <T>(
	p: ReadonlyVec,
	k: number,
	r?: number,
	dist = DIST_SQ2,
	sorted?: boolean
) => new KNearest<ReadonlyVec, T>(dist, p, k, r, sorted);

/**
 * Defines a {@link KNearest} instance for 3D vector positions, by default,
 * using an infinite region radius and {@link DIST_SQ3} distance metric.
 *
 * @param p -
 * @param k -
 * @param r -
 * @param dist -
 * @param sorted -
 */
export const knearest3 = <T>(
	p: ReadonlyVec,
	k: number,
	r?: number,
	dist = DIST_SQ3,
	sorted?: boolean
) => new KNearest<ReadonlyVec, T>(dist, p, k, r, sorted);

/**
 * Defines a {@link KNearest} instance for numeric positions and, by default,
 * using an infinite region radius and {@link DIST_SQ1} distance metric.
 *
 * @param p -
 * @param k -
 * @param r -
 * @param dist -
 * @param sorted -
 */
export const knearestN = <T>(
	p: number,
	k: number,
	r?: number,
	dist = DIST_SQ1,
	sorted?: boolean
) => new KNearest<number, T>(dist, p, k, r, sorted);
