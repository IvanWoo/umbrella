// SPDX-License-Identifier: Apache-2.0
import { isString } from "@thi.ng/checks";
import { parse, Type, type ParseElement, type ParseEvent } from "@thi.ng/sax";
import {
	assocObj,
	comp,
	filter,
	last,
	map,
	pairs,
	push,
	transduce,
} from "@thi.ng/transducers";
import { DEFAULT_FORMAT, format, type FormatOpts } from "./format.js";

export interface ConversionOpts {
	format: FormatOpts;
	removeTags: Set<string>;
	removeAttribs: Set<string>;
}

export const DEFAULT_OPTS: ConversionOpts = {
	format: DEFAULT_FORMAT,
	removeAttribs: new Set(),
	removeTags: new Set(),
};

// converts given XMLish string into formatted hiccup
export const convertXML = (src: string, opts: Partial<ConversionOpts> = {}) => {
	let tree = transformTree(parseXML(src), <ConversionOpts>{
		...DEFAULT_OPTS,
		...opts,
	});
	return format({ ...DEFAULT_FORMAT, ...opts.format }, "", tree);
};

// parses given XMLish string using @thi.ng/sax transducer into a
// sequence of parse events. we only care about the final (or error)
// event, which will be related to the final close tag and contains the
// entire tree
const parseXML = (src: string) =>
	transduce<string, ParseEvent, ParseEvent>(
		comp(
			parse({ trim: true, boolean: true, entities: true }),
			filter((e) => e.type === Type.ELEM_END || e.type === Type.ERROR)
		),
		last(),
		src
	);

// transforms string of CSS properties into a plain object
const transformCSS = (css: string) =>
	css.split(";").reduce((acc: any, p) => {
		const [k, v] = p.split(":");
		v != null && (acc[k.trim()] = parseAttrib([k, v.trim()])[1]);
		return acc;
	}, {});

// takes attrib key-value pair and attempts to coerce / transform its
// value. returns updated pair.
const parseAttrib = (attrib: string[]) => {
	let [k, v] = attrib;
	if (isString(v)) {
		v = v.replace(/[\n\r]+\s*/g, " ");
		return k === "style"
			? [k, transformCSS(v)]
			: v === "true"
			? [k, true]
			: v === "false"
			? [k, false]
			: [k, /^[0-9.e+-]+$/.test(v) ? parseFloat(v) : v];
	}
	return attrib;
};

// transforms an entire object of attributes
const transformAttribs = (attribs: any, remove: Set<string> = new Set()) =>
	transduce<any, any, any>(
		comp(
			filter((a) => !remove.has(a[0])),
			map(parseAttrib)
		),
		assocObj(),
		{},
		pairs<string>(attribs)
	);

// transforms element name by attempting to form Emmet-like tags
const transformTag = (tag: string, attribs: any) => {
	if (attribs.id) {
		tag += "#" + attribs.id;
		delete attribs.id;
	}
	if (isString(attribs.class)) {
		const classes = attribs.class.replace(/\s+/g, ".");
		classes.length && (tag += "." + classes);
		delete attribs.class;
	}
	return tag;
};

// recursively transforms entire parse tree
const transformTree = (
	tree: ParseEvent | ParseElement,
	opts: ConversionOpts
) => {
	if (tree == null) {
		return "";
	}
	if ((<ParseEvent>tree).type === Type.ERROR) {
		return ["error", tree.body];
	}
	if (opts.removeTags.has(tree.tag!)) {
		return;
	}
	const attribs = transformAttribs(tree.attribs, opts.removeAttribs);
	const res: any[] = [transformTag(tree.tag!, attribs)];
	if (Object.keys(attribs).length) {
		res.push(attribs);
	}
	if (tree.body) {
		res.push(tree.body);
	}
	if (tree.children?.length) {
		transduce<any, any, any>(
			comp(
				map((t: any) => transformTree(t, opts)),
				filter((t) => !!t)
			),
			push(),
			res,
			tree.children
		);
	}
	return res;
};
