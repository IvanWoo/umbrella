// SPDX-License-Identifier: Apache-2.0
import type { DitherKernel } from "./api.js";

/**
 * Floyd-Steinberg dither kernel.
 *
 * @remarks
 * References:
 * - https://en.wikipedia.org/wiki/Floyd%E2%80%93Steinberg_dithering
 * - https://tannerhelland.com/2012/12/28/dithering-eleven-algorithms-source-code.html
 */
export const FLOYD_STEINBERG: DitherKernel = {
	ox: [1, -1, 0, 1],
	oy: [0, 1, 1, 1],
	weights: [7, 3, 5, 1],
	shift: 4,
};
