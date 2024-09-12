import type { Attribs, Vec2Like } from "./api.js";
import { fattribs, ff } from "./format.js";

export const ellipse = (
	p: Vec2Like,
	rx: number,
	ry: number,
	attribs?: Attribs,
	...body: any[]
): any[] => [
	"ellipse",
	fattribs({
		...attribs,
		cx: ff(p[0]),
		cy: ff(p[1]),
		rx: ff(rx),
		ry: ff(ry),
	}),
	...body,
];
