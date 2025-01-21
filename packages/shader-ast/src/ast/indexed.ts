// SPDX-License-Identifier: Apache-2.0
import { isNumber } from "@thi.ng/checks/is-number";
import type { Index, IndexM, Sym } from "../api/nodes.js";
import type { UintTerm } from "../api/terms.js";
import {
	F,
	V2,
	V3,
	V4,
	type IndexTypeMap,
	type Indexable,
	type Mat,
	type MatIndexTypeMap,
	type NumericI,
	type Vec,
} from "../api/types.js";
import { int } from "./lit.js";

export const index = <T extends Indexable>(
	val: Sym<T>,
	id: NumericI | UintTerm
): Index<IndexTypeMap[T]> => ({
	tag: "idx",
	type: <any>val.type.substring(0, val.type.length - 2),
	id: isNumber(id) ? int(id) : id,
	val,
});

const MAT_VEC: Record<Mat, Vec> = {
	mat2: V2,
	mat3: V3,
	mat4: V4,
	// mat23: "vec3",
	// mat24: "vec4",
	// mat32: "vec2",
	// mat34: "vec4",
	// mat42: "vec2",
	// mat43: "vec3",
};

// prettier-ignore
export function indexMat<T extends keyof MatIndexTypeMap>(m: Sym<T>, id: number): IndexM<MatIndexTypeMap[T]>;
// prettier-ignore
export function indexMat<T extends keyof MatIndexTypeMap>(m: Sym<T>, a: number, b: number): Index<"float">;
export function indexMat(m: Sym<any>, a: number, b?: number): any {
	const idx: IndexM<any> = {
		tag: "idxm",
		type: MAT_VEC[<Mat>m.type],
		id: int(a),
		val: m,
	};
	return b !== undefined
		? { tag: "idx", type: F, id: int(b), val: idx }
		: idx;
}
