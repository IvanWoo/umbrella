// SPDX-License-Identifier: Apache-2.0
import type { Fn3, Maybe, Pair, Predicate2 } from "@thi.ng/api";
import { SEMAPHORE } from "@thi.ng/api/api";
import { findIndex } from "@thi.ng/arrays/find";
import { equiv } from "@thi.ng/equiv";
import type { EquivSetOpts, IEquivSet } from "./api.js";
import { dissoc } from "./dissoc.js";
import { __disposableValues } from "./internal/dispose.js";
import { __equivSet } from "./internal/equiv.js";
import { __tostringMixin } from "./internal/tostring.js";
import { into } from "./into.js";

/**
 * An alternative set implementation to the native ES6 Set type. Uses
 * customizable equality/equivalence predicate and so is more useful when
 * dealing with structured data. Implements full API of native Set and by the
 * default uses
 * [`equiv`](https://docs.thi.ng/umbrella/equiv/functions/equiv.html) for
 * equivalence checking.
 *
 * Additionally, the type also implements the
 * [`ICopy`](https://docs.thi.ng/umbrella/api/interfaces/ICopy.html),
 * [`IEmpty`](https://docs.thi.ng/umbrella/api/interfaces/IEmpty.html) and
 * [`IEquiv`](https://docs.thi.ng/umbrella/api/interfaces/IEquiv.html)
 * interfaces itself.
 */
@__disposableValues
@__tostringMixin
export class ArraySet<T> extends Set<T> implements IEquivSet<T> {
	#vals: T[];
	#equiv: Predicate2<T>;

	constructor(
		vals?: Iterable<T> | null,
		opts: Partial<EquivSetOpts<T>> = {}
	) {
		super();
		this.#equiv = opts.equiv || equiv;
		this.#vals = [];
		vals && this.into(vals);
	}

	*[Symbol.iterator](): SetIterator<T> {
		yield* this.#vals;
	}

	// mixin
	[Symbol.dispose]() {}

	get [Symbol.species]() {
		return ArraySet;
	}

	get [Symbol.toStringTag]() {
		return "ArraySet";
	}

	get size(): number {
		return this.#vals.length;
	}

	copy(): ArraySet<T> {
		const s = new ArraySet<T>(null, { equiv: this.#equiv });
		s.#vals = this.#vals.slice();
		return s;
	}

	empty() {
		return new ArraySet<T>(null, this.opts());
	}

	clear() {
		this.#vals.length = 0;
	}

	first(): Maybe<T> {
		if (this.size) {
			return this.#vals[0];
		}
	}

	add(key: T) {
		!this.has(key) && this.#vals.push(key);
		return this;
	}

	into(keys: Iterable<T>) {
		return <this>into(this, keys);
	}

	has(key: T) {
		return this.get(key, <any>SEMAPHORE) !== <any>SEMAPHORE;
	}

	/**
	 * Returns the canonical value for `x`, if present. If the set
	 * contains no equivalent for `x`, returns `notFound`.
	 *
	 * @param key - search key
	 * @param notFound - default value
	 */
	get(key: T, notFound?: T): Maybe<T> {
		const i = findIndex(this.#vals, key, this.#equiv);
		return i >= 0 ? this.#vals[i] : notFound;
	}

	delete(key: T) {
		const equiv = this.#equiv;
		const vals = this.#vals;
		for (let i = vals.length; i-- > 0; ) {
			if (equiv(vals[i], key)) {
				vals.splice(i, 1);
				return true;
			}
		}
		return false;
	}

	disj(keys: Iterable<T>) {
		return <this>dissoc(this, keys);
	}

	equiv(o: any) {
		return __equivSet(this, o);
	}

	/**
	 * The value args given to the callback `fn` MUST be treated as
	 * readonly/immutable. This could be enforced via TS, but would
	 * break ES6 Set interface contract.
	 *
	 * @param fn -
	 * @param thisArg -
	 */
	forEach(fn: Fn3<T, T, Set<T>, void>, thisArg?: any) {
		const vals = this.#vals;
		for (let i = vals.length; i-- > 0; ) {
			const v = vals[i];
			fn.call(thisArg, v, v, this);
		}
	}

	*entries(): SetIterator<Pair<T, T>> {
		for (let v of this.#vals) {
			yield [v, v];
		}
	}

	*keys(): SetIterator<T> {
		yield* this.#vals;
	}

	*values(): SetIterator<T> {
		yield* this.#vals;
	}

	opts(): EquivSetOpts<T> {
		return { equiv: this.#equiv };
	}
}

export const defArraySet = <T>(
	vals?: Iterable<T> | null,
	opts?: Partial<EquivSetOpts<T>>
) => new ArraySet(vals, opts);
