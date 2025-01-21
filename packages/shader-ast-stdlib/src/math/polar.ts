// SPDX-License-Identifier: Apache-2.0
import type { FloatSym } from "@thi.ng/shader-ast";
import { V2, V3 } from "@thi.ng/shader-ast/api/types";
import { defn, ret } from "@thi.ng/shader-ast/ast/function";
import { vec2, vec3 } from "@thi.ng/shader-ast/ast/lit";
import { div } from "@thi.ng/shader-ast/ast/ops";
import { $x, $y, $z } from "@thi.ng/shader-ast/ast/swizzle";
import { sym } from "@thi.ng/shader-ast/ast/sym";
import { asin, atan, length } from "@thi.ng/shader-ast/builtin/math";

/**
 * Converts 2D cartesian vector `v` to polar coordinates, i.e. `[r,θ]`
 * (angle in radians). See {@link cartesian2} for reverse operation.
 *
 * @param v -
 */
export const polar2 = defn(V2, "polar2", [V2], (v) => [
	ret(vec2(length(v), atan(div($y(v), $x(v))))),
]);

/**
 * Converts 3D cartesian vector `v` to spherical coordinates, i.e.
 * `[r,θ,ϕ]` (angles in radians). See {@link cartesian3} for reverse
 * operation.
 *
 * @param v -
 */
export const polar3 = defn(V3, "polar3", [V3], (v) => {
	let r: FloatSym;
	return [
		(r = sym(length(v))),
		ret(vec3(r, asin(div($z(v), r)), atan(div($y(v), $x(v))))),
	];
});
