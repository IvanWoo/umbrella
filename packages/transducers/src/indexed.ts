// SPDX-License-Identifier: Apache-2.0
import type { Transducer } from "./api.js";
import { __iter } from "./iterator.js";
import { mapIndexed } from "./map-indexed.js";

export function indexed<T>(from?: number): Transducer<T, [number, T]>;
export function indexed<T>(src: Iterable<T>): IterableIterator<[number, T]>;
export function indexed<T>(
	from: number,
	src: Iterable<T>
): IterableIterator<[number, T]>;
export function indexed<T>(...args: any[]): any {
	const iter = __iter(indexed, args);
	if (iter) {
		return iter;
	}
	const from: number = args[0] || 0;
	return mapIndexed((i, x: T) => [from + i, x]);
}
