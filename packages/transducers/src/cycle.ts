// SPDX-License-Identifier: Apache-2.0
/**
 * Iterator which yields an infinite repetition of given `input`
 * iterable's values. Produces no values if `input` is empty. If `num`
 * is given, only that many cycles will be emitted.
 *
 * @remarks
 * Also see {@link repeat}, {@link repeatedly} for related functions.
 *
 * @example
 * ```ts tangle:../export/cycle.ts
 * import { cycle, range, take } from "@thi.ng/transducers";
 *
 * // take 5 from infinite sequence
 * console.log(
 *   [...take(5, cycle([1, 2, 3]))]
 * );
 * // [1, 2, 3, 1, 2]
 *
 * // only produce 2 cycles
 * console.log(
 *   [...cycle(range(3), 2)]
 * );
 * // [ 0, 1, 2, 0, 1, 2 ]
 * ```
 *
 * @param input -
 * @param num -
 */
export function* cycle<T>(input: Iterable<T>, num = Infinity) {
	if (num < 1) return;
	let cache: T[] = [];
	for (let i of input) {
		cache.push(i);
		yield i;
	}
	if (cache.length > 0) {
		while (--num > 0) {
			yield* cache;
		}
	}
}
