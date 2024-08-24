import type { Fn, IObjectOf } from "@thi.ng/api";
import { deref, isDeref, type MaybeDeref } from "@thi.ng/api/deref";
import { implementsFunction } from "@thi.ng/checks/implements-function";
import { isArray } from "@thi.ng/checks/is-array";
import { isFunction } from "@thi.ng/checks/is-function";
import { isNotStringAndIterable } from "@thi.ng/checks/is-not-string-iterable";
import { isNumber } from "@thi.ng/checks/is-number";
import { isString } from "@thi.ng/checks/is-string";
import { assert } from "@thi.ng/errors/assert";
import { unsupported } from "@thi.ng/errors/unsupported";
import {
	ATTRIB_JOIN_DELIMS,
	NO_SPANS,
	RE_TAG,
	SVG_TAGS,
} from "@thi.ng/hiccup/api";
import { mergeClasses, mergeEmmetAttribs } from "@thi.ng/hiccup/attribs";
import { formatPrefixes } from "@thi.ng/hiccup/prefix";
import { XML_SVG, XML_XLINK, XML_XMLNS } from "@thi.ng/prefixes/xml";
import type { NumOrElement } from "./api.js";
import { isComment, isComponent } from "./checks.js";

/**
 * hdom-style DOM tree creation from hiccup format. Returns DOM element of
 * `tree` root. See {@link $el} for further details.
 *
 * @remarks
 * Supports elements given in these forms:
 *
 * - {@link IComponent} instance
 * - [`IDeref`](https://docs.thi.ng/umbrella/api/interfaces/IDeref.html)
 *   instance (must resolve to another supported type in this list)
 * - `["div#id.class", {...attribs}, ...children]`
 * - `[COMMENT, "foo", "bar"...]` (DOM comment node)
 * - `[IComponent, ...mountargs]`
 * - `[function, ...args]`
 * - `["tag", {...attribs}, noArgFunction, "other"]`
 * - ES6 iterable of the above (for child values only!)
 *
 * Any other values will be cast to strings and added as spans to current
 * `parent`.
 *
 * Note: `COMMENT` is defined as constant in thi.ng/hiccup package. Also see
 * {@link $comment} function to create comments directly.
 *
 * @param tree -
 * @param parent -
 * @param idx -
 */
export const $tree = async (
	tree: any,
	parent: ParentNode,
	idx: NumOrElement = -1
): Promise<any> =>
	isArray(tree)
		? isComment(tree)
			? $comment(tree.slice(1), parent, idx)
			: $treeElem(tree, parent, idx)
		: isComponent(tree)
		? tree.mount(parent, idx)
		: isDeref(tree)
		? $tree(tree.deref(), parent)
		: isFunction(tree)
		? $tree(tree(), parent, idx)
		: isNotStringAndIterable(tree)
		? $treeIter(tree, parent)
		: tree != null
		? $el("span", null, tree, <HTMLElement>parent, idx)
		: null;

const $treeElem = (tree: any, parent: ParentNode, idx: NumOrElement) => {
	const tag = tree[0];
	// [tag, attribs, ...body]
	return isString(tag)
		? $treeTag(tree, parent, idx)
		: // [icomponent, ...args]
		isComponent(tag)
		? tag.mount(parent, idx, ...tree.slice(1))
		: // [fn, ...args]
		isFunction(tag)
		? $tree(tag.apply(null, tree.slice(1)), parent)
		: // unsupported
		  unsupported(`tag: ${tag}`);
};

const $treeTag = (tree: any, parent: ParentNode, idx: NumOrElement) => {
	const n = tree.length;
	const { 0: tag, 1: attribs, 2: body } = tree;
	if (n === 3 && (isString(body) || isNumber(body))) {
		// emmet-free base tag
		const tmp = /^\w+/.exec(tag);
		if (tmp && NO_SPANS[tmp[0]]) {
			// don't wrap single body in <span> here
			parent = $el(tag, attribs, body, parent, idx);
			return parent;
		}
	}
	parent = $el(tag, attribs, null, parent, idx);
	for (let i = 2; i < n; i++) {
		$tree(tree[i], parent);
	}
	return parent;
};

