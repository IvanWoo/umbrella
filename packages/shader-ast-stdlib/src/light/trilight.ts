// SPDX-License-Identifier: Apache-2.0
import type { FloatSym } from "@thi.ng/shader-ast";
import { V3 } from "@thi.ng/shader-ast/api/types";
import { defn, ret } from "@thi.ng/shader-ast/ast/function";
import { FLOAT0, FLOAT1 } from "@thi.ng/shader-ast/ast/lit";
import { add, mul, neg, sub } from "@thi.ng/shader-ast/ast/ops";
import { sym } from "@thi.ng/shader-ast/ast/sym";
import { abs, dot, max } from "@thi.ng/shader-ast/builtin/math";

/**
 * Tom Forsyth's Trilight lighting model.
 *
 * @remarks
 * Reference:
 * https://tomforsyth1000.github.io/papers/trilight/trilight.html
 *
 * @param surfNormal - vec3
 * @param lightDir - vec3
 * @param col1 - vec3
 * @param col2 - vec3
 * @param col3 - vec3
 */
export const trilight = defn(
	V3,
	"trilight",
	[V3, V3, V3, V3, V3],
	(n, l, c1, c2, c3) => {
		let d: FloatSym;
		return [
			(d = sym(dot(n, l))),
			ret(
				add(
					add(mul(c1, max(d, FLOAT0)), mul(c2, sub(FLOAT1, abs(d)))),
					mul(c3, max(dot(neg(n), l), FLOAT0))
				)
			),
		];
	}
);
