import type { Predicate } from "@thi.ng/api";
import {
	State,
	type CommonOpts,
	type ISubscribable,
	type ISubscription,
} from "./api.js";
import { ASidechain } from "./asidechain.js";
import { __optsWithID } from "./idgen.js";

export interface SidechainToggleOpts<T> extends CommonOpts {
	pred: Predicate<T>;
	initial: boolean;
}

/**
 * Returns a subscription which filters values from `src` based on control
 * values received from `side` chain.
 *
 * @remarks
 * By default, the values read from the side chain are ignored (i.e. only their
 * timing is used), however the `pred`icate option can be used to only trigger
 * for specific values/conditions. Every time the predicate fn returns true, the
 * filter will be toggled on/off. Whilst switched off, no input values will be
 * forwarded downstream.
 *
 * @example
 * ```ts tangle:../export/sidechain-toggle.ts
 * import { fromInterval, sidechainToggle, trace } from "@thi.ng/rstream";
 *
 * const src = fromInterval(500);
 *
 * // close stream after 5 secs
 * setTimeout(() => src.done(), 5000);
 *
 * // use slower interval stream to toggle faster main stream on/off
 * sidechainToggle(src, fromInterval(1000)).subscribe(trace());
 * // 0
 * // 1
 * // 4
 * // 5
 * // 8
 * // 9
 * // done
 * ```
 *
 * @param src -
 * @param side -
 * @param opts -
 */
export const sidechainToggle = <T, S>(
	src: ISubscribable<T>,
	side: ISubscribable<S>,
	opts?: Partial<SidechainToggleOpts<S>>
): ISubscription<T, T> => src.subscribe(new SidechainToggle<T, S>(side, opts));

export class SidechainToggle<T, S> extends ASidechain<T, S, T> {
	isActive: boolean;

	constructor(
		side: ISubscribable<S>,
		opts?: Partial<SidechainToggleOpts<S>>
	) {
		opts = __optsWithID("sidetoggle", opts);
		super(opts);
		this.isActive = !!opts.initial;
		const pred = opts.pred || (() => true);
		this.sideSub = side.subscribe({
			next: (x) => {
				if (pred(x)) {
					this.isActive = !this.isActive;
				}
			},
			done: () => this.done(),
		});
	}

	next(x: T) {
		if (this.isActive && this.state < State.DONE) {
			super.next(x);
		}
	}
}
