// SPDX-License-Identifier: Apache-2.0
import { safeDiv } from "@thi.ng/math/safe-div";
import { setC4 } from "@thi.ng/vectors/setc";
import type { ColorOp } from "../api.js";
import { __ensureAlpha } from "../internal/ensure.js";

/**
 * @remarks
 * - https://en.wikipedia.org/wiki/CIE_1931_color_space#CIE_xy_chromaticity_diagram_and_the_CIE_xyY_color_space
 * - https://gamedev.stackexchange.com/a/70049
 *
 * @param out -
 * @param src -
 */
export const xyyXyz: ColorOp = (out, src) => {
	const { 0: x, 1: y, 2: Y } = src;
	return setC4(
		out || src,
		safeDiv(Y * x, y),
		Y,
		safeDiv(Y * (1 - x - y), y),
		__ensureAlpha(src[3])
	);
};
