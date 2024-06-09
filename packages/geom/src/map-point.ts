import type { Maybe } from "@thi.ng/api";
import type { MultiFn2O } from "@thi.ng/defmulti";
import { defmulti } from "@thi.ng/defmulti/defmulti";
import type { IShape } from "./api.js";
import type { ReadonlyVec, Vec } from "@thi.ng/vectors";
import { div } from "@thi.ng/vectors/div";
import { sub } from "@thi.ng/vectors/sub";
import type { Rect } from "./api/rect.js";
import { __dispatch } from "./internal/dispatch.js";

/**
 * Maps point `p` from world space to the local space of given shape.
 *
 * @remarks
 * This is the reverse operation of {@link unmapPoint}.
 *
 * Currently only implemented for:
 *
 * - {@link AABB}
 * - {@link Rect}
 *
 * @param shape
 * @param p
 * @param out
 */
export const mapPoint: MultiFn2O<IShape, ReadonlyVec, Vec, Vec> = defmulti<
	any,
	ReadonlyVec,
	Maybe<Vec>,
	Vec
>(
	__dispatch,
	{ aabb: "rect" },
	{
		rect: ($: Rect, p: ReadonlyVec, out: Vec = []) =>
			div(null, sub(out, p, $.pos), $.size),
	}
);
