import type { BigType, Keys, Nullable } from "@thi.ng/api";
import { isArray } from "@thi.ng/checks/is-array";
import { isPlainObject } from "@thi.ng/checks/is-plain-object";
import { isString } from "@thi.ng/checks/is-string";
import { split } from "@thi.ng/strings/split";
import { wordWrapLine, wordWrapLines } from "@thi.ng/strings/word-wrap";
import type {
	CodeGenOpts,
	Field,
	InjectedBody,
	Struct,
	TopLevelType,
	TypeColl,
	Union,
	WasmPrim,
	WasmPrim32,
} from "../api.js";

/**
 * Returns true iff `x` is a {@link WasmPrim32}.
 *
 * @param x
 */
export const isNumeric = (x: string): x is WasmPrim32 =>
	/^(([iu](8|16|32))|(f(32|64)))$/.test(x);

/**
 * Returns true iff `x` is a `i64` or `u64`.
 *
 * @param x
 */
export const isBigNumeric = (x: string): x is BigType => /^[iu]64$/.test(x);

export const isSizeT = (x: string): x is "isize" | "usize" =>
	/^[iu]size$/.test(x);

/**
 * Returns true iff `x` is a {@link WasmPrim}.
 *
 * @param x
 */
export const isWasmPrim = (x: string): x is WasmPrim =>
	isNumeric(x) || isBigNumeric(x);

export const isWasmString = (x: string): x is "string" => x === "string";

export const isPadding = (f: Pick<Field, "pad">) => f.pad != null && f.pad > 0;

export const isPointer = (x: Field["tag"]): x is "ptr" => x === "ptr";

export const isFuncPointer = (type: string, coll: TypeColl) =>
	coll[type]?.type === "funcptr";

export const isEnum = (type: string, coll: TypeColl) =>
	coll[type]?.type === "enum";

export const isExternal = (type: string, coll: TypeColl) =>
	coll[type]?.type === "ext";

export const isSlice = (x: Field["tag"]): x is "slice" => x === "slice";

export const isOpaque = (x: string): x is "opaque" => x === "opaque";

/**
 * Returns true iff the struct field is a pointer, slice or "string" type
 *
 * @param f
 */
export const isPointerLike = (f: Field, coll: TypeColl) =>
	isPointer(f.tag) ||
	isSlice(f.tag) ||
	isWasmString(f.type) ||
	isOpaque(f.type) ||
	isFuncPointer(f.type, coll);

/**
 * Returns true if `type` is "slice".
 *
 * @param type
 */
export const isStringSlice = (
	type: CodeGenOpts["stringType"]
): type is "slice" => type === "slice";

export const isStruct = (x: TopLevelType): x is Struct => x.type === "struct";

export const isUnion = (x: TopLevelType): x is Union => x.type === "union";

/**
 * Returns true if `x` is a struct or union and contains string fields.
 *
 * @param x
 */
export const hasStringFields = (x: TopLevelType) => {
	if (!isStruct(x) || isUnion(x)) return false;
	return x.fields.some((f) => f.type === "string");
};

/**
 * Returns true if the given type collection contains structs or unions with
 * string fields.
 *
 * @param coll
 */
export const usesStrings = (coll: TypeColl) =>
	Object.values(coll).some(hasStringFields);

/**
 * Returns filtered array of struct fields of with "ptr" tag or function
 * pointers.
 *
 * @param fields
 *
 * @internal
 */
export const pointerFields = (fields: Field[]) =>
	fields.filter((f) => isPointer(f.tag));

/**
 * Returns filtered array of struct fields of only "string" fields.
 *
 * @param fields
 *
 * @internal
 */
export const stringFields = (fields: Field[]) =>
	fields.filter((f) => isWasmString(f.type) && f.tag !== "ptr");

export const sliceTypes = (coll: TypeColl) =>
	new Set(
		Object.values(coll)
			.flatMap((x) => (isStruct(x) || isUnion(x) ? x.fields : []))
			.map((x) => (x.tag === "slice" ? x.type : null))
			.filter((x) => !!x)
	);

/**
 * Returns enum identifier formatted according to given opts.
 *
 * @param opts
 * @param name
 *
 * @internal
 */
export const enumName = (opts: CodeGenOpts, name: string) =>
	opts.uppercaseEnums ? name.toUpperCase() : name;

/**
 * Returns given field's default value (or undefined). The `lang` ID is required
 * to obtain the language specific value if the default is given as object.
 *
 * @param f
 * @param lang
 */
export const defaultValue = (f: Field, lang: string) =>
	f.default !== undefined
		? isPlainObject(f.default)
			? f.default[lang]
			: f.default
		: undefined;

/**
 * Takes an array of strings or splits given string into lines, word wraps and
 * then prefixes each line with given `width` and `prefix`. Returns array of new
 * lines.
 *
 * @param prefix
 * @param str
 * @param width
 */
export const prefixLines = (
	prefix: string,
	str: string | string[],
	width: number
) =>
	(isString(str)
		? wordWrapLines(str, { width: width - prefix.length })
		: str.flatMap((x) => wordWrapLine(x, { width: width - prefix.length }))
	).map((line) => prefix + line);

export const ensureLines = (
	src: string | string[] | InjectedBody,
	key?: keyof InjectedBody
): Iterable<string> =>
	isString(src)
		? split(src)
		: isArray(src)
		? src
		: key
		? src[key]
			? ensureLines(src[key]!, key)
			: []
		: [];

export const ensureStringArray = (src: string | string[]) =>
	isString(src) ? [src] : src;

/**
 * Yields iterator of given lines, each with applied indentation based on given
 * scope regexp's which are applied to each line to increase or decrease
 * indentation level (the initial indentation level can be specified via
 * optional `level` arg, default 0). If `scopeStart` succeeds, the indent is
 * increased for the _next_ line. If `scopeEnd` succeeds the level is decreased
 * for the _current_ line. ...
 *
 * @param lines
 * @param indent
 * @param scopeStart
 * @param scopeEnd
 * @param level
 */
export function* withIndentation(
	lines: string[],
	indent: string,
	scopeStart: RegExp,
	scopeEnd: RegExp,
	level = 0
) {
	const stack: string[] = new Array(level).fill(indent);
	for (let l of lines) {
		scopeEnd.test(l) && stack.pop();
		const curr = stack.length ? stack[stack.length - 1] : "";
		yield curr + l;
		scopeStart.test(l) && stack.push(curr + indent);
	}
}

export const injectBody = (
	acc: string[],
	body: Nullable<string | string[] | InjectedBody>,
	key: Keys<InjectedBody> = "impl"
) => body && acc.push("", ...ensureLines(body, key), "");
