// SPDX-License-Identifier: Apache-2.0
import type { FnN3 } from "@thi.ng/api";
import { defmulti } from "@thi.ng/defmulti/defmulti";
import { fit } from "@thi.ng/math/fit";
import { fract } from "@thi.ng/math/prec";
import { ONE3 } from "@thi.ng/vectors/api";
import { setC4 } from "@thi.ng/vectors/setc";
import { sub3 } from "@thi.ng/vectors/sub";
import type { Color, ColorOp, TypedColor } from "./api.js";
import { clamp } from "./clamp.js";
import { __dispatch1 } from "./internal/dispatch.js";
import { __ensureAlpha } from "./internal/ensure.js";

/**
 * Inverts the RGB channels of an RGBA color.
 *
 * @remarks
 * If `out` is null, the resulting color will be written back into `src`.
 *
 * @param out - result
 * @param src - source color
 */
export const invertRgb: ColorOp = (out, src) => {
	out = clamp(out || src, src);
	return sub3(out, ONE3, out);
};

/**
 * Inverts the lowest 24 bits of an ARGB int. Does not modify alpha.
 *
 * @param src - packed RGB int
 */
export const invertInt = (src: number) => src ^ 0xffffff;

/**
 * Inverts given color and writes result into `out` (or if null, mutates `src`
 * in place).
 *
 * @param out
 * @param src
 */
export const invert = defmulti<Color | null, TypedColor<any>, Color>(
	__dispatch1,
	{
		hcy: "hsv",
		hsi: "hsv",
		hsl: "hsv",
		labD65: "labD50",
		oklab: "labD50",
		srgb: "rgb",
	},
	{
		hsv: (out, src) =>
			setC4(
				out || src,
				fract(src[0] + 0.5),
				src[1],
				1 - src[2],
				__ensureAlpha(src[3])
			),
		labD50: (out, src) => {
			const [min, max] = src.range;
			return setC4(
				out || src,
				1 - src[0],
				__invert1(src[1], min[1], max[1]),
				__invert1(src[2], min[2], max[2]),
				__ensureAlpha(src[3])
			);
		},
		lch: (out, src) =>
			setC4(
				out || src,
				1 - src[0],
				src[1],
				fract(src[2] + 0.5),
				__ensureAlpha(src[3])
			),
		rgb: invertRgb,
		ycc: (out, src) =>
			setC4(
				out || src,
				1 - src[0],
				__invert1(src[1], -0.5, 0.5),
				__invert1(src[2], -0.5, 0.5),
				__ensureAlpha(src[3])
			),
	}
);

const __invert1: FnN3 = (x, a, b) => fit(x, a, b, b, a);
