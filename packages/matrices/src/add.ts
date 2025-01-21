// SPDX-License-Identifier: Apache-2.0
import { add as _add, add4 } from "@thi.ng/vectors/add";
import type { MatOpMM, MultiMatOpMM } from "./api.js";
import { defMath } from "./compile/emit.js";

/**
 * Componentwise matrix addition. If `out` is not given, writes result
 * in `a`. Both input matrices MUST be of same size.
 *
 * out = a + b
 *
 * @param out -
 * @param a -
 * @param b -
 */
export const add: MultiMatOpMM = _add;
export const add22: MatOpMM = add4;
export const [add23, add33, add44] = defMath(add, "+");
