// SPDX-License-Identifier: Apache-2.0
import type { DitherKernel } from "./api.js";

/**
 * (Bill) Atkinson dither kernel
 *
 * @remarks
 * References:
 * - https://beyondloom.com/blog/dither.html
 * - https://tannerhelland.com/2012/12/28/dithering-eleven-algorithms-source-code.html
 */
export const ATKINSON: DitherKernel = {
	ox: [1, 2, -1, 0, 1, 0],
	oy: [0, 0, 1, 1, 1, 2],
	weights: [1, 1, 1, 1, 1, 1],
	shift: 3,
};
