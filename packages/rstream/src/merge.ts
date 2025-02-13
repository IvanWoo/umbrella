// SPDX-License-Identifier: Apache-2.0
import {
	State,
	type ISubscribable,
	type ISubscription,
	type TransformableOpts,
} from "./api.js";
import { isFirstOrLastInput } from "./checks.js";
import { __optsWithID } from "./idgen.js";
import { __removeAllIDs } from "./internal/remove.js";
import { Subscription } from "./subscription.js";

export interface StreamMergeOpts<A, B> extends TransformableOpts<A, B> {
	/**
	 * Input sources.
	 */
	src: ISubscribable<A>[];
}

/**
 * Returns a new {@link StreamMerge} subscription, consuming values from
 * multiple inputs and passing received values on to any subscribers.
 *
 * @remarks
 * Input streams can be added and removed dynamically. By default, `StreamMerge`
 * calls {@link ISubscriber.done} when the last active input is done, but this
 * behavior can be overridden via the provided
 * {@link StreamMergeOpts | options}.
 *
 * @example
 * ```ts tangle:../export/merge.ts
 * import { fromIterable, merge, trace } from "@thi.ng/rstream";
 *
 * merge({
 *     // input streams w/ different frequencies
 *     src: [
 *         fromIterable([1, 2, 3], { delay: 10 }),
 *         fromIterable([10, 20, 30], { delay: 21 }),
 *         fromIterable([100, 200, 300], { delay: 7 })
 *     ]
 * }).subscribe(trace());
 * // 100
 * // 1
 * // 200
 * // 10
 * // 2
 * // 300
 * // 3
 * // 20
 * // 30
 * // done
 * ```
 *
 * @example
 * Use the
 * [`labeled`](https://docs.thi.ng/umbrella/transducers/functions/labeled.html)
 * transducer for each input to create a stream of labeled values and
 * track their provenance:
 *
 * @example
 * ```ts tangle:../export/merge-2.ts
 * import { fromIterable, merge, trace } from "@thi.ng/rstream";
 * import { labeled } from "@thi.ng/transducers";
 *
 * merge({
 *     src: [
 *         fromIterable([1, 2, 3]).transform(labeled("a")),
 *         fromIterable([10, 20, 30]).transform(labeled("b")),
 *     ]
 * }).subscribe(trace());
 * // ["a", 1]
 * // ["b", 10]
 * // ["a", 2]
 * // ["b", 20]
 * // ["a", 3]
 * // ["b", 30]
 * // done
 * ```
 *
 * @param opts -
 */
export const merge = <A, B>(opts?: Partial<StreamMergeOpts<A, B>>) =>
	new StreamMerge(opts);

/**
 * See {@link merge} for reference & examples.
 */
export class StreamMerge<A, B> extends Subscription<A, B> {
	sources: Map<ISubscribable<A>, ISubscription<A, any>>;

	constructor(opts?: Partial<StreamMergeOpts<A, B>>) {
		opts = opts || {};
		super(undefined, __optsWithID("streammerge", opts));
		this.sources = new Map();
		opts.src && this.addAll(opts.src);
	}

	add(src: ISubscribable<A>) {
		this.ensureState();
		this.sources.set(
			src,
			src.subscribe(
				{
					next: (x) =>
						x instanceof Subscription ? this.add(x) : this.next(x),
					done: () => this.markDone(src),
					__owner: this,
				},
				{ id: `in-${src.id}` }
			)
		);
	}

	addAll(src: Iterable<ISubscribable<A>>) {
		for (let s of src) {
			this.add(s);
		}
	}

	remove(src: ISubscribable<A>) {
		const sub = this.sources.get(src);
		if (sub) {
			this.sources.delete(src);
			sub.unsubscribe();
			return true;
		}
		return false;
	}

	removeID(id: string) {
		for (let s of this.sources) {
			if (s[0].id === id) {
				return this.remove(s[0]);
			}
		}
		return false;
	}

	removeAll(src: Iterable<ISubscribable<A>>) {
		let ok = true;
		for (let s of src) {
			ok = this.remove(s) && ok;
		}
		return ok;
	}

	removeAllIDs(ids: Iterable<string>) {
		return __removeAllIDs(this, ids);
	}

	unsubscribe(sub?: ISubscription<B, any>) {
		if (!sub) {
			for (let s of this.sources.values()) {
				s.unsubscribe();
			}
			this.state = State.DONE;
			this.sources.clear();
		}
		return super.unsubscribe(sub);
	}

	protected markDone(src: ISubscribable<A>) {
		this.remove(src);
		isFirstOrLastInput(this.closeIn, this.sources.size) && this.done();
	}
}
