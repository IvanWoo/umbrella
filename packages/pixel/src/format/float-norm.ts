import { clamp, clamp01 } from "@thi.ng/math/interval";
import { Lane, type FloatFormat } from "../api.js";

/** @internal */
const __from = (x: number) => x / 127.5 - 1;

/** @internal */
const __to = (x: number, shift: number) =>
	clamp(x * 127.5 + 128, 0, 255) << shift;

export const FLOAT_NORMAL: FloatFormat = {
	__float: true,
	alpha: false,
	gray: false,
	channels: [Lane.RED, Lane.GREEN, Lane.BLUE],
	shift: { 3: 0, 2: 8, 1: 16 },
	size: 3,
	range: [-1, 1],
	getNormalized: (val) => clamp01(val * 0.5 + 0.5),
	fromABGR: (src) => [
		__from(src & 0xff),
		__from((src >> 8) & 0xff),
		__from((src >> 16) & 0xff),
	],
	toABGR: (src) =>
		__to(src[0], 0) | __to(src[1], 8) | __to(src[2], 16) | 0xff000000,
};
