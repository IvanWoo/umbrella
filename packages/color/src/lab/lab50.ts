// SPDX-License-Identifier: Apache-2.0
import type { NumericArray } from "@thi.ng/api";
import type { IRandom } from "@thi.ng/random";
import type { Color, ColorFactory, ReadonlyColor, TypedColor } from "../api.js";
import { defColor } from "../defcolor.js";
import { rgbLab } from "../rgb/rgb-lab.js";
import { xyzLab } from "../xyz/xyz-lab.js";
import { xyzXyzD65_50 } from "../xyz/xyz-xyz.js";
import { labLabD65_50 } from "./lab-lab.js";
import { lchLab } from "./lab-lch.js";
import { labRgb } from "./lab-rgb.js";

export declare class LabD50 implements TypedColor<LabD50> {
	buf: NumericArray;
	offset: number;
	stride: number;
	l: number;
	a: number;
	b: number;
	alpha: number;
	[id: number]: number;
	readonly mode: "lab50";
	readonly length: 4;
	readonly range: [ReadonlyColor, ReadonlyColor];
	readonly xyz: [number, number, number];
	[Symbol.iterator](): Iterator<number, any, undefined>;
	clamp(): this;
	copy(): LabD50;
	copyView(): LabD50;
	deref(): Color;
	empty(): LabD50;
	eqDelta(o: LabD50, eps?: number): boolean;
	randomize(rnd?: IRandom): this;
	set(src: ReadonlyColor): this;
	toJSON(): number[];
}

export const labD50 = <ColorFactory<LabD50>>defColor({
	mode: "lab50",
	channels: {
		a: { range: [-0.7929, 0.9355] },
		b: { range: [-1.1203, 0.9339] },
	},
	order: <const>["l", "a", "b", "alpha"],
	from: {
		rgb: rgbLab,
		lch: lchLab,
		lab65: labLabD65_50,
		xyz50: xyzLab,
		xyz65: [xyzXyzD65_50, xyzLab],
	},
	toRgb: labRgb,
});
