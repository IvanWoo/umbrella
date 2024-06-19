import { isArrayLike } from "@thi.ng/checks/is-arraylike";
import { isBoolean } from "@thi.ng/checks/is-boolean";
import { isNumber } from "@thi.ng/checks/is-number";
import { isPlainObject } from "@thi.ng/checks/is-plain-object";
import { isString } from "@thi.ng/checks/is-string";
import type { MultiFn1 } from "@thi.ng/defmulti";
import { defmulti } from "@thi.ng/defmulti/defmulti";
import { assert } from "@thi.ng/errors/assert";
import { unsupported } from "@thi.ng/errors/unsupported";
import { utf8Length } from "@thi.ng/strings/utf8";
import type { BinStructItem } from "@thi.ng/transducers-binary";
import { bytes, str, u8, u8array } from "@thi.ng/transducers-binary/bytes";
import { mapcat } from "@thi.ng/transducers/mapcat";

/** @internal */
const enum Type {
	INT,
	FLOAT,
	STR,
	BINARY,
	DICT,
	LIST,
}

/** @internal */
const enum Lit {
	DICT = 0x64,
	END = 0x65,
	LIST = 0x6c,
}

/** @internal */
const FLOAT_RE = /^[0-9.-]+$/;

export const encode = (x: any, cap = 1024) => bytes(cap, __encodeBin(x));

/** @internal */
const __encodeBin: MultiFn1<any, BinStructItem[]> = defmulti<
	any,
	BinStructItem[]
>(
	(x: any): Type =>
		isNumber(x)
			? Math.floor(x) !== x
				? Type.FLOAT
				: Type.INT
			: isBoolean(x)
			? Type.INT
			: isString(x)
			? Type.STR
			: x instanceof Uint8Array
			? Type.BINARY
			: isArrayLike(x)
			? Type.LIST
			: isPlainObject(x)
			? Type.DICT
			: unsupported(`unsupported data type: ${x}`),
	{},
	{
		[Type.INT]: (x: number) => {
			__ensureValidNumber(x);
			return [str(`i${Math.floor(x)}e`)];
		},

		[Type.FLOAT]: (x: number) => {
			__ensureValidNumber(x);
			assert(
				FLOAT_RE.test(x.toString()),
				`values requiring exponential notation not allowed (${x})`
			);
			return [str(`f${x}e`)];
		},

		[Type.BINARY]: (buf: Uint8Array) => [
			str(buf.length + ":"),
			u8array(buf),
		],

		[Type.STR]: (x: string) => [str(utf8Length(x) + ":" + x)],

		[Type.LIST]: (x: Iterable<any>) => [
			u8(Lit.LIST),
			...mapcat(__encodeBin, x),
			u8(Lit.END),
		],

		[Type.DICT]: (x: any) => [
			u8(Lit.DICT),
			...mapcat(
				(k: string) => __encodeBin(k).concat(__encodeBin(x[k])),
				Object.keys(x).sort()
			),
			u8(Lit.END),
		],
	}
);

/** @internal */
const __ensureValidNumber = (x: number) => {
	assert(isFinite(x), `can't encode infinite value`);
	assert(!isNaN(x), `can't encode NaN`);
};
