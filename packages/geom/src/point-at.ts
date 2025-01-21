// SPDX-License-Identifier: Apache-2.0
import type { Maybe } from "@thi.ng/api";
import type { MultiFn2 } from "@thi.ng/defmulti";
import { defmulti } from "@thi.ng/defmulti/defmulti";
import type { IShape } from "./api.js";
import { Sampler } from "@thi.ng/geom-resample/sampler";
import { cossin } from "@thi.ng/math/angle";
import { TAU } from "@thi.ng/math/api";
import { fit01 } from "@thi.ng/math/fit";
import type { Vec } from "@thi.ng/vectors";
import { cartesian2 } from "@thi.ng/vectors/cartesian";
import { madd2 } from "@thi.ng/vectors/madd";
import { mixCubic } from "@thi.ng/vectors/mix-cubic";
import { mixQuadratic } from "@thi.ng/vectors/mix-quadratic";
import { mixN2 } from "@thi.ng/vectors/mixn";
import { pointOnRay2, pointOnRay3 } from "@thi.ng/vectors/point-on-ray";
import type { Arc } from "./api/arc.js";
import type { Circle } from "./api/circle.js";
import type { Cubic } from "./api/cubic.js";
import type { Ellipse } from "./api/ellipse.js";
import type { Line } from "./api/line.js";
import type { Polygon } from "./api/polygon.js";
import type { Quadratic } from "./api/quadratic.js";
import type { Ray } from "./api/ray.js";
import type { Rect } from "./api/rect.js";
import { __dispatch } from "./internal/dispatch.js";
import { vertices } from "./vertices.js";

/**
 * Samples and returns point on the boundary of given 2D shape at normalized
 * parametric distance `t`. If the shape is closed, t=0 and t=1 yield the same
 * result.
 *
 * @remarks
 * Currently implemented for:
 *
 * - {@link Arc}
 * - {@link Circle}
 * - {@link Cubic}
 * - {@link Ellipse}
 * - {@link Line}
 * - {@link Polygon}
 * - {@link Polyline}
 * - {@link Quad}
 * - {@link Quadratic}
 * - {@link Ray}
 * - {@link Rect}
 * - {@link Triangle}
 *
 * Note: For {@link Ray}, the `t` is interpreted as distance from the ray origin.
 *
 * @param shape
 * @param t
 */
export const pointAt: MultiFn2<IShape, number, Maybe<Vec>> = defmulti<
	any,
	number,
	Maybe<Vec>
>(
	__dispatch,
	{
		quad: "poly",
		tri: "poly",
	},
	{
		arc: ($: Arc, t: number) => $.pointAtTheta(fit01(t, $.start, $.end)),

		circle: ($: Circle, t) => cartesian2(null, [$.r, TAU * t], $.pos),

		cubic: ({ points }: Cubic, t) =>
			mixCubic([], points[0], points[1], points[2], points[3], t),

		ellipse: ($: Ellipse, t) => madd2([], cossin(TAU * t), $.r, $.pos),

		line: ({ points }: Line, t) => mixN2([], points[0], points[1], t),

		poly: ($: Polygon, t) => new Sampler($.points, true).pointAt(t),

		polyline: ($: Polygon, t) => new Sampler($.points).pointAt(t),

		quadratic: ({ points }: Quadratic, t) =>
			mixQuadratic([], points[0], points[1], points[2], t),

		ray: ($: Ray, t) => pointOnRay2([], $.pos, $.dir, t),

		ray3: ($: Ray, t) => pointOnRay3([], $.pos, $.dir, t),

		rect: ($: Rect, t) => new Sampler(vertices($), true).pointAt(t),
	}
);
