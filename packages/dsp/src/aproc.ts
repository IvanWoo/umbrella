// SPDX-License-Identifier: Apache-2.0
import type { IXform } from "@thi.ng/transducers";
import { map } from "@thi.ng/transducers/map";
import type { IProc, IProc2 } from "./api.js";

/**
 * Abstract base class for processors in this package. Provides
 * [`IDeref`](https://docs.thi.ng/umbrella/api/interfaces/IDeref.html) to obtain
 * the processor's current value.
 */
export abstract class AProc<A, B> implements IProc<A, B>, IXform<A, B> {
	constructor(protected _val: B) {}

	deref() {
		return this._val;
	}

	abstract next(x: A): B;

	xform() {
		return map((x: A) => this.next(x));
	}
}

/**
 * Similar to {@link AProc}, but for processors with 2 inputs.
 */
export abstract class AProc2<A, B, C>
	implements IProc2<A, B, C>, IXform<[A, B], C>
{
	constructor(protected _val: C) {}

	deref() {
		return this._val;
	}

	abstract next(a: A, b: B): C;

	xform() {
		return map(([a, b]: [A, B]) => this.next(a, b));
	}
}
