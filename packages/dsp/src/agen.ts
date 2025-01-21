// SPDX-License-Identifier: Apache-2.0
import type { IGen } from "./api.js";
import { __take } from "./internal/take.js";

/**
 * Abstract base class for unit gens in this package. Provides
 * [`IDeref`](https://docs.thi.ng/umbrella/api/interfaces/IDeref.html) to obtain
 * the gen's current value and `Iterable` implementations to use gens as ES6
 * iterables.
 */
export abstract class AGen<T> implements IGen<T> {
	constructor(protected _val: T) {}

	deref() {
		return this._val;
	}

	*[Symbol.iterator]() {
		while (true) yield this.next();
	}

	take(num: number, out: T[] = [], idx = 0): T[] {
		return __take(this, num, out, idx);
	}

	abstract next(): T;
}
