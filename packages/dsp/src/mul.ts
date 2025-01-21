// SPDX-License-Identifier: Apache-2.0
import type { ICopy, IReset } from "@thi.ng/api";
import { AGen } from "./agen.js";

/**
 * Returns new multiply gen, producing `y(t) = factor * y(t-1)`, using
 * given `factor` and `start` values.
 *
 * Also see {@link curve}.
 *
 * @param factor -
 * @param start -
 * @param clamp -
 */
export const mul = (factor?: number, start?: number, clamp?: number) =>
	new Mul(factor, start, clamp);

export class Mul extends AGen<number> implements ICopy<Mul>, IReset {
	constructor(
		protected _factor = 1,
		protected _start = 1,
		protected _clamp?: number
	) {
		super(0);
		this.reset();
	}

	copy() {
		return new Mul(this._factor, this._start, this._clamp);
	}

	reset() {
		this._val = this._start / this._factor;
		return this;
	}

	next() {
		let v = this._val * this._factor;
		return (this._val =
			this._clamp !== undefined
				? this._start < this._clamp
					? Math.min(v, this._clamp)
					: Math.max(v, this._clamp)
				: v);
	}
}
