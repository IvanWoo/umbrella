// SPDX-License-Identifier: Apache-2.0
import type {
	DeepPath,
	Fn,
	Maybe,
	OptPathVal,
	Path,
	Path0,
	Path1,
	Path2,
	Path3,
	Path4,
	Path5,
	Path6,
	Path7,
	Path8,
	PathVal,
	Watch,
} from "@thi.ng/api";
import { assert } from "@thi.ng/errors/assert";
import { illegalState } from "@thi.ng/errors/illegal-state";
import { setInUnsafe } from "@thi.ng/paths/set-in";
import { updateInUnsafe } from "@thi.ng/paths/update-in";
import type { IAtom, SwapFn } from "./api.js";
import { nextID } from "./idgen.js";

/**
 * Return a new {@link Transacted} state wrapper.
 *
 * @param parent -
 */
export const defTransacted = <T>(parent: IAtom<T>) => new Transacted(parent);

/**
 * Like {@link defTransacted}, but immediately starts new transaction as
 * well, i.e. same as `defTransacted(state).begin()`.
 *
 * @param parent -
 */
export const beginTransaction = <T>(parent: IAtom<T>) =>
	new Transacted(parent).begin();

/**
 * An "anonymous" version of {@link Transacted.updateAsTransaction}. Takes an
 * atom, wraps it as a {@link Transacted} and calls given `fn` with it to update
 * the state as a single transaction. If the update function returns true, the
 * transaction will be committed, else cancelled. Returns atom.
 *
 * @remarks
 * **IMPORTANT:** Within body of the update function **only** work with the
 * transaction wrapper given as argument! **DO NOT** update the original state
 * atom!
 *
 * If an error occurs during the update, the transaction will be canceled, the
 * wrapper silently removed and the error re-thrown.
 *
 * @param parent
 * @param fn
 */
export const updateAsTransaction = <T>(
	parent: IAtom<T>,
	fn: Fn<Transacted<T>, boolean>
) => {
	new Transacted(parent).updateAsTransaction(fn);
	return parent;
};

export class Transacted<T> implements IAtom<T> {
	parent: IAtom<T>;
	current: Maybe<T>;
	protected id: string;
	protected isActive: boolean;
	protected _watches: any;

	constructor(parent: IAtom<T>) {
		this.parent = parent;
		this.current = undefined;
		this.isActive = false;
		this.id = `tx-${nextID()}`;
	}

	get value() {
		return this.deref();
	}

	set value(val: T) {
		this.reset(val);
	}

	get isTransaction() {
		return this.isActive;
	}

	deref() {
		return this.isActive ? this.current! : this.parent.deref();
	}

	equiv(o: any) {
		return this === o;
	}

	reset(val: T) {
		this.ensureTx();
		this.current = val;
		return val;
	}

	resetIn(path: Path0, val: T): T;
	resetIn<A>(path: Path1<T, A>, val: PathVal<T, [A]>): T;
	resetIn<A, B>(path: Path2<T, A, B>, val: PathVal<T, [A, B]>): T;
	resetIn<A, B, C>(path: Path3<T, A, B, C>, val: PathVal<T, [A, B, C]>): T;
	resetIn<A, B, C, D>(
		path: Path4<T, A, B, C, D>,
		val: PathVal<T, [A, B, C, D]>
	): T;
	resetIn<A, B, C, D, E>(
		path: Path5<T, A, B, C, D, E>,
		val: PathVal<T, [A, B, C, D, E]>
	): T;
	resetIn<A, B, C, D, E, F>(
		path: Path6<T, A, B, C, D, E, F>,
		val: PathVal<T, [A, B, C, D, E, F]>
	): T;
	resetIn<A, B, C, D, E, F, G>(
		path: Path7<T, A, B, C, D, E, F, G>,
		val: PathVal<T, [A, B, C, D, E, F, G]>
	): T;
	resetIn<A, B, C, D, E, F, G, H>(
		path: Path8<T, A, B, C, D, E, F, G, H>,
		val: PathVal<T, [A, B, C, D, E, F, G, H]>
	): T;
	resetIn<A, B, C, D, E, F, G, H>(
		path: DeepPath<T, A, B, C, D, E, F, G, H>,
		val: any
	): T;
	resetIn(path: Path, val: any) {
		this.ensureTx();
		return (this.current = setInUnsafe(this.current, path, val));
	}

	resetInUnsafe(path: Path, val: any) {
		return this.resetIn(<any>path, val);
	}

	swap(fn: SwapFn<T, T>, ...args: any[]) {
		this.ensureTx();
		return (this.current = fn.apply(null, [this.current!, ...args]));
	}

