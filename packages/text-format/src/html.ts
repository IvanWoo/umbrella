import { U8 } from "@thi.ng/hex";
import { memoizeO } from "@thi.ng/memoize/memoizeo";
import type { HtmlFormatOpts, StringFormat } from "./api.js";

const F5 = 255 / 31;
const F6 = 255 / 63;

/**
 * Constructs an HTML formatter using given config options and for use w/
 * default format IDs only.
 *
 * @param opts -
 */
export const formatHtml = ({
	colors,
	attrib,
	delim,
	fg,
	bg,
	bold,
	dim,
	underline,
}: HtmlFormatOpts): StringFormat => {
	const start = memoizeO((x: number) => {
		let y = x & 0xf;
		let res = `<span ${attrib}="${fg}${
			colors[(y - 1) | ((x >> 1) & 0x8)]
		}${delim}`;
		y = (x >> 5) & 0x0f;
		y && (res += `${bg}${colors[(y - 1) | ((x >> 6) & 0x8)]}${delim}`);
		x & 0x400 && (res += bold + delim);
		x & 0x800 && (res += dim + delim);
		x & 0x1000 && (res += underline + delim);
		return res + '">';
	});
	const end = "</span>";
	return {
		format: (code, x) => start(code) + x + end,
		start,
		end,
		prefix: "",
		suffix: "<br/>",
	};
};

/**
 * Preset HTML string formatter for use w/ default format IDs, generating
 * `<span>` elements with inline CSS.
 */
export const FMT_HTML_INLINE_CSS = formatHtml({
	colors: [
		"#000",
		"#a00",
		"#0a0",
		"#aa0",
		"#00a",
		"#a0a",
		"#0aa",
		"#aaa",
		"#555",
		"#f55",
		"#5f5",
		"#ff5",
		"#55f",
		"#f5f",
		"#5ff",
		"#fff",
	],
	attrib: "style",
	delim: ";",
	fg: "color:",
	bg: "background:",
	bold: "font-weight:bold",
	dim: "opacity:0.5",
	underline: "text-decoration:underline",
});

/** @internal */
const TACHYON_COLORS = [
	"black",
	"dark-red",
	"dark-green",
	"gold",
	"dark-blue",
	"dark-pink",
	"light-blue",
	"moon-gray",
	"mid-gray",
	"red",
	"green",
	"yellow",
	"blue",
	"hot-pink",
	"lightest-blue",
	"white",
];

/**
 * Preset HTML formatter for use w/ default format IDs, generating `<span>`
 * elements with Tachyons CSS classes.
 */
export const FMT_HTML_TACHYONS = formatHtml({
	colors: TACHYON_COLORS,
	attrib: "class",
	delim: " ",
	fg: "",
	bg: "bg-",
	bold: "b",
	dim: "o-50",
	underline: "underline",
});

/**
 * Preset HTML formatter for use w/ default text format IDs, generating `<span>`
 * elements with thi.ng/meta-css base framework color classes.
 */
export const FMT_HTML_MCSS = formatHtml({
	colors: TACHYON_COLORS,
	attrib: "class",
	delim: " ",
	fg: "color-",
	bg: "bg-color-",
	bold: "b",
	dim: "o-50",
	underline: "underline",
});

/**
 * Preset HTML formatter for use w/ default text format IDs, generating `<span>`
 * elements with `style` attributes and given CSS variable names for defining
 * colors.
 *
 * @remarks
 * The color variable names must be given in this order:
 *
 * - black
 * - red
 * - green
 * - yellow
 * - blue
 * - magenta
 * - cyan
 * - light gray
 * - gray
 * - light red
 * - light green
 * - light yellow
 * - light blue
 * - light magenta
 * - light cyan
 * - white
 *
 * @param varNames
 */
export const FMT_HTML_CSS_VARS = (varNames: string[]) =>
	formatHtml({
		colors: varNames.map((x) => `var(--${x})`),
		attrib: "style",
		delim: ";",
		fg: "color:",
		bg: "background:",
		bold: "font-weight:bold",
		dim: "opacity:0.5",
		underline: "text-decoration:underline",
	});

/**
 * Higher order custom HTML formatter for 16bit (RGB565) colors (without
 * additional formatting flags). By default assigns text color, but can be
 * assigned to any CSS property via given `prop` argument.
 *
 * @param prop -
 */
export const FMT_HTML565 = (prop = "color"): StringFormat => {
	const start = memoizeO(
		(x: number) =>
			`<span style="${prop}:#${U8((x >> 11) * F5)}${U8(
				((x >> 5) & 0x3f) * F6
			)}${U8((x & 0x1f) * F5)}">`
	);
	const end = "</span>";
	return {
		format: (code, x) => start(code) + x + end,
		start,
		end,
		prefix: "",
		suffix: "<br/>",
		zero: true,
	};
};
