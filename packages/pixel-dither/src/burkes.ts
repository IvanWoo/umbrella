// SPDX-License-Identifier: Apache-2.0
import type { DitherKernel } from "./api.js";

/**
 * Burkes dither kernel (similar/improved version of {@link STUCKI}).
 *
 * @remarks
 * Reference:
 * https://tannerhelland.com/2012/12/28/dithering-eleven-algorithms-source-code.html
 */
export const BURKES: DitherKernel = {
	ox: [1, 2, -2, -1, 0, 1, 2],
	oy: [0, 0, 1, 1, 1, 1, 1],
	weights: [8, 4, 2, 4, 8, 4, 2],
	shift: 5,
};
