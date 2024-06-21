import type { IObjectOf } from "@thi.ng/api";
import type { MultiplexTxLike, Reducer, Transducer } from "./api.js";
import { comp } from "./comp.js";
import { __iter } from "./iterator.js";
import { multiplex } from "./multiplex.js";
import { rename } from "./rename.js";

/**
 * Transducer. Similar to (and building on) {@link multiplex}, but takes an
 * object of transducers and produces a result object for each input.
 *
 * @example
 * ```ts tangle:../export/multiplex-obj.ts
 * import { multiplexObj, map } from "@thi.ng/transducers";
 *
 * const res = [...multiplexObj(
 *   {
 *     initial: map(x => x.charAt(0)),
 *     upper:   map(x => x.toUpperCase()),
 *     length:  map(x => x.length)
 *   },
 *   ["Alice", "Bob", "Charlie"]
 * )];
 *
 * console.log(res);
 * // [
 * //   { length: 5, upper: 'ALICE', initial: 'A' },
 * //   { length: 3, upper: 'BOB', initial: 'B' },
 * //   { length: 7, upper: 'CHARLIE', initial: 'C' }
 * // ]
 * ```
 *
 * @param xforms - object of transducers
 * @param rfn -
 */
export function multiplexObj<A, B>(
	xforms: IObjectOf<MultiplexTxLike<A, any>>,
	rfn?: Reducer<[PropertyKey, any], B>
): Transducer<A, B>;
export function multiplexObj<A, B>(
	xforms: IObjectOf<MultiplexTxLike<A, any>>,
	src: Iterable<A>
): IterableIterator<B>;
export function multiplexObj<A, B>(
	xforms: IObjectOf<MultiplexTxLike<A, any>>,
	rfn: Reducer<[PropertyKey, any], B>,
	src: Iterable<A>
): IterableIterator<B>;
export function multiplexObj(...args: any[]): any {
	const iter = __iter(multiplexObj, args);
	if (iter) {
		return iter;
	}
	const [xforms, rfn] = args;
	const ks = Object.keys(xforms);
	return comp(
		multiplex.apply(null, <any>ks.map((k) => xforms[k])),
		rename(ks, rfn)
	);
}
