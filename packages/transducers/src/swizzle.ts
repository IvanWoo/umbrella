// SPDX-License-Identifier: Apache-2.0
import { swizzle as _swizzle } from "@thi.ng/arrays/swizzle";
import { isIterable } from "@thi.ng/checks/is-iterable";
import type { Transducer } from "./api.js";
import { iterator1 } from "./iterator.js";
import { map } from "./map.js";

/**
 * Transducer which performs value reordering on inputs using provided property
 * order. Accepts arrays or objects as input, but always yields arrays.
 *
 * @example
 * ```ts tangle:../export/swizzle.ts
 * import { swizzle } from "@thi.ng/transducers";
 *
 * console.log(
 *   [...swizzle([3, 0, 2, 1], [[1, 2, 3, 4], [10, 20, 30, 40]])]
 * );
 * // [ [ 4, 1, 3, 2 ], [ 40, 10, 30, 20 ] ]
 *
 * console.log(
 *   [...swizzle([0, 0, 1, 1], [[1, 2, 3, 4], [10, 20, 30, 40]])]
 * );
 * // [ [ 1, 1, 2, 2 ], [ 10, 10, 20, 20 ] ]
 *
 * console.log(
 *   [...swizzle(["z", "x"], [{x: 1, y: 2, z: 3}])]
 * );
 * // [ [ 3, 1 ] ]
 * ```
 *
 * @remarks
 * Also see
 * [`swizzle`](https://docs.thi.ng/umbrella/arrays/functions/swizzle.html)
 *
 * @param order - key order
 */
export function swizzle<T>(order: PropertyKey[]): Transducer<T, any[]>;
export function swizzle<T>(
	order: PropertyKey[],
	src: Iterable<any>
): IterableIterator<any[]>;
export function swizzle(order: PropertyKey[], src?: Iterable<any>): any {
	return isIterable(src)
		? iterator1(swizzle(order), src)
		: map(_swizzle(order));
}
