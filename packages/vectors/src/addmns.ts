// SPDX-License-Identifier: Apache-2.0
import type { VecOpSGVVN, VecOpSVVN } from "./api.js";
import { defOpS } from "./compile/emit.js";
import { ARGS_VVN, MATH2_N, SARGS_VV } from "./compile/templates.js";

export const [addmNS, addmNS2, addmNS3, addmNS4] = defOpS<
	VecOpSGVVN,
	VecOpSVVN
>(MATH2_N("+", "*"), ARGS_VVN, SARGS_VV);
