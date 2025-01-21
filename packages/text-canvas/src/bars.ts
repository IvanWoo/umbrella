// SPDX-License-Identifier: Apache-2.0
import { ensureArray } from "@thi.ng/arrays/ensure-array";
import { fitClamped } from "@thi.ng/math/fit";
import { fract } from "@thi.ng/math/prec";
import { padLeft } from "@thi.ng/strings/pad-left";
import { padRight } from "@thi.ng/strings/pad-right";
import { repeat } from "@thi.ng/strings/repeat";
import { map } from "@thi.ng/transducers/map";
import { max as $max } from "@thi.ng/transducers/max";
import { min as $min } from "@thi.ng/transducers/min";
import { BARS_H, BARS_V } from "./api.js";

/**
 * Visualizes given values (in `[min..max]`interval) as vertical bar chart.
 * Returns array of line strings.
 *
 * @param height
 * @param vals
 * @param min
 * @param max
 */
export const barChartVLines = (
	height: number,
	vals: Iterable<number>,
	min?: number,
	max?: number
) => {
	const $vals = ensureArray(vals);
	min = min !== undefined ? min : $min($vals);
	max = max !== undefined ? max : $max($vals);
	const bars = [...map((x) => barVertical(height, x, min, max, ""), $vals)];
	const num = bars.length;
	const res: string[] = [];
	for (let i = 0; i < height; i++) {
		let line = "";
		for (let j = 0; j < num; j++) {
			line += bars[j][i];
		}
		res.push(line);
	}
	return res;
};

/**
 * Same as {@link barChartVLines}, but returns result as single string.
 *
 * @param height
 * @param vals
 * @param min
 * @param max
 */
export const barChartVStr = (
	height: number,
	vals: Iterable<number>,
	min?: number,
	max?: number
) => barChartVLines(height, vals, min, max).join("\n");

/**
 * Visualizes given values (in `[min..max]`interval) as horizontal bar chart.
 * Returns array of line strings.
 *
 * @param height
 * @param vals
 * @param min
 * @param max
 */
export const barChartHLines = (
	width: number,
	vals: Iterable<number>,
	min?: number,
	max?: number
) => {
	const $vals = ensureArray(vals);
	min = min !== undefined ? min : $min($vals);
	max = max !== undefined ? max : $max($vals);
	return [...map((x) => barHorizontal(width, x, min, max), $vals)];
};

/**
 * Same as {@link barChartVLines}, but returns result as single string.
 *
 * @param height
 * @param vals
 * @param min
 * @param max
 */
export const barChartHStr = (
	width: number,
	vals: Iterable<number>,
	min?: number,
	max?: number
) => barChartHLines(width, vals, min, max).join("\n");

export const barHorizontal = (width: number, x: number, min = 0, max = 1) =>
	__bar(BARS_H, width, false, x, min, max, "");

export const barVertical = (
	height: number,
	x: number,
	min = 0,
	max = 1,
	delim = "\n"
) => __bar(BARS_V, height, true, x, min, max, delim);

/** @internal */
const __bar = (
	chars: string,
	size: number,
	left: boolean,
	x: number,
	min: number,
	max: number,
	delim: string
) => {
	x = fitClamped(x, min, max, 0, size);
	const f = (fract(x) * 9) | 0;
	const full = repeat(chars[8] + delim, x | 0);
	const partial = f > 0 ? chars[f] + delim : "";
	size += size * delim.length;
	return left
		? padLeft(size, " ")(partial + full)
		: padRight(size, " ")(full + partial);
};
