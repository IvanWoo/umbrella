// SPDX-License-Identifier: Apache-2.0
/** @internal */
export const PROC_TAGS: { [id: string]: string } = {
	"?xml": "?>\n",
	"!DOCTYPE": ">\n",
	"!ENTITY": ">\n",
	"!ELEMENT": ">\n",
	"!ATTLIST": ">\n",
};

/** @internal */
export const RE_TAG = /^([^\s.#]+)(?:#([^\s.#]+))?(?:\.([^\s#]+))?$/;

/** @internal */
export const COMMENT = "__COMMENT__";

/** @internal */
export const INLINE = "__INLINE__";

/** @internal */
export const CDATA = "!CDATA";

/** @internal */
export const DOCTYPE = "!DOCTYPE";

/**
 * XML processing instruction in hiccup format.
 *
 * @remarks
 * Translates to `<?xml version="1.0" encoding="UTF-8"?>`
 */
export const XML_PROC = ["?xml", { version: "1.0", encoding: "UTF-8" }];

/**
 * `<!DOCTYPE html>` in hiccup format
 */
export const DOCTYPE_HTML = [DOCTYPE, "html"];

/** @internal */
export const NO_SPANS: {
	[id: string]: number;
} = {
	button: 1,
	option: 1,
	script: 1,
	style: 1,
	text: 1,
	textarea: 1,
	title: 1,
};

/** @internal */
const __tagMap = (
	tags: string
): {
	[id: string]: boolean;
} => tags.split(" ").reduce((acc: any, x) => ((acc[x] = true), acc), {});

/** @internal */
// tslint:disable-next-line
export const SVG_TAGS = __tagMap(
	"animate animateColor animateMotion animateTransform circle clipPath color-profile defs desc discard ellipse feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feDistantLight feDropShadow feFlood feFuncA feFuncB feFuncG feFuncR feGaussianBlur feImage feMerge feMergeNode feMorphology feOffset fePointLight feSpecularLighting feSpotLight feTile feTurbulence filter font foreignObject g image line linearGradient marker mask metadata mpath path pattern polygon polyline radialGradient rect set stop style svg switch symbol text textPath title tref tspan use view"
);

/** @internal */
// tslint:disable-next-line
export const VOID_TAGS = __tagMap(
	"area base br col command embed hr img input keygen link meta param source stop track use wbr ?xml"
);

/** @internal */
// tslint:disable-next-line
export const NO_CLOSE_EMPTY = __tagMap(
	"animate circle ellipse line path polygon polyline rect"
);

/** @internal */
export const ATTRIB_JOIN_DELIMS: Record<string, string> = {
	class: " ",
	accept: ",",
	sizes: ",",
	srcset: ",",
};
