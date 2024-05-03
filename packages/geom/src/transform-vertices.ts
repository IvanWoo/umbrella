import type { Fn } from "@thi.ng/api";
import type { MultiFn2 } from "@thi.ng/defmulti";
import { defmulti } from "@thi.ng/defmulti/defmulti";
import type { IHiccupShape, IShape, PathSegment } from "@thi.ng/geom-api";
import type { ReadonlyMat } from "@thi.ng/matrices";
import { mulV } from "@thi.ng/matrices/mulv";
import type { ReadonlyVec } from "@thi.ng/vectors";
import { ComplexPolygon } from "./api/complex-polygon.js";
import { Cubic } from "./api/cubic.js";
import type { Group } from "./api/group.js";
import { Line } from "./api/line.js";
import { Path } from "./api/path.js";
import { Points, Points3 } from "./api/points.js";
import { Polygon } from "./api/polygon.js";
import { Polyline } from "./api/polyline.js";
import { Quad } from "./api/quad.js";
import { Quadratic } from "./api/quadratic.js";
import type { Rect } from "./api/rect.js";
import { Triangle } from "./api/triangle.js";
import { asPolygon } from "./as-polygon.js";
import { asPolyline } from "./as-polyline.js";
import { __copyAttribs } from "./internal/copy.js";
import { __dispatch } from "./internal/dispatch.js";
import {
	__transformedShapePoints as tx,
	__transformedShapePoints3 as tx3,
} from "./internal/transform.js";

/**
 * Similar to {@link transform}. Transforms vertices of given shape with
 * provided function, which is being called for each vertex individually and
 * should produce a transformation matrix.
 *
 * @remark
 * Some shape types will be automatically converted to other types prior to
 * transformation because they cannot be reliably represented in their original
 * type anymore, this includes:
 *
 * - {@link Arc} => {@link Path} (cubics)
 * - {@link Circle} => {@link Path} (cubics)
 * - {@link Ellipse} => {@link Path} (cubics)
 * - {@link Rect} => {@link Polygon}
 *
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
 * - {@link Points}
 * - {@link Points3}
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
 * @param fn
 */
export const transformVertices: MultiFn2<
	IShape,
	Fn<ReadonlyVec, ReadonlyMat>,
	IShape
> = defmulti<any, Fn<ReadonlyVec, ReadonlyMat>, IShape>(
	__dispatch,
	{
		circle: "rect",
		ellipse: "circle",
	},
	{
		arc: ($: IShape, fn) => transformVertices(asPolyline($)[0], fn),

		complexpoly: ($: ComplexPolygon, fn) =>
			new ComplexPolygon(
				<Polygon>transformVertices($.boundary, fn),
				$.children.map((child) => <Polygon>transformVertices(child, fn))
			),

		cubic: tx(Cubic),

		group: ($: Group, fn) =>
			$.copyTransformed((x) => <IHiccupShape>transformVertices(x, fn)),

		line: tx(Line),

		path: ($: Path, fn) => {
			const $transformSegments = (segments: PathSegment[]) =>
				segments.map((s) =>
					s.type === "m"
						? <PathSegment>{
								type: s.type,
								point: mulV([], fn(s.point!), s.point!),
						  }
						: <PathSegment>{
								type: s.type,
								geo: transformVertices(s.geo!, fn),
						  }
				);
			return new Path(
				$transformSegments($.segments),
				$.subPaths.map($transformSegments),
				__copyAttribs($)
			);
		},

		points: tx(Points),

		points3: tx3(Points3),

		poly: tx(Polygon),

		polyline: tx(Polyline),

		quad: tx(Quad),

		quadratic: tx(Quadratic),

		rect: ($: Rect, fn) => transformVertices(asPolygon($), fn),

		tri: tx(Triangle),
	}
);
