// SPDX-License-Identifier: Apache-2.0
import type { VecOpV } from "@thi.ng/vec-api";
import { setC2 } from "./setc.js";

/**
 * 2D only. Produces a perpendicular vector to `v`, i.e. `[-y,x]`.
 * Assumes positive Y-up.
 *
 * @param out -
 * @param v -
 */
export const perpendicularCCW: VecOpV = (out, a) =>
	setC2(out || a, -a[1], a[0]);

/**
 * 2D only. Produces a clockwise perpendicular vector to `v`, i.e.
 * `[y,-x]`. Assumes positive Y-up.
 *
 * @param out -
 * @param v -
 */
export const perpendicularCW: VecOpV = (out, a) => setC2(out || a, a[1], -a[0]);
