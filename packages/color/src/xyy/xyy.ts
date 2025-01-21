// SPDX-License-Identifier: Apache-2.0
import type { NumericArray } from "@thi.ng/api";
import type { IRandom } from "@thi.ng/random";
import type { Color, ColorFactory, ReadonlyColor, TypedColor } from "../api.js";
import { defColor } from "../defcolor.js";
import { rgbXyzD65 } from "../rgb/rgb-xyz.js";
import { xyzRgbD65 } from "../xyz/xyz-rgb.js";
import { xyzXyy } from "../xyz/xyz-xyy.js";
import { xyyXyz } from "./xyy-xyz.js";

export declare class XYY implements TypedColor<XYY> {
	buf: NumericArray;
	offset: number;
	stride: number;
	x: number;
	y: number;
	Y: number;
	alpha: number;
	[id: number]: number;
	readonly mode: "xyy";
	readonly length: 4;
	readonly range: [ReadonlyColor, ReadonlyColor];
	readonly xyz: [number, number, number];
	[Symbol.iterator](): Iterator<number, any, undefined>;
	clamp(): this;
	copy(): XYY;
	copyView(): XYY;
	deref(): Color;
	empty(): XYY;
	eqDelta(o: XYY, eps?: number): boolean;
	randomize(rnd?: IRandom): this;
	set(src: ReadonlyColor): this;
	toJSON(): number[];
}

export const xyy = <ColorFactory<XYY>>defColor({
	mode: "xyy",
	channels: {
		x: { range: [0, 0.6484] },
		y: { range: [0, 0.5979] },
	},
	order: <const>["x", "y", "Y", "alpha"],
	from: {
		rgb: (out, src) => xyzXyy(null, rgbXyzD65(out, src)),
		xyz50: xyzXyy,
		xyz65: xyzXyy,
	},
	toRgb: [xyyXyz, xyzRgbD65],
});
