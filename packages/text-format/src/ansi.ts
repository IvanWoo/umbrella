// SPDX-License-Identifier: Apache-2.0
import { memoizeO } from "@thi.ng/memoize/memoizeo";
import type { StringFormat } from "./api.js";
import { defFormat } from "./format.js";

export const ANSI_RESET = "\x1b[0m";

// https://gitlab.com/gnachman/iterm2/-/wikis/synchronized-updates-spec#control-sequence
export const ANSI_SYNC_START = "\x1bP=1s\x1b\\";
export const ANSI_SYNC_END = "\x1bP=2s\x1b\\";

// https://gist.github.com/fnky/458719343aabd01cfb17a3a4f7296797
export const ANSI_HOME = "\x1b[H";
export const ANSI_HOME_LINE = "\x1b[0G";
export const ANSI_HOME_PREV_LINE = "\x1b[1F";

export const ANSI_CLEAR_SCREEN = "\x1b[2J";
export const ANSI_CLEAR_LINE = "\x1b[2K";

const ANSI_FLAGS = ["", "1", "2", "1;2", "4", "1;4", "2;4", "1;2;4"];

/**
 * String format preset, translating canvas format info to ANSI 4bit
 * control sequences.
 *
 * https://stackoverflow.com/a/33206814/294515
 */
export const FMT_ANSI16: StringFormat = {
	format: (code, x) => FMT_ANSI16.start(code) + x + FMT_ANSI16.end,
	start: memoizeO((x: number) => {
		let res = [];
		let y = x & 0xf;
		y && res.push(29 + ((x >> 4) & 1) * 60 + y);
		y = (x >> 5) & 0xf;
		y && res.push(39 + ((x >> 9) & 1) * 60 + y);
		y = x >> 10;
		y && res.push(ANSI_FLAGS[y]);
		return "\x1b[" + res.join(";") + "m";
	}),
	end: ANSI_RESET,
	prefix: ANSI_RESET,
	suffix: "\n",
};

/**
 * String format preset, translating canvas format info to ANSI 8bit control
 * sequences. Only foreground/background colors are supported, no other
 * formatting (e.g. bold etc.).
 *
 * @remarks
 * https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit
 *
 * Also see {@link format256}.
 */
export const FMT_ANSI256: StringFormat = {
	format: (code, x) => FMT_ANSI256.start(code) + x + FMT_ANSI256.end,
	start: (x: number) => `\x1b[38;5;${x & 0xff};48;5;${x >>> 8}m`,
	end: ANSI_RESET,
	prefix: ANSI_RESET,
	suffix: "\n",
	zero: true,
};

const F5 = 255 / 31;
const F6 = 255 / 63;

/**
 * String format preset, interpreting the canvas 16bit format info as text color
 * and translating it into ANSI 24bit control sequences. No other formatting
 * (e.g. bold etc.) supported in this mode.
 *
 * @remarks
 * This mode is intended for image displays, e.g. using thi.ng/pixel and
 * thi.ng/text-canvas
 * [`imageRaw`](https://docs.thi.ng/umbrella/text-canvas/functions/imageRaw.html).
 * Also see {@link format565} and {@link format565_8bit}.
 *
 * https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit
 */
export const FMT_ANSI565: StringFormat = {
	format: (code, x) => FMT_ANSI565.start(code) + x + FMT_ANSI565.end,
	start: (x: number) =>
		`\x1b[38;2;${(((x >> 11) & 31) * F5) | 0};${
			(((x >> 5) & 63) * F6) | 0
		};${((x & 31) * F5) | 0}m`,
	end: ANSI_RESET,
	prefix: ANSI_RESET,
	suffix: "\n",
	zero: true,
};

/**
 * Takes 2 ANSI256 values and returns a combined 16bit format ID.
 *
 * @remarks
 * https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit
 *
 * @param fg -
 * @param bg -
 */
export const format256 = (fg: number, bg = 0) =>
	((bg & 0xff) << 8) | (fg & 0xff);

/**
 * Takes _normalized_ RGB values (`[0,1]` range) and converts them into an RGB565
 * value for later use with {@link FMT_ANSI565} or {@link FMT_HTML565}. Does
 * NOT perform clipping!
 *
 * @param r -
 * @param g -
 * @param b -
 */
export const format565 = (r: number, g: number, b: number) =>
	((r * 0x1f) << 11) | ((g * 0x3f) << 5) | (b * 0x1f);

/**
 * Converts RGB (8bit channels) into a 16bit RGB565 value for later use with
 * {@link FMT_ANSI565} or {@link FMT_HTML565}. Does NOT perform clipping!
 *
 * @param r -
 * @param g -
 * @param b -
 */
export const format565_8bit = (r: number, g: number, b: number) =>
	((r << 8) & 0xf800) | ((g << 3) & 0x7e0) | (b >> 3);

/**
 * Syntax sugar for `defFormat(FMT_ANSI16, ...)`
 *
 * @param col -
 */
export const defAnsi16 = (col: number) => defFormat(FMT_ANSI16, col);

/**
 * Syntax sugar for `defFormat(FMT_ANSI256, ...)`
 *
 * @param col -
 */
export const defAnsi256 = (col: number) => defFormat(FMT_ANSI256, col);

/**
 * Syntax sugar for `defFormat(FMT_ANSI565, ...)`
 *
 * @param col -
 */
export const defAnsi565 = (col: number) => defFormat(FMT_ANSI565, col);
