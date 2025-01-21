// SPDX-License-Identifier: Apache-2.0
import { clipLinePoly } from "@thi.ng/geom-clip-line/clip-poly";
import { bounds } from "@thi.ng/geom/bounds";
import { group } from "@thi.ng/geom/group";
import { offset } from "@thi.ng/geom/offset";
import { unmapPoint } from "@thi.ng/geom/unmap-point";
import { columnEnds2d } from "@thi.ng/grid-iterators/column-ends";
import { diagonalEnds2d } from "@thi.ng/grid-iterators/diagonal-ends";
import { rowEnds2d } from "@thi.ng/grid-iterators/row-ends";
import { flipX, flipXY, flipY, ident } from "@thi.ng/grid-iterators/transforms";
import { mergeDeepObj } from "@thi.ng/object-utils/merge-deep";
import { partition } from "@thi.ng/transducers/partition";
import { div2 } from "@thi.ng/vectors/div";
import { DEFAULT_LINE, type FillFn, type HatchOpts } from "./api.js";
import { defLine } from "./line.js";

const HATCH_DIRS = {
	d: diagonalEnds2d,
	h: rowEnds2d,
	v: columnEnds2d,
};

export const defHatch = (opts: Partial<HatchOpts> = {}): FillFn => {
	opts = mergeDeepObj(
		{
			dir: "d",
			space: 5,
			line: DEFAULT_LINE,
		},
		opts
	);
	const line = defLine(opts.line);
	return (shape) => {
		const box = offset(bounds(shape)!, 1);
		const [w, h] = box.size;
		const cols = ~~(w / opts.space!);
		const rows = ~~(h / opts.space!);
		const maxg = [cols - 1, rows - 1];
		const acc = group(opts.line ? opts.line.attribs : null);
		const grid = HATCH_DIRS[opts.dir!]({
			cols,
			rows,
			tx:
				opts.tx ||
				(opts.flip
					? { x: flipX, y: flipY, xy: flipXY }[opts.flip]
					: ident),
		});
		for (let [a, b] of partition(2, grid)) {
			unmapPoint(box, div2(null, a, maxg), a);
			unmapPoint(box, div2(null, b, maxg), b);
			const segments = clipLinePoly(a, b, shape.points);
			if (segments) {
				for (let s of segments) {
					acc.children.push(line(s[0], s[1], false));
				}
			}
		}
		return acc;
	};
};