const $treeIter = (tree: any, parent: ParentNode) => {
	for (let t of tree) {
		$tree(t, parent);
	}
	return null;
};

/**
 * Create a single DOM element and optionally attaches it to `parent`.
 *
 * @remarks
 * If `tag` is a namespaced tagname (e.g. `prefix:tag`), the element will be
 * created via `document.createElementNS()` and the prefix will be resolved via
 * known aliases registered by {@link registerPrefix}. SVG element names do not
 * need to be prefixed and are recognized automatically.
 *
 * Supports Emmet-style tag names in this form: `tag#id.class1.class2`.
 * `attribs` is a plain object of element attributes. See {@link $attribs} for
 * further details.
 *
 * If `parent` is given, but no `idx` arg, the new element will be appended as
 * child.
 *
 * @param tag -
 * @param attribs -
 * @param body -
 * @param parent -
 * @param idx -
 */
export const $el = (
	tag: string,
	attribs: any,
	body?: any,
	parent?: ParentNode,
	idx: NumOrElement = -1
) => {
	const match = RE_TAG.exec(tag);
	if (match) {
		attribs = mergeEmmetAttribs({ ...attribs }, match[2], match[3]);
		tag = match[1];
	}
	let el: Element;
	const qidx = tag.indexOf(":");
	if (qidx < 0) {
		el = SVG_TAGS[tag]
			? document.createElementNS(XML_SVG, tag)
			: document.createElement(tag);
	} else {
		el = document.createElementNS(PREFIXES[tag.substring(0, qidx)], tag);
	}
	attribs && $attribs(el, attribs);
	body != null && $text(<any>el, body);
	parent && $addChild(parent, el, idx);
	return el;
};

/**
 * Similar to {@link $el}, but creates a new comment DOM node using provided
 * body. If `parent` is given, the comment will be attached or inserted as child
 * at `idx`. Returns comment node.
 *
 * @remarks
 * See thi.ng/hiccup docs for reference:
 * - https://docs.thi.ng/umbrella/hiccup/functions/serialize.html
 *
 * @param body
 * @param parent
 * @param idx
 */
export const $comment = (
	body: string | string[],
	parent?: ParentNode,
	idx: NumOrElement = -1
) => {
	const comment = document.createComment(
		isString(body)
			? body
			: body.length < 2
			? body[0] || ""
			: ["", ...body, ""].join("\n")
	);
	parent && $addChild(parent, comment, idx);
	return comment;
};

/**
 * Appends or inserts `child` as child element of `parent`. The default `idx` of
 * -1 means the child will be appended, else uses `parent.insertBefore()` to
 * insert at given index.
 *
 * @param parent
 * @param child
 * @param idx
 */
export const $addChild = (
	parent: ParentNode,
	child: Node | Comment,
	idx: NumOrElement = -1
) => {
	isNumber(idx)
		? idx < 0 || idx >= parent.children.length
			? parent.appendChild(child)
			: parent.insertBefore(child, parent.children[idx])
		: parent.insertBefore(child, idx);
};

/**
 * Removes given element or comment from the DOM.
 *
 * @param el
 */
export const $remove = (el: Element | Comment) => el && el.remove();

/**
 * Migrates given element to `newParent`, following the same append or insertion
 * logic as {@link $addChild}.
 *
 * @param newParent
 * @param el
 * @param idx
 */
export const $moveTo = (
	newParent: ParentNode,
	el: Element | Comment,
	idx: NumOrElement = -1
) => {
	$remove(el);
	$addChild(newParent, el, idx);
};

/**
 * Removes all content from given element.
 *
 * @param el
 */
