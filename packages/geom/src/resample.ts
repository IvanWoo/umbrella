import type { MultiFn2 } from "@thi.ng/defmulti";
import { defmulti } from "@thi.ng/defmulti/defmulti";
import type { IShape, PCLike, SamplingOpts } from "@thi.ng/geom-api";
import { resample as _resample } from "@thi.ng/geom-resample/resample";
import { ComplexPolygon } from "./api/complex-polygon.js";
import { Polygon } from "./api/polygon.js";
import { Polyline } from "./api/polyline.js";
import { asPolygon } from "./as-polygon.js";
import { __copyAttribsNoSamples as __attribs } from "./internal/copy.js";
import { __dispatch } from "./internal/dispatch.js";

/**
 * Resamples given 2D shape with given options and returns result as polygon (if
 * closed) or polyline (if open).
 *
 * @remarks
 * If the shape has a `__samples` attribute, it will be removed in the result to
 * avoid recursive application.
 *
 * Currently implemented for:
 *
 * - {@link Circle}
 * - {@link ComplexPolygon}
 * - {@link Ellipse}
 * - {@link Line}
 * - {@link Polygon}
 * - {@link Polyline}
 * - {@link Quad}
 * - {@link Rect}
 * - {@link Triangle}
 *
 * @param shape
 * @param opts
 */
export const resample: MultiFn2<
	IShape,
	number | Partial<SamplingOpts>,
	IShape
> = defmulti<any, number | Partial<SamplingOpts>, IShape>(
	__dispatch,
	{
		ellipse: "circle",
		line: "polyline",
		quad: "poly",
		tri: "poly",
		rect: "circle",
	},
	{
		circle: ($: IShape, opts) => asPolygon($, opts)[0],

		complexpoly: ($: ComplexPolygon, opts) =>
			new ComplexPolygon(
				<Polygon>resample($.boundary, opts),
				$.children.map((child) => <Polygon>resample(child, opts)),
				__attribs($)
			),

		poly: ($: PCLike, opts) =>
			new Polygon(_resample($.points, opts, true, true), __attribs($)),

		polyline: ($: PCLike, opts) =>
			new Polyline(_resample($.points, opts, false, true), __attribs($)),
	}
);
