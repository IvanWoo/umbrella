// SPDX-License-Identifier: Apache-2.0
import {
	PRESETS_TPL,
	type FormatPresets,
	type PresetID,
	type StringFormat,
} from "./api.js";

/**
 * HOF format function. Returns a single-arg function which wraps a given value
 * into a fully prefixed & suffixed format string using given
 * {@link StringFormat} impl.
 *
 * @example
 * ```ts tangle:../export/def-format.ts
 * import { defFormat, FMT_ANSI16, FG_RED } from "@thi.ng/text-format";
 *
 * const red = defFormat(FMT_ANSI16, FG_RED);
 *
 * console.log(red("hello"));
 * // hello (shown in red in ANSI-supporting terminals)
 *
 * console.log(escape(red("hello")));
 * // "%1B%5B31mhello%1B%5B0m"
 * ```
 *
 * @param fmt -
 * @param code -
 */
export const defFormat = (fmt: StringFormat, code: number) => (x: any) =>
	fmt.format(code, x);

/**
 * Takes a {@link StringFormat} impl supporting preset format ID constants (e.g.
 * {@link FG_GREEN}) and returns an object of formatting functions for each
 * `FG_XXX` preset ID.
 *
 * @remarks
 * The underlying {@link StringFormat} can be obtained from the result object
 * via `.format`.
 *
 * @param fmt -
 */
export const defFormatPresets = (format: StringFormat): FormatPresets =>
	Object.keys(PRESETS_TPL).reduce(
		(acc, id) => (
			(acc[id] = defFormat(format, PRESETS_TPL[<PresetID>id])), acc
		),
		<any>{ format }
	);

/**
 * Returns string representation of a single line/row (of a potentially larger
 * buffer/canvas), using the given string formatter. Use {@link formatNone} to
 * create a plain string representation, ignoring any character format data.
 *
 * @param format -
 * @param data -
 * @param width - line length (default length of data)
 * @param offset - read offset in data buffer
 */
export const format = (
	format: StringFormat,
	data: Uint32Array,
	width = data.length,
	offset = 0
) => {
	const { start, end, prefix, suffix, zero } = format;
	const check = zero ? () => prevID !== -1 : () => prevID !== 0;
	const res: string[] = [prefix];
	let prevID: number, ch: number, id: number;
	prevID = zero ? -1 : 0;
	for (let x = 0; x < width; x++) {
		ch = data[x + offset];
		id = ch >>> 16;
		if (id != prevID) {
			check() && res.push(end);
			(zero || id) && res.push(start(id));
			prevID = id;
		}
		res.push(String.fromCharCode(ch & 0xffff));
	}
	check() && res.push(end);
	res.push(suffix);
	return res.join("");
};

/**
 * Returns plain string representation of a single line/row (of a potentially
 * larger buffer/canvas), ignoring any formatting data (i.e. upper 16 bits of
 * each character).
 *
 * @remarks
 * Also see {@link format} for actually applying a {@link StringFormat}.
 *
 * @param data -
 * @param width - line length (default length of data)
 * @param offset - read offset in data buffer
 */
export const formatNone = (
	data: Uint32Array,
	width = data.length,
	offset = 0
) => {
	const res: string[] = [];
	for (let x = 0; x < width; x++) {
		res.push(String.fromCharCode(data[x + offset] & 0xffff));
	}
	res.push("\n");
	return res.join("");
};
