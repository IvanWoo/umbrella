// SPDX-License-Identifier: Apache-2.0
import { juxt } from "@thi.ng/compose/juxt";
import { U32, U8 } from "@thi.ng/hex";
import type { Transducer } from "@thi.ng/transducers";
import { comp } from "@thi.ng/transducers/comp";
import { iterator, __iter } from "@thi.ng/transducers/iterator";
import { map } from "@thi.ng/transducers/map";
import { mapIndexed } from "@thi.ng/transducers/map-indexed";
import { padLast } from "@thi.ng/transducers/pad-last";
import { partition } from "@thi.ng/transducers/partition";
import type { HexDumpOpts } from "./api.js";

/**
 * Transforms bytes into a sequence of hexdump lines with configurable number of
 * `columns` and `address` offset. Uses
 * [`partition`](https://docs.thi.ng/umbrella/transducers/functions/partition.html)
 * internally, so new lines are only produced once filled. If the input hasn't
 * an exact multiple of `cols` bytes, the last line will be padded with zeroes.
 *
 * @remarks
 * Also see alt implementation in
 * [thi.ng/hex](https://docs.thi.ng/umbrella/hex/functions/hexdump.html)
 *
 * @example
 * ```ts tangle:../export/hex-dump.ts
 * import { hexDump } from "@thi.ng/transducers-binary";
 *
 * const src = [
 *   65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 33, 48, 49, 50, 51, 126, 122, 121, 120
 * ];
 *
 * console.log(
 *   [...hexDump({ cols: 8, address: 0x400 }, src)].join("\n")
 * );
 * // 00000400 | 41 42 43 44 45 46 47 48 | ABCDEFGH
 * // 00000408 | 49 4a 21 30 31 32 33 7e | IJ!0123~
 * // 00000410 | 7a 79 78 00 00 00 00 00 | zyx.....
 * ```
 *
 * @param opts -
 */
export function hexDump(
	opts?: Partial<HexDumpOpts>
): Transducer<number, string>;
export function hexDump(src: Iterable<number>): IterableIterator<string>;
export function hexDump(
	opts: Partial<HexDumpOpts>,
	src: Iterable<number>
): IterableIterator<string>;
export function hexDump(...args: any[]): any {
	const iter = __iter(hexDump, args, iterator);
	if (iter) {
		return iter;
	}
	const { cols = 16, address = 0 } = <HexDumpOpts>args[0] || {};
	return comp(
		padLast(cols, 0),
		map(
			juxt(U8, (x) => (x > 31 && x < 127 ? String.fromCharCode(x) : "."))
		),
		partition(cols, true),
		map(
			juxt(
				(x: string[][]) => x.map((y) => y[0]).join(" "),
				(x: string[][]) => x.map((y) => y[1]).join("")
			)
		),
		mapIndexed((i, [h, a]) => `${U32(address + i * cols)} | ${h} | ${a}`)
	);
}

/**
 * Convenience wrapper for {@link hexDump}, return the hexdump as a
 * single result string.
 *
 * @param opts -
 * @param src -
 */
export const hexDumpString = (
	opts: Partial<HexDumpOpts>,
	src: Iterable<number>
) => [...hexDump(opts, src)].join("\n");
