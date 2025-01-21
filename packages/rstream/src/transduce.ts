// SPDX-License-Identifier: Apache-2.0
import type { Reduced, Reducer, Transducer } from "@thi.ng/transducers";
import { isReduced } from "@thi.ng/transducers/reduced";
import type { ISubscription } from "./api.js";
import type { Subscription } from "./subscription.js";

/**
 * Returns a promise which subscribes to given input and transforms
 * incoming values using given transducer `xform` and reducer `rfn`.
 *
 * @remarks
 * Once the input or the reducer is done, the promise will resolve with
 * the final reduced result (or fail with error).
 *
 * @example
 * ```ts tangle:../export/transduce.ts
 * import { fromIterable, transduce } from "@thi.ng/rstream";
 * import { add, map, range } from "@thi.ng/transducers";
 *
 * transduce(
 *   fromIterable(range(10)),
 *   map((x) => x * 10),
 *   add()
 * ).then((x) => console.log("result", x))
 *
 * // result 450
 * ```
 *
 * @param src -
 * @param xform -
 * @param rfn -
 * @param init -
 */
export const transduce = <A, B, C>(
	src: Subscription<any, A>,
	xform: Transducer<A, B>,
	rfn: Reducer<B, C>,
	init?: C
): Promise<C> => {
	let acc = init !== undefined ? init : rfn[0]();
	let sub: ISubscription<A, B>;

	return new Promise<C>((resolve, reject) => {
		sub = src.subscribe(
			{
				next(x) {
					let _acc: C | Reduced<C>;
					try {
						_acc = rfn[2](acc, x);
					} catch (e) {
						reject(e);
						return;
					}
					if (isReduced(_acc)) {
						resolve(_acc.deref());
					} else {
						acc = _acc;
					}
				},
				done() {
					resolve(acc);
				},
				error(e) {
					reject(e);
					return false;
				},
			},
			{ xform }
		);
	}).then(
		(fulfilled) => {
			sub.unsubscribe();
			return fulfilled;
		},
		(rejected) => {
			sub.unsubscribe();
			throw rejected;
		}
	);
};
