// SPDX-License-Identifier: Apache-2.0
import type { DitherKernel } from "./api.js";

/**
 * (Frankie) Sierra's 2-row dither kernel.
 *
 * @remarks
 * Reference:
 * https://tannerhelland.com/2012/12/28/dithering-eleven-algorithms-source-code.html
 */
export const SIERRA2: DitherKernel = {
	ox: [1, 2, -2, -1, 0, 1, 2],
	oy: [0, 0, 1, 1, 1, 1, 1],
	weights: [4, 3, 1, 2, 3, 2, 1],
	shift: 4,
};
