// SPDX-License-Identifier: Apache-2.0
import type { Fn2, Fn4, NumOrString } from "@thi.ng/api";
import { map } from "@thi.ng/transducers/map";
import type { DomainValues, PlotFn } from "../api.js";
import { __resolveData, __valueMapper } from "./utils.js";

export type Candle = { o: number; h: number; l: number; c: number };

export type MappedCandle = Record<keyof Candle, number[]>;

export type CandleShapeFn = Fn4<Candle, MappedCandle, number, boolean, any>;

export interface CandlePlotOpts {
	shape: CandleShapeFn;
}

export interface CandleShapeOpts {
	up: Fn2<number, Candle, any>;
	down: Fn2<number, Candle, any>;
	title: Fn2<number, Candle, NumOrString>;
	width: number;
}

export const candlePlot =
	(
		data: DomainValues<Candle>,
		opts: CandlePlotOpts = { shape: candle() }
	): PlotFn =>
	(spec) => {
		const mapper = __valueMapper(spec.xaxis, spec.yaxis, spec.project);
		return [
			"g",
			{},
			...map(([x, candle]) => {
				const { o, h, l, c } = candle;
				return opts.shape(
					candle,
					{
						o: mapper([x, o]),
						h: mapper([x, h]),
						l: mapper([x, l]),
						c: mapper([x, c]),
					},
					x,
					c >= o
				);
			}, __resolveData(data, spec.xaxis.domain)),
		];
	};

export const candle = (opts: Partial<CandleShapeOpts> = {}) => {
	const {
		up = () => ({ stroke: [1, 0, 0], fill: [1, 0, 0] }),
		down = () => ({ stroke: [0, 0.8, 0], fill: [0, 0.8, 0] }),
		width = 5,
		title,
	} = opts;
	const w = width / 2;
	return (raw: Candle, candle: MappedCandle, x: number, isUp: boolean) => {
		const { o, h, l, c } = candle;
		return [
			"g",
			isUp ? up(x, raw) : down(x, raw),
			title ? ["title", {}, title(x, raw)] : null,
			["line", {}, l, h],
			[
				"polygon",
				{},
				[
					[o[0] - w, o[1]],
					[c[0] - w, c[1]],
					[c[0] + w, c[1]],
					[o[0] + w, o[1]],
				],
			],
		];
	};
};
