// SPDX-License-Identifier: Apache-2.0
import type { MultiVecOpRoVV, Template } from "./api.js";
import { compile, compileG } from "./compile/emit.js";
import { vop } from "./vop.js";

/** @internal */
const tpl: Template = ([a, b]) => `t=${a}-${b};s+=t*t;`;

/** @internal */
const pre = "let t,s=0;";

/** @internal */
const $ = (dim: number) =>
	distSq.add(dim, compile(dim, tpl, "a,b", undefined, "s", "", pre));

export const distSq: MultiVecOpRoVV<number> = vop();

distSq.default(compileG(tpl, "a,b", undefined, "s", pre));

export const distSq2 = $(2);
export const distSq3 = $(3);
export const distSq4 = $(4);
