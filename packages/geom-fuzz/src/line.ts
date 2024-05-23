import type { Fn3 } from "@thi.ng/api";
import { mergeDeepObj } from "@thi.ng/associative/merge-deep";
import type { IHiccupShape2 } from "@thi.ng/geom-api";
import { resample } from "@thi.ng/geom-resample/resample";
import { line } from "@thi.ng/geom/line";
import { polyline } from "@thi.ng/geom/polyline";
import type { ReadonlyVec } from "@thi.ng/vectors";
import { jitter } from "@thi.ng/vectors/jitter";
import { DEFAULT_LINE, type FuzzyLineOpts } from "./api.js";
import { jitterPoints } from "./points.js";

export const defLine = (
	opts: Partial<FuzzyLineOpts> = {}
): Fn3<ReadonlyVec, ReadonlyVec, boolean, IHiccupShape2> => {
	opts = mergeDeepObj(DEFAULT_LINE, opts);
	return opts.resample! > 1
		? (a, b, useAttr = true) =>
				polyline(
					jitterPoints(
						resample([a, b], { num: opts.resample, last: true }),
						opts.jitter
					),
					useAttr ? opts.attribs : undefined
				)
		: (a, b, useAttr = true) =>
				line(
					jitter(null, a, opts.jitter),
					jitter(null, b, opts.jitter),
					useAttr ? opts.attribs : undefined
				);
};
