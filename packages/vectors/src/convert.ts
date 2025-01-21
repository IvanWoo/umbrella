// SPDX-License-Identifier: Apache-2.0
import type {
	FromBVecOpV,
	MultiFromBVecOpV,
	MultiToBVecOpV,
	MultiVecOpV,
	Template,
	ToBVecOpV,
	VecOpV,
} from "./api.js";
import { defOp } from "./compile/emit.js";
import { ARGS_V, NEW_OUT } from "./compile/templates.js";

const $ = <M, V>(tpl: Template, pre = NEW_OUT) =>
	defOp<M, V>(tpl, ARGS_V, ARGS_V, "o", 1, pre);

export const [asIVec, asIVec2, asIVec3, asIVec4] = $<MultiVecOpV, VecOpV>(
	([o, a]) => `${o}=${a}|0;`
);

export const [asUVec, asUVec2, asUVec3, asUVec4] = $<MultiVecOpV, VecOpV>(
	([o, a]) => `${o}=${a}>>>0;`
);

export const [asBVec, asBVec2, asBVec3, asBVec4] = $<MultiToBVecOpV, ToBVecOpV>(
	([o, a]) => `${o}=!!${a};`
);

export const [fromBVec, fromBVec2, fromBVec3, fromBVec4] = $<
	MultiFromBVecOpV,
	FromBVecOpV
>(([o, a]) => `${o}=~~${a};`);
