import { isIterable } from "@thi.ng/checks/is-iterable";
import type { Reducer, Transducer } from "./api.js";
import { compR } from "./compr.js";
import { iterator } from "./iterator.js";
import { ensureReduced, reduced } from "./reduced.js";

/**
 * Transducer which only yields the first `n` values and then terminates
 * transformation (by emitting a {@link reduced} value).
 *
 * @example
 * ```ts
 * import { comp, map, range, take } from "@thi.ng/transducers";
 *
 * [...iterator(comp(take(5), map((x) => x * 10)), range(10))]
 * // [ 0, 10, 20, 30, 40 ]
 * ```
 *
 * @param n -
 */
export function take<T>(n: number): Transducer<T, T>;
export function take<T>(n: number, src: Iterable<T>): IterableIterator<T>;
export function take<T>(n: number, src?: Iterable<T>): any {
	return isIterable(src)
		? iterator(take(n), src)
		: (rfn: Reducer<T, any>) => {
				const r = rfn[2];
				let m = n;
				return compR(rfn, (acc, x: T) =>
					--m > 0
						? r(acc, x)
						: m === 0
						? ensureReduced(r(acc, x))
						: reduced(acc)
				);
		  };
}
