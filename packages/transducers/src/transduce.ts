import type { FnAny } from "@thi.ng/api";
import { illegalArity } from "@thi.ng/errors/illegal-arity";
import type { IReducible, Reducer, Transducer, TxLike } from "./api.js";
import { ensureTransducer } from "./ensure.js";
import { map } from "./map.js";
import { reduce, reduceRight } from "./reduce.js";

export function transduce<A, B, C>(
	tx: TxLike<A, B>,
	rfn: Reducer<B, C>
): Transducer<Iterable<A>, C>;
export function transduce<A, B, C>(
	tx: TxLike<A, B>,
	rfn: Reducer<B, C>,
	xs: Iterable<A>
): C;
export function transduce<A, B, C>(
	tx: TxLike<A, B>,
	rfn: Reducer<B, C>,
	xs: IReducible<A, C>
): C;
export function transduce<A, B, C>(
	tx: TxLike<A, B>,
	rfn: Reducer<B, C>,
	acc: C,
	xs: Iterable<A>
): C;
export function transduce<A, B, C>(
	tx: TxLike<A, B>,
	rfn: Reducer<C, B>,
	acc: C,
	xs: IReducible<A, C>
): C;
export function transduce(...args: any[]): any {
	return $transduce(transduce, reduce, args);
}

export function transduceRight<A, B, C>(
	tx: TxLike<A, B>,
	rfn: Reducer<B, C>
): Transducer<ArrayLike<A>, C>;
export function transduceRight<A, B, C>(
	tx: TxLike<A, B>,
	rfn: Reducer<B, C>,
	xs: ArrayLike<A>
): C;
export function transduceRight<A, B, C>(
	tx: TxLike<A, B>,
	rfn: Reducer<B, C>,
	acc: C,
	xs: ArrayLike<A>
): C;
export function transduceRight(...args: any[]): any {
	return $transduce(transduceRight, reduceRight, args);
}

const $transduce = (tfn: FnAny<any>, rfn: FnAny<any>, args: any[]) => {
	let acc, xs;
	switch (args.length) {
		case 4:
			xs = args[3];
			acc = args[2];
			break;
		case 3:
			xs = args[2];
			break;
		case 2:
			return map((x: ArrayLike<any>) => tfn(args[0], args[1], x));
		default:
			illegalArity(args.length);
	}
	return rfn(ensureTransducer(args[0])(args[1]), acc, xs);
};
