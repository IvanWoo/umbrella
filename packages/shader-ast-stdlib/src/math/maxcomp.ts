// SPDX-License-Identifier: Apache-2.0
import type { Vec2Sym, Vec3Sym, Vec4Sym } from "@thi.ng/shader-ast";
import { $w, $x, $y, $z } from "@thi.ng/shader-ast/ast/swizzle";
import { max } from "@thi.ng/shader-ast/builtin/math";

/**
 * Inline function. Returns max(v.x, v.y)
 *
 * @param v -
 */
export const maxComp2 = (v: Vec2Sym | Vec3Sym | Vec4Sym) => max($x(v), $y(v));

/**
 * Inline function. Returns max(v.x, v.y, v.z)
 *
 * @param v -
 */
export const maxComp3 = (v: Vec3Sym | Vec4Sym) => max(maxComp2(v), $z(v));

/**
 * Inline function. Returns max(v.x, v.y, v.z, v.w)
 *
 * @param v -
 */
export const maxComp4 = (v: Vec4Sym) => max(maxComp3(v), $w(v));
