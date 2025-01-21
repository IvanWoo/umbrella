// SPDX-License-Identifier: Apache-2.0
import type { Maybe, NumericArray } from "@thi.ng/api";
import type { StridedVec, Vec } from "@thi.ng/vectors";
import type { VecFactory } from "./api.js";
import { wrap } from "./wrap.js";

export abstract class AVecList<T extends StridedVec> {
	buffer: NumericArray;
	factory: VecFactory;

	start: number;
	capacity: number;
	curr: number;
	size: number;
	estride: number;
	cstride: number;

	freeIDs: number[];

	/**
	 *
	 * @param buffer -
	 * @param capacity -
	 * @param size -
	 * @param start -
	 * @param cstride -
	 * @param estride -
	 * @param factory -
	 */
	constructor(
		buffer: NumericArray,
		capacity: number,
		size: number,
		start = 0,
		cstride = 1,
		estride = size,
		factory: VecFactory = wrap
	) {
		this.buffer = buffer || new Float32Array(size * capacity);
		this.size = size;
		this.factory = factory;
		this.cstride = cstride;
		this.estride = estride;
		this.start = this.curr = start;
		this.capacity = capacity;
		this.freeIDs = [];
	}

	abstract [Symbol.iterator](): IterableIterator<T>;

	abstract get length(): number;

	abstract add(): Maybe<T>;

	abstract insert(i: number): Maybe<T>;

	abstract remove(v: T): boolean;

	abstract has(v: T): boolean;

	abstract nth(n: number): Maybe<T>;

	indices(res: Vec = [], i = 0, local = true) {
		const { start, estride } = this;
		if (local) {
			for (let v of this) {
				res[i++] = (v.offset - start) / estride;
			}
		} else {
			for (let v of this) {
				res[i++] = v.offset;
			}
		}
		return res;
	}

	protected alloc() {
		let idx: number;
		if (this.freeIDs.length > 0) {
			idx = this.freeIDs.pop()!;
		} else if (this.length >= this.capacity) {
			return;
		} else {
			idx = this.curr;
			this.curr += this.estride;
		}
		return <T>this.factory(this.buffer, this.size, idx, this.cstride);
	}
}
