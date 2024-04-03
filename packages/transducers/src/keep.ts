import type { Fn, Nullable } from "@thi.ng/api";
import { identity } from "@thi.ng/compose/identity";
import type { Reducer, Transducer } from "./api.js";
import { compR } from "./compr.js";
import { __iter } from "./iterator.js";

/**
 * Transducer. Only keeps values for which (optional) predicate returns a
 * non-null result. If no `pred` is given, uses values as is.
 *
 * @param pred -
 */
export function keep<T>(
	pred?: Fn<Nullable<T>, any>
): Transducer<Nullable<T>, T>;
export function keep<T>(src: Iterable<Nullable<T>>): IterableIterator<T>;
export function keep<T>(
	pred: Fn<Nullable<T>, any>,
	src: Iterable<Nullable<T>>
): IterableIterator<T>;
export function keep<T>(...args: any[]): any {
	return (
		__iter(keep, args) ||
		((rfn: Reducer<T, any>) => {
			const r = rfn[2];
			const pred: Fn<T, any> = args[0] || identity;
			return compR(rfn, (acc, x: T) =>
				pred(x) != null ? r(acc, x) : acc
			);
		})
	);
}