export const $clear = (el: Element) => ((el.innerHTML = ""), el);

/**
 * Same as `el.textContent = body`, however if `body` is an
 * [`IDeref`](https://docs.thi.ng/umbrella/api/interfaces/IDeref.html) it'll be
 * first automatically deref'd and coerced to a string. If `body === undefined`
 * an empty string will be used.
 *
 * @param el -
 * @param body -
 */
export const $text = (el: HTMLElement | SVGElement, body: any) => {
	body = deref(body);
	el.textContent = body !== undefined ? String(body) : "";
};

/**
 * Same as `el.innerHtml = body`, use with caution! If `body` is an
 * [`IDeref`](https://docs.thi.ng/umbrella/api/interfaces/IDeref.html) it'll be
 * automatically deref'd.
 *
 * @param el -
 * @param body -
 */
export const $html = (
	el: HTMLElement | SVGElement,
	body: MaybeDeref<string>
) => {
	el.innerHTML = String(deref(body));
};

/**
 * Takes an object of attributes and applies them to given DOM element.
 *
 * @remarks
 * The following rules & transformations are applied (in the stated order):
 *
 * - [`IDeref`](https://docs.thi.ng/umbrella/api/interfaces/IDeref.html) values
 *   are `deref`d
 * - attributes prefixed with `on` are considered event listeners and can either
 *   have a function value or tuple of `[listener, opts]`, where `opts` are the
 *   standard `.addEventListener()` options
 * - function values for any other attribs are first called with the entire
 *   `attribs` object and return value used
 * - array values are converted into space-delimited string
 *
 * CSS classes can be given as `class` attribute, with its value either a
 * string, a string array or an object of booleans. If the latter, the given
 * class names are either added to or removed from the current list of classes.
 * See
 * [`mergeClasses()`](https://docs.thi.ng/umbrella/hiccup/functions/mergeClasses.html)
 * for details.
 *
 * CSS style rules can be defined via the `style` attrib. Please {@link $style}
 *  for further details.
 *
 * Data attributes are to be given as object under the `data` attribute name,
 * with its values being merged with the element's current `dataset` property.
 *
 * Depending on element type the `value` attribute will be updated keeping the
 * current cursor position / selection intact.
 *
 * @param el -
 * @param attribs -
 */
export const $attribs = (el: Element, attribs: any) => {
	for (let id in attribs) {
		__setAttrib(el, id, attribs[id], attribs);
	}
	return el;
};

/** @internal */
const __setterCache: Record<string, Fn<any, void> | false> = {};

/** @internal */
const __getProto = Object.getPrototypeOf;
/** @internal */
const __getDesc = Object.getOwnPropertyDescriptor;

/**
 * Recursively attempts to find property descriptor in prototype chain.
 *
 * @param proto
 * @param prop
 *
 * @internal
 */
const __desc = (proto: any, prop: string): any =>
	proto
		? __getDesc(proto, prop) ?? __desc(__getProto(proto), prop)
		: undefined;

/**
 * Attempts to find a setter for given `el` and `prop` name in the setter cache
 * or scans element's prototype chain using {@link __desc} and then caches it
 * (if found).
 *
 * @remarks
 * The cache only stores unbound setters (or null). Returned setters must be
 * bound to the actual `el` or called via `setter.call(el, value)`.
 *
 * @param el
 * @param prop
 *
 * @internal
 */
const __setter = (el: Element, prop: string) => {
	const key = `${el.namespaceURI}/${el.tagName}#${prop}`;
	return (
		__setterCache[key] ??
		(__setterCache[key] = __desc(__getProto(el), prop)?.set ?? false)
	);
};

