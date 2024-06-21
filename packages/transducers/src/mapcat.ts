import type { Fn, Nullable } from "@thi.ng/api";
import { isIterable } from "@thi.ng/checks/is-iterable";
import type { MaybeReduced, Transducer } from "./api.js";
import { cat } from "./cat.js";
import { comp } from "./comp.js";
import { iterator } from "./iterator.js";
import { map } from "./map.js";

/**
 * Transducer. Similar to {@link map}, but expects the given mapping function
 * `fn` to return an iterable result (or `null`) and then emits each value of
 * the result individually downstream. `null` or `undefined` result values will
 * be skipped / omitted.
 *
 * @example
 * ```ts tangle:../export/mapcat.ts
 * import { mapcat } from "@thi.ng/transducers";
 *
 * console.log(
 *   [...mapcat((x) => [x, x], [1, 2, 3])]
 * );
 * // [ 1, 1, 2, 2, 3, 3 ]
 *
 * console.log(
 *   [...mapcat((x) => x > 2 ? [x, x, x] : null, [1, 2, 3])]
 * );
 * // [ 3, 3, 3 ]
 * ```
 *
 * @param fn - mapping function
 */
export function mapcat<A, B>(
	fn: Fn<A, MaybeReduced<Nullable<Iterable<B>>>>
): Transducer<A, B>;
export function mapcat<A, B>(
	fn: Fn<A, MaybeReduced<Nullable<Iterable<B>>>>,
	src: Iterable<A>
): IterableIterator<B>;
export function mapcat<A, B>(
	fn: Fn<A, MaybeReduced<Nullable<Iterable<B>>>>,
	src?: Iterable<A>
): any {
	return isIterable(src) ? iterator(mapcat(fn), src) : comp(map(fn), cat());
}
