import type { Fn0, FnAny } from "@thi.ng/api";
import { identity } from "@thi.ng/api/fn";
import { implementsFunction } from "@thi.ng/checks/implements-function";
import { isArrayLike } from "@thi.ng/checks/is-arraylike";
import { isIterable } from "@thi.ng/checks/is-iterable";
import { illegalArity } from "@thi.ng/errors/illegal-arity";
import type { IReducible, Reducer, ReductionFn } from "./api.js";
import { isReduced, unreduced } from "./reduced.js";

const parseArgs = (args: any[]) =>
	args.length === 2
		? [undefined, args[1]]
		: args.length === 3
		? [args[1], args[2]]
		: illegalArity(args.length);

export function reduce<A, B>(rfn: Reducer<A, B>, xs: Iterable<A>): B;
export function reduce<A, B>(rfn: Reducer<A, B>, acc: B, xs: Iterable<A>): B;
export function reduce<A, B>(rfn: Reducer<A, B>, xs: IReducible<A, B>): B;
export function reduce<A, B>(
	rfn: Reducer<A, B>,
	acc: A,
	xs: IReducible<A, B>
): B;
export function reduce<A, B>(...args: any[]): B {
	const rfn = args[0];
	const init = rfn[0];
	const complete = rfn[1];
	const reduce = rfn[2];
	args = parseArgs(args);
	const acc: B = args[0] == null ? init() : args[0];
	const xs: Iterable<A> | IReducible<A, B> = args[1];
	return unreduced(
		complete(
			implementsFunction(xs, "$reduce")
				? xs.$reduce(reduce, acc)
				: isArrayLike(xs)
				? reduceArray(reduce, acc, xs)
				: reduceIterable(reduce, acc, <Iterable<A>>xs)
		)
	);
}

export function reduceRight<A, B>(rfn: Reducer<A, B>, xs: ArrayLike<A>): B;
export function reduceRight<A, B>(
	rfn: Reducer<A, B>,
	acc: B,
	xs: ArrayLike<A>
): B;
export function reduceRight<A, B>(...args: any[]): B {
	const [init, complete, reduce]: Reducer<A, B> = args[0];
	args = parseArgs(args);
	let acc: B = args[0] == null ? init() : args[0];
	const xs: Array<A> = args[1];
	for (let i = xs.length; i-- > 0; ) {
		acc = <any>reduce(acc, xs[i]);
		if (isReduced(acc)) {
			acc = (<any>acc).deref();
			break;
		}
	}
	return unreduced(complete(acc));
}

const reduceArray = <A, B>(
	rfn: ReductionFn<A, B>,
	acc: B,
	xs: ArrayLike<A>
) => {
	for (let i = 0, n = xs.length; i < n; i++) {
		acc = <any>rfn(acc, xs[i]);
		if (isReduced(acc)) {
			acc = (<any>acc).deref();
			break;
		}
	}
	return acc;
};

const reduceIterable = <A, B>(
	rfn: ReductionFn<A, B>,
	acc: B,
	xs: Iterable<A>
) => {
	for (let x of xs) {
		acc = <any>rfn(acc, x);
		if (isReduced(acc)) {
			acc = (<any>acc).deref();
			break;
		}
	}
	return acc;
};

/**
 * Convenience helper for building a full {@link Reducer} using the identity
 * function (i.e. `(x) => x`) as completion step (true for 90% of all
 * bundled transducers).
 *
 * @param init - init step of reducer
 * @param rfn - reduction step of reducer
 */
export const reducer = <A, B>(init: Fn0<B>, rfn: ReductionFn<A, B>) =>
	<Reducer<A, B>>[init, identity, rfn];

export const $$reduce = (rfn: FnAny<Reducer<any, any>>, args: any[]) => {
	const n = args.length - 1;
	return isIterable(args[n])
		? args.length > 1
			? reduce(rfn.apply(null, args.slice(0, n)), args[n])
			: reduce(rfn(), args[0])
		: undefined;
};
