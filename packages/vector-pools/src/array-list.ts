// SPDX-License-Identifier: Apache-2.0
import type { Maybe, NumericArray } from "@thi.ng/api";
import type { StridedVec } from "@thi.ng/vectors";
import { AVecList } from "./alist.js";
import type { VecFactory } from "./api.js";

export class VecArrayList<T extends StridedVec> extends AVecList<T> {
	items: T[];

	/**
	 *
	 * @param buffer -
	 * @param capacity -
	 * @param size -
	 * @param cstride -
	 * @param estride -
	 * @param start -
	 */
	constructor(
		buffer: NumericArray,
		capacity: number,
		size: number,
		start = 0,
		cstride = 1,
		estride = size,
		factory?: VecFactory
	) {
		super(buffer, capacity, size, cstride, estride, start, factory);
		this.items = [];
	}

	*[Symbol.iterator]() {
		yield* this.items;
	}

	get length() {
		return this.items.length;
	}

	add() {
		const v: Maybe<T> = this.alloc();
		if (v) {
			this.items.push(v);
		}
		return v;
	}

	insert(i: number) {
		if (!this.length && i !== 0) return;
		const v: Maybe<T> = this.alloc();
		if (v) {
			this.items.splice(i, 0, v);
		}
		return v;
	}

	remove(v: T) {
		const idx = this.items.indexOf(v);
		if (idx >= 0) {
			this.freeIDs.push(v.offset);
			this.items.splice(idx, 1);
			return true;
		}
		return false;
	}

	has(v: T) {
		return this.items.indexOf(v) >= 0;
	}

	nth(n: number) {
		return this.items[n];
	}
}
