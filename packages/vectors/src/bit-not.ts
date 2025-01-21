// SPDX-License-Identifier: Apache-2.0
import type { MultiVecOpV, VecOpV } from "./api.js";
import { defOp } from "./compile/emit.js";
import { ARGS_V } from "./compile/templates.js";

export const [bitNotI, bitNotI2, bitNotI3, bitNotI4] = defOp<
	MultiVecOpV,
	VecOpV
>(([o, a]) => `${o}=(~${a})|0;`, ARGS_V);
export const [bitNotU, bitNotU2, bitNotU3, bitNotU4] = defOp<
	MultiVecOpV,
	VecOpV
>(([o, a]) => `${o}=(~${a})>>>0;`, ARGS_V);
