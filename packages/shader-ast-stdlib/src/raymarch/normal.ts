// SPDX-License-Identifier: Apache-2.0
import type { Swizzle2_3, Vec2Sym } from "@thi.ng/shader-ast";
import { F, V3 } from "@thi.ng/shader-ast/api/types";
import { defn, ret } from "@thi.ng/shader-ast/ast/function";
import { gensym } from "@thi.ng/shader-ast/ast/idgen";
import { vec2, vec3 } from "@thi.ng/shader-ast/ast/lit";
import { add, sub } from "@thi.ng/shader-ast/ast/ops";
import { $, $x } from "@thi.ng/shader-ast/ast/swizzle";
import { sym } from "@thi.ng/shader-ast/ast/sym";
import { normalize } from "@thi.ng/shader-ast/builtin/math";
import type { RaymarchScene } from "../api.js";

/**
 * Higher order function producing a function to compute the raymarched
 * scene normal for a given scene function and intersection position.
 * Like {@link raymarchScene}, this function takes an existing scene
 * function as argument.
 *
 * @param scene -
 * @param name -
 */
export const raymarchNormal = (
	scene: RaymarchScene,
	name = gensym("raymarchNormal_")
) =>
	defn(V3, name, [V3, F], (p, smooth) => {
		let dn: Vec2Sym;
		const comp = (id: Swizzle2_3) =>
			sub($x(scene(add(p, $(dn, id)))), $x(scene(sub(p, $(dn, id)))));
		return [
			(dn = sym(vec2(smooth, 0))),
			ret(normalize(vec3(comp("xyy"), comp("yxy"), comp("yyx")))),
		];
	});
