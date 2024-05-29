import type { Predicate } from "@thi.ng/api";
import type { Reducer } from "./api.js";
import { $$reduce, reducer } from "./reduce.js";
import { reduced } from "./reduced.js";

/**
 * Similar to {@link every} reducer, but only requires at least 1 value to
 * succeed predicate test (and then immediately terminates with `true` as
 * result).
 *
 * @param pred -
 */
export function some<T>(pred?: Predicate<T>): Reducer<T, boolean>;
export function some<T>(src: Iterable<T>): boolean;
export function some<T>(pred: Predicate<T>, src: Iterable<T>): boolean;
export function some<T>(...args: any[]): any {
	const res = $$reduce(some, args);
	if (res !== undefined) return res;

	const pred = args[0];
	return reducer(
		() => false,
		pred
			? (acc, x: T) => (pred(x) ? reduced(true) : acc)
			: (acc, x: T) => (x ? reduced(true) : acc)
	);
}
