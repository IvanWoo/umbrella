// SPDX-License-Identifier: Apache-2.0
import type { MultiFn1 } from "@thi.ng/defmulti";
import { DEFAULT, defmulti } from "@thi.ng/defmulti/defmulti";
import type { IShape } from "./api.js";
import { PI } from "@thi.ng/math/api";
import type { AABB } from "./api/aabb.js";
import type { Sphere } from "./api/sphere.js";
import { __dispatch } from "./internal/dispatch.js";

/**
 * Returns the volume of given 3D shape. Returns 0 for all others.
 *
 * @remarks
 * Currently only implemented for:
 *
 * - {@link AABB}
 * - {@link Sphere}
 *
 * @param shape
 */
export const volume: MultiFn1<IShape, number> = defmulti<any, number>(
	__dispatch,
	{},
	{
		[DEFAULT]: () => 0,

		aabb: ({ size }: AABB) => size[0] * size[1] * size[2],

		sphere: ($: Sphere) => (4 / 3) * PI * $.r ** 3,
	}
);
