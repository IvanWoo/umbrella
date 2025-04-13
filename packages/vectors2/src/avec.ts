// SPDX-License-Identifier: Apache-2.0
import type { NumericArray } from "@thi.ng/api";
import type { StridedVec } from "./api.js";
import { FORMATTER } from "./string.js";

export abstract class AVec implements StridedVec {
	buf: NumericArray;
	offset: number;
	stride: number;

	constructor(buf: NumericArray, offset = 0, stride = 1) {
		this.buf = buf;
		this.offset = offset;
		this.stride = stride;
	}

	abstract get length(): number;

	abstract [Symbol.iterator](): IterableIterator<number>;

	toString() {
		return FORMATTER(this);
	}
}
