import type { Attribs, Vec2Like } from "./api.js";
import { fattribs, ff } from "./format.js";

export const image = (
	pos: Vec2Like,
	url: string,
	attribs?: Attribs,
	...body: any[]
): any[] => [
	"image",
	fattribs({
		...attribs,
		// TODO replace w/ SVG2 `href` once Safari supports it
		"xlink:href": url,
		x: ff(pos[0]),
		y: ff(pos[1]),
	}),
	...body,
];
