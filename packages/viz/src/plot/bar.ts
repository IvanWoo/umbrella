// SPDX-License-Identifier: Apache-2.0
import type { Fn3 } from "@thi.ng/api";
import { map } from "@thi.ng/transducers/map";
import type { DomainValues, PlotFn } from "../api.js";
import { __resolveData, __valueMapper } from "./utils.js";

export interface BarPlotOpts {
	attribs: any;
	interleave: number;
	offset: number;
	width: number;
	shape: Fn3<number, number[], number[], any>;
}

export const barPlot =
	(data: DomainValues, opts: Partial<BarPlotOpts> = {}): PlotFn =>
	(spec) => {
		opts = {
			interleave: 1,
			offset: 0,
			width: 5,
			shape: (_, a, b) => ["line", {}, a, b],
			...opts,
		};
		const mapper = __valueMapper(spec.xaxis, spec.yaxis, spec.project);
		const offset =
			(opts.offset! + 0.5) * opts.width! -
			0.5 * opts.interleave! * opts.width!;
		const y0 = spec.yaxis.domain[0];
		return [
			"g",
			{ weight: opts.width!, ...opts.attribs },
			...map(([x, val]) => {
				const a = mapper([x, y0]);
				a[0] += offset;
				const b = mapper([x, val]);
				b[0] += offset;
				return opts.shape!(val, a, b);
			}, __resolveData(data, spec.xaxis.domain)),
		];
	};
