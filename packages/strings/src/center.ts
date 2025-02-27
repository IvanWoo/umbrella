// SPDX-License-Identifier: Apache-2.0
import { memoizeO } from "@thi.ng/memoize/memoizeo";
import type { Stringer } from "./api.js";
import { repeat } from "./repeat.js";
import { truncate } from "./truncate.js";

/**
 * Returns stringer which pads given input with `ch` (default: space) on
 * both sides and returns fixed width string of given `lineWidth`.
 * Returns string of only pad characters for any `null` or `undefined`
 * values. If the string version of an input is > `lineWidth`, no
 * centering is performed, but the string will be truncated to
 * `lineWidth`.
 *
 * Note: The padding string can contain multiple characters.
 *
 * @example
 * ```ts tangle:../export/center.ts
 * import { center } from "@thi.ng/strings";
 *
 * console.log(
 *   center(20, "<>")(" thi.ng ")
 * );
 * // "<><><> thi.ng <><><>"
 * ```
 *
 * @example
 * ```ts tangle:../export/center-2.ts
 * import { comp } from "@thi.ng/compose";
 * import { center, wrap } from "@thi.ng/strings";
 *
 * // compose formatting function
 * const fmt = comp(center(20,"<>"), wrap(" "));
 *
 * console.log(fmt("thi.ng"));
 * // "<><><> thi.ng <><><>"
 * ```
 *
 * @param lineWidth - target length
 * @param pad - pad character(s)
 */
export const center: (
	lineWidth: number,
	pad?: string | number
) => Stringer<any> = memoizeO((n, pad = " ") => {
	const buf = repeat(String(pad), n);
	return (x: any) => {
		if (x == null) return buf;
		x = x.toString();
		const r = (n - x.length) / 2;
		return x.length < n
			? buf.substring(0, r) +
					x +
					buf.substring(0, r + ((n & 1) === (x.length & 1) ? 0 : 1))
			: truncate(n)(x);
	};
});
