import type { Maybe } from "@thi.ng/api";
import type { MultiFn1O } from "@thi.ng/defmulti";
import { defmulti } from "@thi.ng/defmulti/defmulti";
import type { IShape, SamplingOpts } from "@thi.ng/geom-api";
import { set } from "@thi.ng/vectors/set";
import type { Path } from "./api/path.js";
import { Polyline } from "./api/polyline.js";
import { __copyAttribsNoSamples as __attribs } from "./internal/copy.js";
import { __dispatch } from "./internal/dispatch.js";
import { vertices } from "./vertices.js";

/**
 * Converts given shape into a {@link Polyline}, optionally using provided
 * [`SamplingOpts`](https://docs.thi.ng/umbrella/geom-api/interfaces/SamplingOpts.html)
 * or number of target vertices.
 *
 * @remarks
 * If the shape has a `__samples` attribute, it will be removed in the result to
 * avoid recursive application.
 *
 * Currently implemented for:
 *
 * - {@link Arc}
 * - {@link Circle}
 * - {@link Cubic}
 * - {@link Ellipse}
 * - {@link Line}
 * - {@link Path}
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
export const asPolyline: MultiFn1O<
	IShape,
	number | Partial<SamplingOpts>,
	Polyline
> = defmulti<any, Maybe<number | Partial<SamplingOpts>>, Polyline>(
	__dispatch,
	{
		arc: "points",
		circle: "poly",
		cubic: "points",
		ellipse: "poly",
		line: "points",
		polyline: "points",
		quad: "poly",
		quadratic: "points",
		rect: "poly",
		tri: "poly",
	},
	{
		points: ($, opts) => new Polyline(vertices($, opts), __attribs($)),

		path: ($: Path, opts) => {
			const pts = vertices($, opts);
			$.closed && pts.push(set([], pts[0]));
			return new Polyline(pts, __attribs($));
		},

		poly: ($, opts) => {
			const pts = vertices($, opts);
			pts.push(set([], pts[0]));
			return new Polyline(pts, __attribs($));
		},
	}
);
