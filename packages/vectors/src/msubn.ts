// SPDX-License-Identifier: Apache-2.0
import type { MultiVecOpVNV, VecOpVNV } from "./api.js";
import { defOp } from "./compile/emit.js";
import { ARGS_VNV, ARGS_VV, MATH2A_N } from "./compile/templates.js";

/**
 * Returns `out = a * n + b`.
 *
 * @param out - vec
 * @param a - vec
 * @param n - scalar
 * @param b - vec
 */
export const [msubN, msubN2, msubN3, msubN4] = defOp<MultiVecOpVNV, VecOpVNV>(
	MATH2A_N("*", "-"),
	ARGS_VNV,
	ARGS_VV
);