	swapIn<A>(path: Path0, fn: SwapFn<T, T>, ...args: any[]): T;
	swapIn<A>(
		path: Path1<T, A>,
		fn: SwapFn<OptPathVal<T, [A]>, PathVal<T, [A]>>,
		...args: any[]
	): T;
	swapIn<A, B>(
		path: Path2<T, A, B>,
		fn: SwapFn<OptPathVal<T, [A, B]>, PathVal<T, [A, B]>>,
		...args: any[]
	): T;
	swapIn<A, B, C>(
		path: Path3<T, A, B, C>,
		fn: SwapFn<OptPathVal<T, [A, B, C]>, PathVal<T, [A, B, C]>>,
		...args: any[]
	): T;
	swapIn<A, B, C, D>(
		path: Path4<T, A, B, C, D>,
		fn: SwapFn<OptPathVal<T, [A, B, C, D]>, PathVal<T, [A, B, C, D]>>,
		...args: any[]
	): T;
	swapIn<A, B, C, D, E>(
		path: Path5<T, A, B, C, D, E>,
		fn: SwapFn<OptPathVal<T, [A, B, C, D, E]>, PathVal<T, [A, B, C, D, E]>>,
		...args: any[]
	): T;
	swapIn<A, B, C, D, E, F>(
		path: Path6<T, A, B, C, D, E, F>,
		fn: SwapFn<
			OptPathVal<T, [A, B, C, D, E, F]>,
			PathVal<T, [A, B, C, D, E, F]>
		>,
		...args: any[]
	): T;
	swapIn<A, B, C, D, E, F, G>(
		path: Path7<T, A, B, C, D, E, F, G>,
		fn: SwapFn<
			OptPathVal<T, [A, B, C, D, E, F, G]>,
			PathVal<T, [A, B, C, D, E, F, G]>
		>,
		...args: any[]
	): T;
	swapIn<A, B, C, D, E, F, G, H>(
		path: Path8<T, A, B, C, D, E, F, G, H>,
		fn: SwapFn<
			OptPathVal<T, [A, B, C, D, E, F, G, H]>,
			PathVal<T, [A, B, C, D, E, F, G, H]>
		>,
		...args: any[]
	): T;
	swapIn<A, B, C, D, E, F, G, H>(
		path: DeepPath<T, A, B, C, D, E, F, G, H>,
		fn: SwapFn<any, any>,
		...args: any[]
	): T;
	swapIn(path: Path, fn: SwapFn<any, any>, ...args: any[]) {
		this.ensureTx();
		return (this.current = updateInUnsafe(this.current, path, fn, ...args));
	}

	swapInUnsafe(path: Path, fn: SwapFn<any, any>, ...args: any[]) {
		return this.swapIn(<any>path, fn, ...args);
	}

	begin() {
		assert(!this.isActive, "transaction already started");
		this.current = this.parent.deref();
		this.isActive = true;
		this.parent.addWatch(this.id + "--guard--", () =>
			illegalState(
				`${this.id} parent state changed during active transaction`
			)
		);
		return this;
	}

	commit() {
		const val = this.current!;
		this.cancel();
		return this.parent.reset(val);
	}

	cancel() {
		this.ensureTx();
		this.parent.removeWatch(this.id + "--guard--");
		this.current = undefined;
		this.isActive = false;
	}

	/**
	 * Starts a new transaction and calls given `fn` with this instance to
	 * update the state (presumably in multiple stages) as a single transaction.
	 * If the update function returns true, the transaction will be committed,
	 * else cancelled.
	 *
	 * @remarks
	 * **IMPORTANT:** Within body of the update function **only** work with the
	 * transaction wrapper given as argument! **DO NOT** update the original
	 * state atom!
	 *
	 * If an error occurs during the update, the transaction will be canceled
	 * and the error re-thrown.
	 *
	 * @param fn
	 */
	updateAsTransaction(fn: Fn<Transacted<T>, boolean>) {
		try {
			this.begin();
			fn(this) ? this.commit() : this.cancel();
		} catch (e) {
			this.cancel();
			throw e;
		}
	}

	addWatch(id: string, watch: Watch<T>) {
		return this.parent.addWatch(this.id + id, (_, prev, curr) =>
			watch(id, prev, curr)
		);
	}

	removeWatch(id: string) {
		return this.parent.removeWatch(this.id + id);
	}

	notifyWatches(old: T, curr: T) {
		this.parent.notifyWatches(old, curr);
	}

	release() {
		delete (<any>this).parent;
		delete (<any>this).current;
		delete (<any>this).isActive;
		delete (<any>this)._watches;
		return true;
	}

	protected ensureTx() {
		assert(this.isActive, "no active transaction");
	}
}
