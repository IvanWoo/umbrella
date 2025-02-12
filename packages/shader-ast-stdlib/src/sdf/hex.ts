// SPDX-License-Identifier: Apache-2.0
import type { Vec2Sym } from "@thi.ng/shader-ast";
import { F, V2 } from "@thi.ng/shader-ast/api/types";
import { defn, ret } from "@thi.ng/shader-ast/ast/function";
import { FLOAT0, vec2 } from "@thi.ng/shader-ast/ast/lit";
import { mul, subSelf } from "@thi.ng/shader-ast/ast/ops";
import { $x, $y } from "@thi.ng/shader-ast/ast/swizzle";
import { sym } from "@thi.ng/shader-ast/ast/sym";
import {
	abs,
	clamp,
	dot,
	length,
	min,
	sign,
} from "@thi.ng/shader-ast/builtin/math";

/**
 * Returns signed distance from `p` to 2D hexagon of given radius `r`.
 *
 * @remarks
 * Ported from original GLSL impl by Inigo Quilez:
 * https://iquilezles.org/articles/distfunctions2d/
 */
export const sdfHexagon2 = defn(F, "sdfHexagon2", [V2, F], (p, r) => {
	const TAN30 = 0.5773502691896257;
	let k: Vec2Sym, q: Vec2Sym;
	return [
		// sin/cos @ 60deg
		(k = sym(vec2(-0.8660254037844386, 0.5))),
		(q = sym(abs(p))),
		subSelf(q, mul(k, mul(2, min(dot(k, q), FLOAT0)))),
		subSelf(q, vec2(clamp($x(q), mul(r, -TAN30), mul(r, TAN30)), r)),
		ret(mul(length(q), sign($y(q)))),
	];
});
