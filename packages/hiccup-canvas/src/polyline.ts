// SPDX-License-Identifier: Apache-2.0
import type { IObjectOf } from "@thi.ng/api";
import type { ReadonlyVec } from "@thi.ng/vectors";
import { __endShape } from "./internal/end-shape.js";
import { __drawPackedPoly, __drawPoly } from "./polygon.js";

export const polyline = (
	ctx: CanvasRenderingContext2D,
	attribs: IObjectOf<any>,
	pts: ReadonlyVec[]
) => {
	if (pts.length < 2 || attribs.stroke == "none") return;
	__drawPoly(ctx, pts);
	__endShape(ctx, attribs, false);
};

export const packedPolyline = (
	ctx: CanvasRenderingContext2D,
	attribs: IObjectOf<any>,
	opts: IObjectOf<any>,
	pts: ArrayLike<number>
) => {
	if (pts.length < 2) return;
	__drawPackedPoly(ctx, opts, pts);
	__endShape(ctx, attribs, false);
};