/** @internal */
const __setAttrib = (el: Element, id: string, val: any, attribs: any) => {
	implementsFunction(val, "deref") && (val = val.deref());
	if (id.startsWith("on")) {
		if (isString(val)) {
			el.setAttribute(id, val);
		} else {
			id = id.substring(2);
			isArray(val)
				? el.addEventListener(id, val[0], val[1])
				: el.addEventListener(id, val);
		}
		return;
	}
	isFunction(val) && (val = val(attribs));
	isArray(val) && (val = val.join(ATTRIB_JOIN_DELIMS[id] || " "));
	switch (id) {
		case "class":
			el.setAttribute(
				"class",
				isString(val) ? val : mergeClasses(el.className, val)
			);
			break;
		case "style":
			$style(el, val);
			break;
		case "value":
			__updateValueAttrib(<HTMLInputElement>el, val);
			break;
		case "data":
			__updateDataAttribs(<HTMLElement>el, val);
			break;
		case "prefix":
			el.setAttribute(id, isString(val) ? val : formatPrefixes(val));
			break;
		default: {
			const setter = __setter(el, id);
			if (setter && val != null) {
				return setter.call(el, val);
			}
			const idx = id.indexOf(":");
			if (idx < 0) {
				val === false || val == null
					? el.removeAttribute(id)
					: el.setAttribute(id, val === true ? id : val);
			} else {
				const ns = PREFIXES[id.substring(0, idx)];
				val === false || val == null
					? el.removeAttributeNS(ns, id)
					: el.setAttributeNS(ns, id, val);
			}
		}
	}
};

/** @internal */
const __updateValueAttrib = (el: HTMLInputElement, value: any) => {
	let ev;
	switch (el.type) {
		case "text":
		case "textarea":
		case "password":
		case "search":
		case "number":
		case "url":
		case "tel":
			if ((ev = el.value) !== undefined && isString(value)) {
				const off =
					value.length - (ev.length - (el.selectionStart || 0));
				el.value = value;
				el.selectionStart = el.selectionEnd = off;
				break;
			}
		default:
			el.value = value;
	}
};

/** @internal */
const __updateDataAttribs = (el: HTMLOrSVGElement, attribs: any) => {
	const data = el.dataset;
	for (let id in attribs) {
		const v = deref(attribs[id]);
		data[id] = isFunction(v) ? v(attribs) : v;
	}
};

/**
 * Takes an object (or string) of CSS properties, compiles them into a single
 * CSS string and sets it as `style` attribute on the given element.
 *
 * @remarks
 * All property values can be
 * [`IDeref`](https://docs.thi.ng/umbrella/api/interfaces/IDeref.html) values,
 * in which case they're are first `deref`d before use. If the value is a
 * function, it will be called with the entire `rules` object as arg and the
 * return value used.
 *
 * @param el -
 * @param rules -
 */
export const $style = (el: Element, rules: string | any) => {
	if (isString(rules)) {
		el.setAttribute("style", rules);
	} else {
		const style = (<HTMLElement>el).style;
		for (let id in rules) {
			let v = deref(rules[id]);
			isFunction(v) && (v = v(rules));
			style.setProperty(id, v != null ? v : "");
		}
	}
};

/**
 * Adds or removes the given CSS classes from a DOM element. If a class is
 * currently present it will be removed, otherwise added.
 *
 * @param el
 * @param classes
 */
export const $toggleClasses = (el: Element, ...classes: string[]) => {
	const list = el.classList;
	for (let c of classes) {
		list.contains(c) ? list.remove(c) : list.add(c);
	}
};

/**
 * @internal
 */
const PREFIXES: IObjectOf<string> = {
	svg: XML_SVG,
	xlink: XML_XLINK,
	xmlns: XML_XMLNS,
};

/**
 * Registers an XML namespace prefix and its URL for later use, e.g. to define
 * namespaced elements/attributes via {@link $el}, {@link $tree}.
 *
 * @param prefix -
 * @param url -
 */
export const registerPrefix = (prefix: string, url: string) => {
	assert(
		!PREFIXES[prefix],
		`${prefix} already registered: ${PREFIXES[prefix]}`
	);
	PREFIXES[prefix] = url;
};
