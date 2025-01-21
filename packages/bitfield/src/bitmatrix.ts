// SPDX-License-Identifier: Apache-2.0
import type { Fn2, IClear, ICopy } from "@thi.ng/api";
import { align } from "@thi.ng/binary/align";
import { popCountArray } from "@thi.ng/binary/count";
import { bitAnd, bitNot, bitOr, bitXor } from "@thi.ng/binary/logic";
import { assert } from "@thi.ng/errors/assert";
import { ensureIndex } from "@thi.ng/errors/out-of-bounds";
import { BitField } from "./bitfield.js";
import { binOp, toString } from "./util.js";

/**
 * MxN row-major 2D bit matrix, backed by a Uint8Array. Hence the width
 * (number of columns) is always rounded up to a multiple of 8.
 */
export class BitMatrix implements IClear, ICopy<BitMatrix> {
	/** Backing byte array */
	data: Uint8Array;
	/** Number of bytes per row */
	stride: number;
	/** Number of rows */
	m: number;
	/** Number of columns */
	n: number;

	constructor(rows: number, cols = rows) {
		this.m = rows;
		this.n = cols = align(cols, 8);
		this.stride = cols >>> 3;
		this.data = new Uint8Array(rows * this.stride);
	}

	get length() {
		return this.m * this.n;
	}

	clear() {
		this.data.fill(0);
	}

	copy() {
		const dest = new BitMatrix(this.m, this.n);
		dest.data.set(this.data);
		return dest;
	}

	/**
	 * Resizes matrix to new size given (width always rounded up to
	 * multiples of 8).
	 *
	 * @param m - new number of rows
	 * @param n - new number of cols
	 */
	resize(m: number, n = m) {
		n = align(n, 8);
		if (m === this.m && n === this.n) return this;
		const dstride = n >>> 3;
		const sstride = this.stride;
		const w = Math.min(dstride, sstride);
		const src = this.data;
		const dest = new Uint8Array(m * dstride);
		for (
			let i = Math.min(m, this.m) - 1, si = i * sstride, di = i * dstride;
			i >= 0;
			i--, si -= sstride, di -= dstride
		) {
			dest.set(src.slice(si, si + w), di);
		}
		this.m = m;
		this.n = n;
		this.stride = dstride;
		this.data = dest;
		return this;
	}

	/**
	 * Returns a non-zero value if bit at `m,n` is enabled (row major).
	 * No bounds checking.
	 *
	 * @param m - row
	 * @param n - column
	 */
	at(m: number, n: number) {
		return this.data[(n >>> 3) + m * this.stride] & (1 << (~n & 7));
	}

	/**
	 * Enables or disables bit at `m,n` (row major). Returns a non-zero
	 * value if the bit was previously enabled. No bounds checking.
	 * .
	 * @param m - row
	 * @param n - column
	 * @param v - bit value
	 */
	setAt(m: number, n: number, v: boolean | number = true) {
		const id = (n >>> 3) + m * this.stride;
		const mask = 1 << (~n & 7);
		const r = this.data[id] & mask;
		if (v) {
			this.data[id] |= mask;
		} else {
			this.data[id] &= ~mask;
		}
		return r;
	}

	/**
	 * Inverts bit at `m,n` (row major). Returns a non-zero value if the
	 * bit was previously enabled. No bounds checking.
	 *
	 * @param m - row
	 * @param n - column
	 */
	toggleAt(m: number, n: number) {
		const id = (n >>> 3) + m * this.stride;
		const mask = 1 << (~n & 7);
		const r = this.data[id] & mask;
		if (r) {
			this.data[id] &= ~mask;
		} else {
			this.data[id] |= mask;
		}
		return r;
	}

	and(mat: BitMatrix) {
		return this.binOp(mat, bitAnd);
	}

	or(mat: BitMatrix) {
		return this.binOp(mat, bitOr);
	}

	xor(mat: BitMatrix) {
		return this.binOp(mat, bitXor);
	}

	not() {
		return this.binOp(this, bitNot);
	}

	/**
	 * Returns number of set bits (1's) in the matrix.
	 */
	popCount() {
		return popCountArray(this.data);
	}

	popCountRow(m: number) {
		ensureIndex(m, 0, this.m);
		m *= this.stride;
		return popCountArray(this.data.subarray(m, m + this.stride));
	}

	popCountColumn(n: number) {
		ensureIndex(n, 0, this.n);
		const { data, stride, m } = this;
		const mask = 1 << (~n & 7);
		let res = 0;
		for (let i = n >>> 3, j = 0; j < m; i += stride, j++) {
			data[i] & mask && res++;
		}
		return res;
	}

	/**
	 * Same as {@link BitMatrix.popCount}, but as normalized ratio/percentage.
	 */
	density() {
		return this.popCount() / this.length;
	}

	row(m: number, viewOnly = false) {
		ensureIndex(m, 0, this.m);
		m *= this.stride;
		const data = this.data.subarray(m, m + this.stride);
		const row = new BitField(this.n, viewOnly ? data : undefined);
		!viewOnly && row.data.set(data);
		return row;
	}

	column(n: number) {
		ensureIndex(n, 0, this.n);
		const { data, stride, m } = this;
		const column = new BitField(m);
		const mask = 1 << (~n & 7);
		for (let i = n >>> 3, j = 0; j < m; i += stride, j++) {
			data[i] & mask && column.setAt(j);
		}
		return column;
	}

	toString() {
		const res: string[] = [];
		for (let i = 0, j = 0, s = this.stride; i < this.m; i++, j += s) {
			res.push(toString(this.data.subarray(j, j + s)));
		}
		return res.join("\n");
	}

	protected binOp(field: BitMatrix, op: Fn2<number, number, number>) {
		this.ensureSize(field);
		binOp(this.data, field.data, op);
		return this;
	}

	protected ensureSize(field: BitMatrix) {
		assert(
			field.m === this.m && field.n === this.n,
			`matrices must be same size`
		);
	}
}

export const defBitMatrix = (rows: number, cols = rows) =>
	new BitMatrix(rows, cols);
