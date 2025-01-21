// SPDX-License-Identifier: Apache-2.0
import { copy } from "@thi.ng/object-utils/copy";
import { empty } from "@thi.ng/object-utils/empty";
import type { Reducer } from "@thi.ng/transducers";
import { __combineSet } from "./internal/combine.js";
import { into } from "./into.js";

/**
 * Computes the difference of sets `a - b` and writes results to new set
 * or optionally given set `out` (assumed to be empty for correct
 * results).
 *
 * @param a - first set
 * @param b - other set
 * @param out - optional result set
 */
export const difference = <T>(a: Set<T>, b: Set<T>, out?: Set<T>): Set<T> => {
	if (a === b) {
		return out || empty(a, Set);
	}
	out = out ? into(out, a) : copy(a, Set);
	for (let i of b) {
		out!.delete(i);
	}
	return out!;
};

/**
 * Reducer version of {@link difference}. If `src` is given returns the reduced
 * difference of given inputs, else merely returns a reducer to be used with
 * [`reduce()`](https://docs.thi.ng/umbrella/transducers/functions/reduce.html)
 * /
 * [`transduce()`](https://docs.thi.ng/umbrella/transducers/functions/transduce.html)
 * functions.
 *
 * @param src - input collections
 */
export function differenceR<T>(): Reducer<Iterable<T>, Set<T>>;
export function differenceR<T>(src: Iterable<Iterable<T>>): Set<T>;
export function differenceR<T>(src?: Iterable<Iterable<T>>) {
	return __combineSet<T>(differenceR, difference, src);
}
