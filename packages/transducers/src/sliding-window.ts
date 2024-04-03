import { deref, type MaybeDeref } from "@thi.ng/api/deref";
import type { Reducer, Transducer } from "./api.js";
import { compR } from "./compr.js";
import { __iter } from "./iterator.js";

/**
 * Sliding window transducer, similar to `partition(size, 1)`, but supports
 * initially partially filled windows, if `partial` is set to true (default).
 * Each emitted window is a shallow copy of the internal accumulation buffer.
 *
 * @remarks
 * If `size` implements
 * [`IDeref`](https://docs.thi.ng/umbrella/api/interfaces/IDeref.html), the
 * window size will be re-evaluated for each new input and therefore can be used
 * as mechanism to dynamically adjust the window size.
 *
 * @example
 * ```ts
 * import { range, slidingWindow } from "@thi.ng/transducers";
 *
 * [...slidingWindow(3, range(5))]
 * // [ [ 0 ], [ 0, 1 ], [ 0, 1, 2 ], [ 1, 2, 3 ], [ 2, 3, 4 ] ]
 *
 * [...slidingWindow(3, false, range(5))]
 * // [ [ 0, 1, 2 ], [ 1, 2, 3 ], [ 2, 3, 4 ] ]
 * ```
 *
 * @param size -
 * @param partial -
 */
export function slidingWindow<T>(
	size: MaybeDeref<number>,
	partial?: boolean
): Transducer<T, T[]>;
export function slidingWindow<T>(
	size: MaybeDeref<number>,
	src: Iterable<T>
): IterableIterator<T[]>;
export function slidingWindow<T>(
	size: MaybeDeref<number>,
	partial: boolean,
	src: Iterable<T>
): IterableIterator<T[]>;
export function slidingWindow<T>(...args: any[]): any {
	const iter = __iter(slidingWindow, args);
	if (iter) return iter;
	const size: MaybeDeref<number> = args[0];
	const partial: boolean = args[1] !== false;
	return (rfn: Reducer<T[], any>) => {
		const reduce = rfn[2];
		let buf: T[] = [];
		return compR(rfn, (acc, x: T) => {
			buf.push(x);
			const _size = deref(size);
			if (partial || buf.length >= _size) {
				acc = reduce(acc, buf);
				buf = buf.slice(buf.length >= _size ? 1 : 0, _size);
			}
			return acc;
		});
	};
}
