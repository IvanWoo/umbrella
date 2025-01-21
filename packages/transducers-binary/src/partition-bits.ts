// SPDX-License-Identifier: Apache-2.0
import type { Reducer, Transducer } from "@thi.ng/transducers";
import { iterator, __iter } from "@thi.ng/transducers/iterator";
import { isReduced } from "@thi.ng/transducers/reduced";

/**
 * Transducer.
 *
 * @param destSize - target word size (bits)
 * @param srcSize - source word size (bits)
 */
export function partitionBits(
	destSize: number,
	srcSize?: number
): Transducer<number, number>;
export function partitionBits(
	destSize: number,
	src: Iterable<number>
): IterableIterator<number>;
export function partitionBits(
	destSize: number,
	srcSize: number,
	src: Iterable<number>
): IterableIterator<number>;
export function partitionBits(...args: any[]): any {
	return (
		__iter(partitionBits, args, iterator) ||
		((rfn: Reducer<number, any>) => {
			const destSize = args[0];
			const srcSize = args[1] || 8;
			return destSize < srcSize
				? __small(rfn, destSize, srcSize)
				: destSize > srcSize
				? __large(rfn, destSize, srcSize)
				: rfn;
		})
	);
}

/** @internal */
const __small = (
	[init, complete, reduce]: Reducer<number, any>,
	n: number,
	wordSize: number
): Reducer<number, any> => {
	const maxb = wordSize - n;
	const m1 = (1 << wordSize) - 1;
	const m2 = (1 << n) - 1;
	let r = 0;
	let y = 0;
	return [
		init,
		(acc) => complete(r > 0 ? reduce(acc, y) : acc),
		(acc, x) => {
			let b = 0;
			do {
				acc = reduce(acc, y + ((x >>> (maxb + r)) & m2));
				b += n - r;
				x = (x << (n - r)) & m1;
				y = 0;
				r = 0;
			} while (b <= maxb && !isReduced(acc));
			r = wordSize - b;
			y = r > 0 ? (x >>> maxb) & m2 : 0;
			return acc;
		},
	];
};

/** @internal */
const __large = (
	[init, complete, reduce]: Reducer<number, any>,
	n: number,
	wordSize: number
): Reducer<number, any> => {
	const m1 = (1 << wordSize) - 1;
	let r = 0;
	let y = 0;
	return [
		init,
		(acc) => complete(r > 0 ? reduce(acc, y) : acc),
		(acc, x) => {
			if (r + wordSize <= n) {
				y |= (x & m1) << (n - wordSize - r);
				r += wordSize;
				if (r === n) {
					acc = reduce(acc, y);
					y = 0;
					r = 0;
				}
			} else {
				const k = n - r;
				r = wordSize - k;
				acc = reduce(acc, y | ((x >>> r) & ((1 << k) - 1)));
				y = (x & ((1 << r) - 1)) << (n - r);
			}
			return acc;
		},
	];
};
