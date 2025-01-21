// SPDX-License-Identifier: Apache-2.0
import type { MultiVecOpV, VecOpV } from "./api.js";
import { defFnOp } from "./compile/emit.js";

export const [exp, exp2, exp3, exp4] = defFnOp<MultiVecOpV, VecOpV>("Math.exp");
