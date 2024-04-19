import type { Maybe } from "@thi.ng/api";
import type { MultiFn2 } from "@thi.ng/defmulti";
import { defmulti } from "@thi.ng/defmulti/defmulti";
import type { IShape } from "@thi.ng/geom-api";
import { Sampler } from "@thi.ng/geom-resample/sampler";
import { cubicSplitAt } from "@thi.ng/geom-splines/cubic-split";
import { quadraticSplitAt } from "@thi.ng/geom-splines/quadratic-split";
import { fit01 } from "@thi.ng/math/fit";
import { set } from "@thi.ng/vectors/set";
import { Arc } from "./api/arc.js";
import { Cubic } from "./api/cubic.js";
import { Line } from "./api/line.js";
import { Polyline } from "./api/polyline.js";
import { Quadratic } from "./api/quadratic.js";
import { __copyAttribs } from "./internal/copy.js";
import { __dispatch } from "./internal/dispatch.js";
import { __pointArraysAsShapes } from "./internal/points-as-shape.js";
import { __splitLine } from "./internal/split.js";

/**
 * Splits given shape in 2 parts at normalized parametric position `t`.
 *
 * @remarks
 * Currently only implemented for:
 *
 * - {@link Arc}
 * - {@link Cubic}
 * - {@link Line}
 * - {@link Polyline}
 * - {@link Quadratic}
 *
 * @param shape
 * @param t
 */
export const splitAt: MultiFn2<IShape, number, Maybe<IShape[]>> = defmulti<
	any,
	number,
	Maybe<IShape[]>
>(
	__dispatch,
	{},
	{
		arc: ($: Arc, t: number) => {
			const theta = fit01(t, $.start, $.end);
			return [
				new Arc(
					set([], $.pos),
					set([], $.r),
					$.axis,
					$.start,
					theta,
					$.xl,
					$.cw,
					__copyAttribs($)
				),
				new Arc(
					set([], $.pos),
					set([], $.r),
					$.axis,
					theta,
					$.end,
					$.xl,
					$.cw,
					__copyAttribs($)
				),
			];
		},

		cubic: ({ attribs, points }: Cubic, t: number) =>
			cubicSplitAt(points[0], points[1], points[2], points[3], t).map(
				(pts) => new Cubic(pts, { ...attribs })
			),

		line: ({ attribs, points }: Line, t) =>
			__splitLine(points[0], points[1], t).map(
				(pts) => new Line(pts, { ...attribs })
			),

		polyline: ($: Polyline, t) =>
			__pointArraysAsShapes(
				Polyline,
				new Sampler($.points).splitAt(t),
				$.attribs
			),

		quadratic: ({ attribs, points }: Quadratic, t: number) =>
			quadraticSplitAt(points[0], points[1], points[2], t).map(
				(pts) => new Quadratic(pts, { ...attribs })
			),
	}
);
