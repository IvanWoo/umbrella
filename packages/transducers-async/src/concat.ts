import type { MaybeAsyncIterable, Nullable } from "@thi.ng/api";
import { ensureIterable } from "./ensure.js";

/**
 * Yields async iterator producing concatenation of given (possibly async)
 * iterables. Undefined & null inputs are silently ignored, however any such
 * values produced or contained in an input iterable will remain.
 *
 * @example
 * ```ts tangle:../export/concat.ts
 * import { concat, push, repeatedly } from "@thi.ng/transducers-async";
 *
 * console.log(
 *   await push(
 *     concat(
 *       repeatedly(async (i) => i + 1, 3),
 *       // next 2 inputs will be ignored..
 *       undefined,
 *       null,
 *       [4, 5]
 *     )
 *   )
 * );
 * // [ 1, 2, 3, 4, 5 ]
 *
 * console.log(
 *   await push(concat([1, 2, 3, undefined], null, [4, 5]))
 * );
 * // [ 1, 2, 3, undefined, 4, 5 ]
 * ```
 *
 * @param xs -
 */
export async function* concat<T>(
	...xs: Nullable<MaybeAsyncIterable<T>>[]
): AsyncIterableIterator<T> {
	for (let x of xs) {
		x != null && (yield* ensureIterable(x));
	}
}
