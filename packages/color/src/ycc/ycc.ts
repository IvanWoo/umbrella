// SPDX-License-Identifier: Apache-2.0
import type { NumericArray } from "@thi.ng/api";
import type { IRandom } from "@thi.ng/random";
import type { Color, ColorFactory, ReadonlyColor, TypedColor } from "../api.js";
import { defColor } from "../defcolor.js";
import { rgbYcc } from "../rgb/rgb-ycc.js";
import { yccRgb } from "./ycc-rgb.js";

export declare class YCC implements TypedColor<YCC> {
	buf: NumericArray;
	offset: number;
	stride: number;
	y: number;
	cb: number;
	cr: number;
	alpha: number;
	[id: number]: number;
	readonly mode: "ycc";
	readonly length: 4;
	readonly range: [ReadonlyColor, ReadonlyColor];
	readonly xyz: [number, number, number];
	[Symbol.iterator](): Iterator<number, any, undefined>;
	clamp(): this;
	copy(): YCC;
	copyView(): YCC;
	deref(): Color;
	empty(): YCC;
	eqDelta(o: YCC, eps?: number): boolean;
	randomize(rnd?: IRandom): this;
	set(src: ReadonlyColor): this;
	toJSON(): number[];
}

export const ycc = <ColorFactory<YCC>>defColor({
	mode: "ycc",
	channels: {
		cb: { range: [-0.5, 0.5] },
		cr: { range: [-0.5, 0.5] },
	},
	order: <const>["y", "cb", "cr", "alpha"],
	from: { rgb: rgbYcc },
	toRgb: yccRgb,
});
