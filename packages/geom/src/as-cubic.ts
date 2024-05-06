import type { Maybe } from "@thi.ng/api";
import type { MultiFn1O } from "@thi.ng/defmulti";
import { defmulti } from "@thi.ng/defmulti/defmulti";
import type { CubicOpts, IShape, PCLike } from "@thi.ng/geom-api";
import {
	closedCubicFromBreakPoints,
	openCubicFromBreakPoints,
} from "@thi.ng/geom-splines/cubic-from-breakpoints";
import {
	closedCubicFromControlPoints,
	openCubicFromControlPoints,
} from "@thi.ng/geom-splines/cubic-from-controlpoints";
import { TAU } from "@thi.ng/math/api";
import { concat } from "@thi.ng/transducers/concat";
import { flatten1 } from "@thi.ng/transducers/flatten1";
import { mapcat } from "@thi.ng/transducers/mapcat";
import type { ReadonlyVec, Vec } from "@thi.ng/vectors";
import type { Circle } from "./api/circle.js";
import type { ComplexPolygon } from "./api/complex-polygon.js";
import { Cubic } from "./api/cubic.js";
import type { Group } from "./api/group.js";
import type { Line } from "./api/line.js";
import type { Path } from "./api/path.js";
import type { Polygon } from "./api/polygon.js";
import type { Polyline } from "./api/polyline.js";
import type { Quadratic } from "./api/quadratic.js";
import type { Rect } from "./api/rect.js";
import { arc } from "./arc.js";
import { asPolygon } from "./as-polygon.js";
import { cubicFromArc, cubicFromLine, cubicFromQuadratic } from "./cubic.js";
import { __copyAttribs } from "./internal/copy.js";
import { __dispatch } from "./internal/dispatch.js";

/**
 * Converts given shape into an array of {@link Cubic} curves. For some shapes
 * (see below) the conversion supports optionally provided {@link CubicOpts}.
 *
 * @remarks
 * Currently implemented for:
 *
 * - {@link Arc}
 * - {@link Circle}
 * - {@link ComplexPolygon}
 * - {@link Cubic}
 * - {@link Ellipse}
 * - {@link Group}
 * - {@link Line}
 * - {@link Path}
 * - {@link Polygon}
 * - {@link Polyline}
 * - {@link Quad}
 * - {@link Quadratic}
 * - {@link Rect}
 * - {@link Triangle}
 *
 * Shape types supporting custom conversion options (see
 * [@thi.ng/geom-splines](https://github.com/thi-ng/umbrella/tree/develop/packages/geom-splines#cubic-curve-conversion-from-polygons--polylines)
 * for more details):
 *
 * - {@link Group} (only used for eligible children)
 * - {@link ComplexPolygon}
 * - {@link Polygon}
 * - {@link Polyline}
 * - {@link Quad}
 * - {@link Quadratic}
 * - {@link Rect}
 * - {@link Triangle}
 *
 * @param shape
 * @param opts
 */
export const asCubic: MultiFn1O<IShape, Partial<CubicOpts>, Cubic[]> = defmulti<
	any,
	Maybe<Partial<CubicOpts>>,
	Cubic[]
>(
	__dispatch,
	{
		ellipse: "circle",
		quad: "poly",
		tri: "poly",
	},
	{
		arc: cubicFromArc,

		circle: ($: Circle) => asCubic(arc($.pos, $.r, 0, 0, TAU, true, true)),

		complexpoly: ($: ComplexPolygon, opts = {}) => [
			...mapcat((x) => asCubic(x, opts), [$.boundary, ...$.children]),
		],

		cubic: ($: Cubic) => [$],

		group: ($: Group, opts) => [
			...mapcat((x) => asCubic(x, opts), $.children),
		],

		line: ({ attribs, points }: Line) => [
			cubicFromLine(points[0], points[1], { ...attribs }),
		],

		path: ($: Path) => [
			...mapcat(
				(segment) => (segment.geo ? asCubic(segment.geo) : null),
				concat($.segments, flatten1($.subPaths))
			),
		],

		poly: ($: Polygon, opts = {}) =>
			__polyCubic(
				$,
				opts,
				closedCubicFromBreakPoints,
				closedCubicFromControlPoints
			),

		polyline: ($: Polyline, opts = {}) =>
			__polyCubic(
				$,
				opts,
				openCubicFromBreakPoints,
				openCubicFromControlPoints
			),

		quadratic: ({ attribs, points }: Quadratic) => [
			cubicFromQuadratic(points[0], points[1], points[2], { ...attribs }),
		],

		rect: ($: Rect, opts) => asCubic(asPolygon($)[0], opts),
	}
);

/**
 * @internal
 */
// prettier-ignore
const __polyCubic = (
    $: PCLike,
    opts: Partial<CubicOpts>,
    breakPoints: (pts: ReadonlyVec[], t?: number, uniform?: boolean) => Vec[][],
    controlPoints: (pts: ReadonlyVec[], t?: number, uniform?: boolean) => Vec[][]
) => {
    opts = { breakPoints: false, scale: 1 / 3, uniform: false, ...opts };
    return (opts.breakPoints
        ? breakPoints($.points, opts.scale, opts.uniform)
        : controlPoints($.points, opts.scale, opts.uniform)
    ).map((pts) => new Cubic(pts, __copyAttribs($)));
};
