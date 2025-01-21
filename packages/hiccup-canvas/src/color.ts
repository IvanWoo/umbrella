// SPDX-License-Identifier: Apache-2.0
import { isString } from "@thi.ng/checks/is-string";
import { css } from "@thi.ng/color/css/css";
import type { DrawState } from "./api.js";

export const resolveColor = css;

export const resolveGradientOrColor = (state: DrawState, v: any) =>
	isString(v)
		? v[0] === "$"
			? state.grads![v.substring(1)]
			: v
		: resolveColor(v);

export const defLinearGradient = (
	ctx: CanvasRenderingContext2D,
	{ from, to }: any,
	stops: any[][]
) => {
	const g = ctx.createLinearGradient(from[0], from[1], to[0], to[1]);
	for (let s of stops) {
		g.addColorStop(s[0], resolveColor(s[1]));
	}
	return g;
};

export const defRadialGradient = (
	ctx: CanvasRenderingContext2D,
	{ from, to, r1, r2 }: any,
	stops: any[][]
) => {
	const g = ctx.createRadialGradient(from[0], from[1], r1, to[0], to[1], r2);
	for (let s of stops) {
		g.addColorStop(s[0], resolveColor(s[1]));
	}
	return g;
};
