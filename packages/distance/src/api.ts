// SPDX-License-Identifier: Apache-2.0
import type { FnU2, IReset, Pair } from "@thi.ng/api";

/**
 * Distance metric function
 */
export type Metric<T> = FnU2<T, number>;

/**
 * Tuple of `[distance, T]`
 */
export type Neighbor<T> = Pair<number, T>;

/**
 * Distance metric implementation & conversions from/to raw distances.
 */
export interface IDistance<T> {
	/**
	 * The actual distance function metric.
	 */
	readonly metric: Metric<T>;

	/**
	 * Converts Eucledian distance `x` into the metric of this instance.
	 *
	 * @param x -
	 */
	to(x: number): number;

	/**
	 * Converts `x` from the metric of this instance into an Eucledian value.
	 *
	 * @param x -
	 */
	from(x: number): number;
}

export interface INeighborhood<P, T> extends IReset {
	/**
	 * The distance metric used by this neighborhood
	 */
	readonly dist: IDistance<P>;
	/**
	 * The neighborhood's target position / centroid
	 */
	readonly target: P;
	/**
	 * The neighborhood's original radius (Eucledian metric)
	 */
	readonly radius: number;

	/**
	 * Returns true, if distance `d` is <= current radius of this neighborhood.
	 * If `eucledian` is true (default: true), then `d` will first be converted
	 * into the metric used by this neighborhood using {@link IDistance.to},
	 * otherwise it is expected to be already in that metric space.
	 *
	 * @param d -
	 * @param eucledian -
	 */
	includesDistance(d: number, eucledian?: boolean): boolean;

	/**
	 * Computes distance metric between `pos` and this neighborhood's target
	 * pos. Returns true if result is <= current radius.
	 *
	 * @param pos
	 */
	includesPosition(pos: P): boolean;

	/**
	 * Computes distance metric between `pos` and this neighborhood's target
	 * pos. If result distance is <= current radius, adds `val` to neighborhood
	 * and shrinks neighborhood radius to new distance. Returns distance metric.
	 *
	 * @param pos -
	 * @param val -
	 */
	consider(pos: P, val: T): number;
}
