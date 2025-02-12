// SPDX-License-Identifier: Apache-2.0
import type { DitherKernel } from "./api.js";

const A = 64 / 42;
const B = 2 * A;
const C = 4 * A;
const D = 8 * A;

/**
 * Stucki dither kernel (similar/improved version of {@link JARVIS_JUDICE_NINKE}).
 *
 * @remarks
 * Reference:
 * https://tannerhelland.com/2012/12/28/dithering-eleven-algorithms-source-code.html
 */
export const STUCKI: DitherKernel = {
	ox: [1, 2, -2, -1, 0, 1, 2, -2, -1, 0, 1, 2],
	oy: [0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2],
	weights: [D, C, B, C, D, C, B, A, B, C, B, A],
	shift: C,
};
