import { isIterable } from "@thi.ng/checks/is-iterable";
import type { Reducer, Transducer } from "./api.js";
import { __drain } from "./internal/drain.js";
import { iterator } from "./iterator.js";

/**
 * Transducer which only yields the last `n` values. Assumes
 * input source is finite (of course).
 *
 * @example
 * ```ts tangle:../export/take-last.ts
 * import { range, takeLast } from "@thi.ng/transducers";
 *
 * console.log(
 *   [...takeLast(3, range(10))]
 * );
 * // [ 7, 8, 9 ]
 * ```
 *
 * @param n -
 */
export function takeLast<T>(n: number): Transducer<T, T>;
export function takeLast<T>(n: number, src: Iterable<T>): IterableIterator<T>;
export function takeLast<T>(n: number, src?: Iterable<T>): any {
	return isIterable(src)
		? iterator(takeLast(n), src)
		: ([init, complete, reduce]: Reducer<T, any>) => {
				const buf: T[] = [];
				return <Reducer<T, any>>[
					init,
					__drain(buf, complete, reduce),
					(acc, x) => {
						if (buf.length === n) {
							buf.shift();
						}
						buf.push(x);
						return acc;
					},
				];
		  };
}
