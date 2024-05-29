import type { FnAny } from "@thi.ng/api";
import { NO_OP, SEMAPHORE } from "@thi.ng/api/api";
import { isIterable } from "@thi.ng/checks/is-iterable";
import type { Reducer, Transducer, TxLike } from "./api.js";
import { ensureTransducer } from "./ensure.js";
import { push } from "./push.js";
import { isReduced, unreduced } from "./reduced.js";

/**
 * Takes a transducer and input iterable. Returns iterator of
 * transformed results.
 *
 * @param xform -
 * @param src -
 */
export function* iterator<A, B>(
	xform: TxLike<A, B>,
	src: Iterable<A>
): IterableIterator<B> {
	const rfn = <Reducer<A, B[]>>ensureTransducer(xform)(push());
	const complete = rfn[1];
	const reduce = rfn[2];
	for (let x of src) {
		const y = reduce([], x);
		if (isReduced(y)) {
			yield* unreduced(complete(y.deref()));
			return;
		}
		if (y.length) {
			yield* y;
		}
	}
	yield* unreduced(complete([]));
}

/**
 * Optimized version of {@link iterator} for transducers which are
 * guaranteed to:
 *
 * 1) Only produce none or a single result per input
 * 2) Do not require a `completion` reduction step
 *
 * @param xform -
 * @param src -
 */
export function* iterator1<A, B>(
	xform: TxLike<A, B>,
	src: Iterable<A>
): IterableIterator<B> {
	const reduce = (<Reducer<A, B>>(
		ensureTransducer(xform)([NO_OP, NO_OP, (_, x) => x])
	))[2];
	for (let x of src) {
		let y = reduce(<any>SEMAPHORE, x);
		if (isReduced(y)) {
			y = unreduced(y.deref());
			if (<any>y !== SEMAPHORE) {
				yield <B>y;
			}
			return;
		}
		if (<any>y !== SEMAPHORE) {
			yield y;
		}
	}
}

/**
 * Helper function used by various transducers to wrap themselves as
 * transforming iterators. Delegates to {@link iterator1} by default.
 *
 * @param xform -
 * @param args -
 * @param impl -
 *
 * @internal
 */
export const __iter = (
	xform: FnAny<Transducer<any, any>>,
	args: any[],
	impl = iterator1
) => {
	const n = args.length - 1;
	return isIterable(args[n])
		? args.length > 1
			? impl(xform.apply(null, args.slice(0, n)), args[n])
			: impl(xform(), args[0])
		: undefined;
};
