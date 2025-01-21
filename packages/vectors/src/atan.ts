// SPDX-License-Identifier: Apache-2.0
import type { MultiVecOpV, MultiVecOpVV, VecOpV, VecOpVV } from "./api.js";
import { defFnOp, defOp } from "./compile/emit.js";
import { ARGS_VV, FN2 } from "./compile/templates.js";

export const [atan, atan2, atan3, atan4] = defFnOp<MultiVecOpV, VecOpV>(
	"Math.atan"
);

export const [atan_2, atan_22, atan_23, atan_24] = defOp<MultiVecOpVV, VecOpVV>(
	FN2("Math.atan2"),
	ARGS_VV
);
