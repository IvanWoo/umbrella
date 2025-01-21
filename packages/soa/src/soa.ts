// SPDX-License-Identifier: Apache-2.0
import type { ILength } from "@thi.ng/api";
import { SIZEOF, typedArray, type TypedArray } from "@thi.ng/api/typedarray";
import { assert } from "@thi.ng/errors/assert";
import { ensureIndex } from "@thi.ng/errors/out-of-bounds";
import type { ReadonlyVec, Vec } from "@thi.ng/vectors";
import type { SOAAttribSpec, SOASpecs, SOATuple } from "./api.js";
import { prepareSpec } from "./utils.js";

export class SOA<K extends string> implements ILength {
	length: number;
	buffers: Record<K, TypedArray>;
	specs: SOASpecs<K>;

	constructor(num: number, specs: SOASpecs<K>) {
		this.length = num;
		this.buffers = <Record<K, TypedArray>>{};
		this.specs = <SOASpecs<K>>{};
		this.addSpecs(specs);
	}

	keys() {
		return <K[]>Object.keys(this.specs);
	}

	*values(from = 0, to = this.length): IterableIterator<SOATuple<K, Vec>> {
		ensureIndex(from, 0, this.length);
		ensureIndex(to, from, this.length + 1);
		for (; from < to; from++) {
			yield this.indexUnsafe(from);
		}
	}

	attribValues(id: K, from = 0, to = this.length) {
		this.ensureAttrib(id);
		ensureIndex(from, 0, this.length);
		ensureIndex(to, from, this.length + 1);
		let { size, stride, type } = this.specs[id];
		const buf = this.buffers[id].buffer;
		stride! *= SIZEOF[type!];
		from *= stride!;
		to *= stride!;
		const res: Vec[] = [];
		for (; from < to; from += stride!) {
			res.push(typedArray(type!, buf, from, size!));
		}
		return res;
	}

	attribValue(id: K, i: number): Vec {
		this.ensureAttrib(id);
		ensureIndex(i, 0, this.length);
		return this.attribValueUnsafe(id, i);
	}

	attribValueUnsafe(id: K, i: number): Vec {
		const spec = this.specs[id];
		i *= spec.stride!;
		return this.buffers[id].subarray(i, i + spec.size!);
	}

	setAttribValue(id: K, i: number, val: ReadonlyVec) {
		this.ensureAttrib(id);
		ensureIndex(i, 0, this.length);
		const spec = this.specs[id];
		assert(val.length <= spec.size!, `${id} value too large`);
		this.buffers[id].set(val, i * spec.stride!);
	}

	setAttribValueUnsafe(id: K, i: number, val: ReadonlyVec) {
		this.buffers[id].set(val, i * this.specs[id].stride!);
		return this;
	}

	setAttribValues(id: K, vals: Iterable<ReadonlyVec>, from = 0) {
		this.ensureAttrib(id);
		ensureIndex(from, 0, this.length);
		const buf = this.buffers[id];
		const stride = this.specs[id].stride!;
		const end = this.length * stride;
		let i = from * stride;
		for (let v of vals) {
			buf.set(v, i);
			i += stride;
			if (i >= end) break;
		}
		return this;
	}

	index(i: number): SOATuple<K, Vec>;
	index<ID extends K>(i: number, ids: ID[]): SOATuple<ID, Vec>;
	index(i: number, ids?: K[]): any {
		ensureIndex(i, 0, this.length);
		return this.indexUnsafe(i, ids!);
	}

	indexUnsafe(i: number): SOATuple<K, Vec>;
	indexUnsafe<ID extends K>(i: number, ids: ID[]): SOATuple<ID, Vec>;
	indexUnsafe(i: number, ids?: K[]): any {
		const res = <SOATuple<K, Vec>>{};
		if (ids) {
			for (let i = ids.length; i-- > 0; ) {
				const id = ids[i];
				res[id] = this.attribValueUnsafe(id, i);
			}
		} else {
			for (let id in this.specs) {
				res[id] = this.attribValueUnsafe(id, i);
			}
		}
		return res;
	}

	setIndex(i: number, vals: Partial<SOATuple<K, ReadonlyVec>>) {
		ensureIndex(i, 0, this.length);
		for (let id in vals) {
			this.setAttribValue(id, i, <any>vals[id]!);
		}
		return this;
	}

	setIndexUnsafe(i: number, vals: Partial<SOATuple<K, ReadonlyVec>>) {
		for (let id in vals) {
			this.setAttribValueUnsafe(id, i, <any>vals[id]!);
		}
		return this;
	}

	setValues(vals: Partial<SOATuple<K, Iterable<ReadonlyVec>>>, from = 0) {
		for (let id in vals) {
			this.setAttribValues(id, vals[id]!, from);
		}
		return this;
	}

	copyTo(
		dest: SOA<K>,
		ids?: K[],
		destFrom = 0,
		srcFrom = 0,
		srcTo = this.length
	) {
		ensureIndex(srcFrom, 0, this.length);
		ensureIndex(srcTo, srcFrom, this.length + 1);
		const num = srcTo - srcFrom;
		ensureIndex(destFrom, 0, dest.length);
		ensureIndex(destFrom + num, destFrom, dest.length + 1);
		ids = ids || <K[]>Object.keys(this.specs);
		for (let k = ids.length; k-- > 0; ) {
			const id = ids[k];
			for (let i = srcFrom, j = destFrom; i < srcTo; i++, j++) {
				dest.setAttribValueUnsafe(id, j, this.attribValueUnsafe(id, i));
			}
		}
		return dest;
	}

	addSpecs(specs: SOASpecs<K>) {
		const num = this.length;
		for (let id in specs) {
			assert(!this.specs[id], `attrib ${id} already exists`);
			const spec = prepareSpec(specs[id]);
			this.validateSpec(id, spec);
			const { stride, default: defVal } = spec;
			const buffer = spec.buf
				? typedArray(spec.type!, spec.buf, spec.byteOffset || 0)
				: typedArray(spec.type!, num * stride!);
			if (defVal) {
				for (let i = 0; i < num; i++) {
					buffer.set(defVal, i * stride!);
				}
			}
			this.specs[id] = spec;
			this.buffers[id] = buffer;
		}
	}

	protected validateSpec(id: K, spec: Partial<SOAAttribSpec>) {
		assert(spec.stride! >= spec.size!, `${id} illegal stride`);
		assert(
			!spec.buf ||
				spec.buf.byteLength >=
					((this.length - 1) * spec.stride! + spec.size!) *
						SIZEOF[spec.type!],
			`${id} buffer too small`
		);
		assert(
			spec.default === undefined || spec.default.length === spec.size,
			`illegal default value for ${id}, expected size: ${spec.size}`
		);
	}

	protected ensureAttrib(id: K) {
		assert(!!this.specs[id], `invalid attrib ${id}`);
	}
}

export const soa = <K extends string>(num: number, specs: SOASpecs<K>) =>
	new SOA<K>(num, specs);
