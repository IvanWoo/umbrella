import { isNumber } from "@thi.ng/checks/is-number";
import type { Attribs, PathSegment } from "@thi.ng/geom-api";
import { map } from "@thi.ng/transducers/map";
import { mapcat } from "@thi.ng/transducers/mapcat";
import type { Vec } from "@thi.ng/vectors";
import { maddN2 } from "@thi.ng/vectors/maddn";
import type { Cubic } from "./api/cubic.js";
import { Path } from "./api/path.js";
import { asCubic } from "./as-cubic.js";
import { PathBuilder } from "./path-builder.js";

export const path = (
	segments: Iterable<PathSegment>,
	subPaths: Iterable<PathSegment[]> = [],
	attribs?: Attribs
) => new Path(segments, subPaths, attribs);

export const pathFromCubics = (cubics: Cubic[], attribs?: Attribs) => {
	const path = new Path([], [], attribs || cubics[0].attribs);
	path.segments.push({ type: "m", point: cubics[0].points[0] });
	for (let c of cubics) {
		path.segments.push({ type: "c", geo: c });
	}
	return path;
};

export const normalizedPath = (path: Path) => {
	const $normalize = (segments: PathSegment[]) => [
		...mapcat(
			(s) =>
				s.geo
					? map<Cubic, PathSegment>(
							(c) => ({ type: "c", geo: c }),
							asCubic(s.geo)
					  )
					: [{ ...s }],
			segments
		),
	];
	return new Path(
		$normalize(path.segments),
		path.subPaths.map($normalize),
		path.attribs
	);
};

export const roundedRect = (
	pos: Vec,
	size: Vec,
	r: number | Vec,
	attribs?: Attribs
) => {
	r = isNumber(r) ? [r, r] : r;
	const [w, h] = maddN2([], r, -2, size);
	return new PathBuilder(attribs)
		.moveTo([pos[0] + r[0], pos[1]])
		.hlineTo(w, true)
		.arcTo(r, r, 0, false, true, true)
		.vlineTo(h, true)
		.arcTo([-r[0], r[1]], r, 0, false, true, true)
		.hlineTo(-w, true)
		.arcTo([-r[0], -r[1]], r, 0, false, true, true)
		.vlineTo(-h, true)
		.arcTo([r[0], -r[1]], r, 0, false, true, true)
		.current();
};
