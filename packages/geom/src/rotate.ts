// SPDX-License-Identifier: Apache-2.0
import type { MultiFn2 } from "@thi.ng/defmulti";
import { defmulti } from "@thi.ng/defmulti/defmulti";
import { mulV22 } from "@thi.ng/matrices/mulv";
import { rotation22 } from "@thi.ng/matrices/rotation";
import { rotate as $rotate } from "@thi.ng/vectors/rotate";
import type { IShape2, PathSegment2 } from "./api.js";
import type { Arc } from "./api/arc.js";
import { Circle } from "./api/circle.js";
import type { Ellipse } from "./api/ellipse.js";
import type { Group } from "./api/group.js";
import type { Path } from "./api/path.js";
import type { Points } from "./api/points.js";
import type { Polygon } from "./api/polygon.js";
import { Ray } from "./api/ray.js";
import type { Rect } from "./api/rect.js";
import { Text } from "./api/text.js";
import { asPath } from "./as-path.js";
import { asPolygon } from "./as-polygon.js";
import { __copyAttribs } from "./internal/copy.js";
import { __dispatch } from "./internal/dispatch.js";
import { __ensureNoArc } from "./internal/error.js";
import { __segmentTransformer } from "./internal/transform.js";

export type RotateFn = {
	(shape: Arc, theta: number): Path;
	(shape: Ellipse, theta: number): Path;
	(shape: Rect, theta: number): Polygon;
	<T extends IShape2>(shape: T, theta: number): T;
} & MultiFn2<IShape2, number, IShape2>;

/**
 * Rotates given 2D shape by `theta` (in radians).
 *
 * @remarks
 * Currently implemented for:
 *
 * - {@link Arc}
 * - {@link BPatch}
 * - {@link Circle}
 * - {@link ComplexPolygon}
 * - {@link Cubic}
 * - {@link Ellipse}
 * - {@link Extra}
 * - {@link Group}
 * - {@link Line}
 * - {@link Path}
 * - {@link Points}
 * - {@link Polygon}
 * - {@link Polyline}
 * - {@link Quad}
 * - {@link Quadratic}
 * - {@link Ray}
 * - {@link Rect}
 * - {@link Text}
 * - {@link Triangle}
 *
 * @param shape
 * @param theta
 */
export const rotate = <RotateFn>defmulti<any, number, IShape2>(
	__dispatch,
	{
		arc: "$aspath",
		bpatch: "points",
		complexpoly: "group",
		cubic: "points",
		ellipse: "$aspath",
		line: "points",
		poly: "points",
		polyline: "points",
		quad: "points",
		quadratic: "points",
		rect: "$aspoly",
		tri: "points",
	},
	{
		$aspath: ($, theta) => rotate(asPath($), theta),

		$aspoly: ($, theta) => rotate(asPolygon($)[0], theta),

		circle: ($: Circle, theta) =>
			new Circle(
				$rotate([], $.pos, theta),
				$.r,
				__copyAttribs($.attribs)
			),

		extra: ($) => $,

		group: ($: Group, theta) => $.copyTransformed((x) => rotate(x, theta)),

		path: ($: Path, theta) => {
			const mat = rotation22([], theta);
			return $.copyTransformed(
				__segmentTransformer<PathSegment2>(
					(geo) => {
						__ensureNoArc(geo);
						return rotate(geo, theta);
					},
					(p) => mulV22([], mat, p)
				)
			);
		},

		points: ($: Points, theta) => {
			const mat = rotation22([], theta);
			return $.copyTransformed((points) =>
				points.map((p) => mulV22([], mat, p))
			);
		},

		ray: ($: Ray, theta) =>
			new Ray(
				$rotate([], $.pos, theta),
				$rotate([], $.dir, theta),
				__copyAttribs($.attribs)
			),

		text: ($: Text, theta) =>
			new Text(
				$rotate([], $.pos, theta),
				$.body,
				__copyAttribs($.attribs)
			),
	}
);
