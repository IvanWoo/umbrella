// SPDX-License-Identifier: Apache-2.0
import {
	clamp as _clamp,
	clamp01 as _clamp01,
	clamp11 as _clamp11,
} from "@thi.ng/math/interval";
import type { MultiVecOpV, MultiVecOpVVV, VecOpV, VecOpVVV } from "./api.js";
import { defHofOp } from "./compile/emit.js";
import { ARGS_V, ARGS_VVV, FN, FN3 } from "./compile/templates.js";

export const [clamp, clamp2, clamp3, clamp4] = defHofOp<
	MultiVecOpVVV,
	VecOpVVV
>(_clamp, FN3(), ARGS_VVV);

export const [clamp01, clamp01_2, clamp01_3, clamp01_4] = defHofOp<
	MultiVecOpV,
	VecOpV
>(_clamp01, FN(), ARGS_V);

export const [clamp11, clamp11_2, clamp11_3, clamp11_4] = defHofOp<
	MultiVecOpV,
	VecOpV
>(_clamp11, FN(), ARGS_V);
