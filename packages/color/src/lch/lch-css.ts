// SPDX-License-Identifier: Apache-2.0
import type { ReadonlyColor } from "../api.js";
import { __lchCss } from "../internal/css.js";

/**
 * @remarks
 * Only supported in CSS Color Level 4 onwards.
 *
 * References:
 *
 * - https://www.w3.org/TR/css-color-4/#specifying-lab-lch
 * - https://test.csswg.org/harness/results/css-color-4_dev/grouped/ (test reports)
 *
 * @param src -
 */
export const lchCss = (src: ReadonlyColor) => __lchCss("lch", src, 100);
