// SPDX-License-Identifier: Apache-2.0
import type { Attribs, Vec2Like } from "./api.js";
import { fattribs, ff } from "./format.js";

export const line = (
	a: Vec2Like,
	b: Vec2Like,
	attribs?: Attribs,
	...body: any[]
): any[] => [
	"line",
	fattribs({
		...attribs,
		x1: ff(a[0]),
		y1: ff(a[1]),
		x2: ff(b[0]),
		y2: ff(b[1]),
	}),
	...body,
];

export const hline = (y: number, attribs?: any) =>
	line([-1e6, y], [1e6, y], attribs);

export const vline = (x: number, attribs?: any) =>
	line([x, -1e6], [x, 1e6], attribs);
