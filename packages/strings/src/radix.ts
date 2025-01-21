// SPDX-License-Identifier: Apache-2.0
import {
	U16 as $16,
	U24 as $24,
	U32 as $32,
	U8 as $8,
	U64HL,
} from "@thi.ng/hex";
import { memoizeO } from "@thi.ng/memoize/memoizeo";
import type { Stringer } from "./api.js";
import { repeat } from "./repeat.js";

/**
 * Returns a {@link Stringer} which formats given numbers to `radix`, `len` and
 * with optional prefix (not included in `len`).
 *
 * @remarks
 * Only bases 2 - 36 are supported, due to native `Number.toString()`
 * limitations.
 *
 * @param radix -
 * @param len -
 * @param prefix -
 */
export const radix: (
	radix: number,
	len: number,
	prefix?: string
) => Stringer<number> = memoizeO(
	(radix: number, n: number, prefix: string = "") => {
		const buf = repeat("0", n);
		return (x: any) => {
			x = (x >>> 0).toString(radix);
			return prefix + (x.length < n ? buf.substring(x.length) + x : x);
		};
	}
);

/**
 * 8bit binary conversion preset.
 */
export const B8 = radix(2, 8);

/**
 * 16bit binary conversion preset.
 */
export const B16 = radix(2, 16);

/**
 * 32bit binary conversion preset.
 */
export const B32 = radix(2, 32);

/**
 * 8bit hex conversion preset.
 * Assumes unsigned inputs.
 */
export const U8 = $8;

/**
 * 16bit hex conversion preset.
 * Assumes unsigned inputs.
 */
export const U16 = $16;

/**
 * 24bit hex conversion preset.
 * Assumes unsigned inputs.
 */
export const U24 = $24;

/**
 * 32bit hex conversion preset.
 * Assumes unsigned inputs.
 */
export const U32 = $32;

/**
 * 64bit hex conversion preset (2x 32bit ints)
 * Assumes unsigned inputs.
 */
export const U64 = U64HL;
