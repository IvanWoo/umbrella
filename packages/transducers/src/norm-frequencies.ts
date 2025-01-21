// SPDX-License-Identifier: Apache-2.0
import type { Fn } from "@thi.ng/api";
import { identity } from "@thi.ng/compose/identity";
import type { Reducer } from "./api.js";
import { groupByMap } from "./group-by-map.js";
import { normCount } from "./norm-count.js";
import { $$reduce } from "./reduce.js";

/**
 * Similar to {@link frequencies}, but with each bin value normalized to given
 * `norm`.
 *
 * @remarks
 * Also see {@link normFrequenciesAuto}.
 *
 * @example
 * ```ts tangle:../export/norm-frequencies.ts
 * import { normFrequencies } from "@thi.ng/transducers";
 *
 * const items = [1, 2, 3, 1, 1, 4, 2, 5, 1, 2];
 *
 * console.log(
 *   normFrequencies(10, items)
 * );
 * // Map(5) {
 * //   1 => 0.4,
 * //   2 => 0.3,
 * //   3 => 0.1,
 * //   4 => 0.1,
 * //   5 => 0.1,
 * // }
 * ```
 *
 * @param norm -
 */
export function normFrequencies<A>(norm: number): Reducer<A, Map<A, number>>;
export function normFrequencies<A>(
	norm: number,
	src: Iterable<A>
): Map<A, number>;
export function normFrequencies<A, B>(
	norm: number,
	key: Fn<A, B>
): Reducer<A, Map<B, number>>;
export function normFrequencies<A, B>(
	norm: number,
	key: Fn<A, B>,
	src: Iterable<A>
): Map<B, number>;
export function normFrequencies(...args: any[]): any {
	return (
		$$reduce(normFrequencies, args) ||
		groupByMap({
			key: args[1] || identity,
			group: normCount(args[0]),
		})
	);
}
