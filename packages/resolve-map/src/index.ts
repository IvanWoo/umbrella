// SPDX-License-Identifier: Apache-2.0
import type { Fn, IDeref, IObjectOf, NumOrString } from "@thi.ng/api";
import { SEMAPHORE } from "@thi.ng/api/api";
import { isArray } from "@thi.ng/checks/is-array";
import { isFunction } from "@thi.ng/checks/is-function";
import { isPlainObject } from "@thi.ng/checks/is-plain-object";
import { isString } from "@thi.ng/checks/is-string";
import { illegalArgs } from "@thi.ng/errors/illegal-arguments";
import { mutInUnsafe } from "@thi.ng/paths/mut-in";
import { exists } from "@thi.ng/paths/path";

const RE_ARGS = /^(function\s+\w+)?\s*\(\{([\w\s,:]+)\}/;

export type Unresolved<T> = {
	[K in keyof T]:
		| Unresolved<T[K]>
		| Resolved<T[K]>
		| Fn<T, T[K]>
		| Fn<ResolveFn, T[K]>
		| Function
		| string;
};

export type ResolveFn = (path: string) => any;

export type LookupPath = NumOrString[];

export interface ResolveOpts {
	/**
	 * Prefix for auto-recognizing & interpreting embedded string values as
	 * lookup paths (only if {@link ResolveOpts.onlyFnRefs} is false, default)
	 *
	 * @defaultValue `@`
	 */
	prefix: string;
	/**
	 * If true (default), all known values wrapped using {@link resolved} will
	 * be unwrapped in the final result.
	 *
	 * @defaultValue true
	 */
	unwrap: boolean;
	/**
	 * If true, only function values (not strings!) will be considered for
	 * resolution.
	 */
	onlyFnRefs: boolean;
}

/**
 * Visits all key-value pairs or array items in depth-first order, expands any
 * reference values, mutates the original object and returns it. Cyclic
 * references are not allowed and will throw an error. However, refs pointing to
 * other refs are recursively resolved (again, provided there are no cycles).
 *
 * @remarks
 * Reference values are special strings representing lookup paths of other
 * values in the object and are prefixed with given `prefix` string (default:
 * `@`) for relative refs or `@/` for absolute refs and both using `/` as path
 * separator (Note: trailing slashes are NOT allowed!). Relative refs are
 * resolved from the currently visited object and support "../" prefixes to
 * access any parent levels. Absolute refs are always resolved from the root
 * level (the original object passed to this function).
 *
 * Values can be protected from (further) resolution attempts in two ways:
 *
 * 1) by wrapping them via {@link resolved}. By default (unless `unwrap` is set
 *    to `false`), these wrapped values are only used during the resolution
 *    phase and the final result object/array will only contain the original,
 *    unwrapped values. In any way, unwrapped values will also be supplied to
 *    any lookup functions, no `.deref()` necessary there.
 * 2) Enabling the `onlyFnRefs` option, only function values will be considered
 *    for resolution and strings (regardless of prefix) will be ignored.
 *
 * See {@link ResolveOpts} and package readme for further details.
 *
 * @example
 * ```ts tangle:../export/resolve.ts
 * import { resolve } from "@thi.ng/resolve-map";
 *
 * // `c` references sibling `d`
 * // `d` references parent `a`
 * console.log(
 *   resolve({ a: 1, b: { c: "@d", d: "@/a" } })
 * );
 * // { a: 1, b: { c: 1, d: 1 } }
 * ```
 *
 * Any function values are called using two possible conventions:
 *
 * 1) If the user function uses ES6 object destructuring for its first
 *    argument, the given object keys are resolved prior to calling the
 *    function and the resolved values provided as first argument
 *    (object) and a general `resolve` function as second argument.
 * 2) If no de-structure form is found in the function's arguments, the
 *    function is only called with `resolve` as argument.
 *
 * **Important:** Since ES6 var names can't contain special characters,
 * destructured keys can ALWAYS only be looked up as siblings of the
 * currently processed key.
 *
 * The `resolve` function provided as arg to the user function accepts a
 * path (**without `@` prefix**) to look up any other values in the root
 * object.
 *
 * ```ts tangle:../export/resolve-2.ts
 * import { resolve } from "@thi.ng/resolve-map";
 *
 * // `c` uses ES6 destructuring form to look up `a` & `b` values
 * // `d` uses provided resolve fn arg `$` to look up `c`
 * console.log(
 *   resolve({ a: 1, b: 2, c: ({ a, b }) => a + b, d: ($) => $("c") })
 * );
 * // { a: 1, b: 2, c: 3, d: 3 }
 *
 * // last item references item @ index = 2
 * console.log(
 *   resolve([1, 2, ($) => $("0") + $("1"), "@2"])
 * );
 * // [1, 2, 3, 3]
 * ```
 *
 * The return value of the user provided function is used as final value
 * for that key in the object. This mechanism can be used to compute
 * derived values of other values stored anywhere in the root object.
 * **Function values will always be called only once.** Therefore, in
 * order to associate a function as final value to a key, it MUST be
 * wrapped with an additional function, as shown for the `e` key in the
 * example below. Similarly, if an actual string value should happen to
 * start with `@`, it needs to be wrapped in a function (see `f` key
 * below).
 *
 * ```ts tangle:../export/resolve-3.ts
 * import { resolve } from "@thi.ng/resolve-map";
 *
 * // `a` is derived from 1st array element in `b.d`
 * // `b.c` is looked up from `b.d[0]`
 * // `b.d[1]` is derived from calling `e(2)`
 * // `e` is a wrapped function
 * const res = resolve({
 *   a: ($) => $("b/c") * 100,
 *   b: { c: "@d/0", d: [2, ($) => $("../../e")(2) ] },
 *   e: () => (x) => x * 10,
 *   f: () => "@foo",
 * });
 *
 * console.log(res);
 * // { a: 200, b: { c: 2, d: [ 2, 20 ] }, e: [Function], f: "@foo" }
 *
 * console.log(res.e(2));
 * // 20
 * ```
 *
 * @param root -
 * @param opts -
 */
export function resolve<T>(root: Unresolved<T>, opts?: Partial<ResolveOpts>): T;
export function resolve<T>(
	root: Unresolved<T[]>,
	opts?: Partial<ResolveOpts>
): T[];
export function resolve(root: any, opts?: Partial<ResolveOpts>) {
	const $opts = <ResolveOpts>{ prefix: "@", unwrap: true, ...opts };
	return isPlainObject(root)
		? __resolveMap(root, $opts)
		: isArray(root)
		? __resolveArray(root, $opts)
		: root;
}

/** @internal */
const __resolveMap = <T>(
	obj: Unresolved<T>,
	opts: ResolveOpts,
	root?: any,
	path: LookupPath = [],
	resolved: IObjectOf<boolean> = {},
	stack: string[] = []
) => {
	root = root || obj;
	for (let k in obj) {
		__resolve(root, [...path, k], resolved, stack, opts);
	}
	return !opts.unwrap || path.length
		? <T>obj
		: __unwrapResolved(<T>obj, resolved);
};

/** @internal */
const __resolveArray = <T>(
	arr: Unresolved<T[]>,
	opts: ResolveOpts,
	root?: any,
	path: LookupPath = [],
	resolved: IObjectOf<boolean> = {},
	stack: string[] = []
) => {
	root = root || arr;
	for (let k = 0, n = arr.length; k < n; k++) {
		__resolve(root, [...path, k], resolved, stack, opts);
	}
	return !opts.unwrap || path.length
		? <T[]>arr
		: __unwrapResolved(<T[]>arr, resolved);
};

/**
 * The actual recursive resolution mechanism. Takes root object, key
 * path, helper object for marking visited keys and a stack of currently
 * active lookups. The latter is used for cycle detection and `_resolve`
 * will throw an error if a cycle has been detected.
 *
 * @param root -
 * @param path -
 * @param resolved -
 * @param stack -
 *
 * @internal
 */
const __resolve = (
	root: any,
	path: LookupPath,
	resolved: IObjectOf<boolean>,
	stack: string[],
	opts: ResolveOpts
) => {
	const pathID = path.join("/");
	if (stack.indexOf(pathID) >= 0) {
		illegalArgs(`cyclic references not allowed: ${pathID}`);
	}
	// console.log(pp, resolved[pp], stack);
	let [v, isResolved] = __getInUnsafe(root, path);
	if (!resolved[pathID]) {
		if (isResolved) {
			resolved[pathID] = true;
			return v;
		}
		let res = SEMAPHORE;
		stack.push(pathID);
		if (isPlainObject(v)) {
			__resolveMap(
				v,
				{ ...opts, unwrap: false },
				root,
				path,
				resolved,
				stack
			);
		} else if (isArray(v)) {
			__resolveArray(
				v,
				{ ...opts, unwrap: false },
				root,
				path,
				resolved,
				stack
			);
		} else if (
			!opts.onlyFnRefs &&
			isString(v) &&
			v.startsWith(opts.prefix)
		) {
			res = __resolve(
				root,
				absPath(path, v, opts.prefix.length),
				resolved,
				stack,
				opts
			);
		} else if (isFunction(v)) {
			res = __resolveFunction(
				v,
				(p: string) =>
					__resolve(root, absPath(path, p, 0), resolved, stack, opts),
				pathID,
				resolved
			);
		} else if (!exists(root, path)) {
			v = __resolvePath(root, path, resolved, stack, opts);
		}
		if (res !== SEMAPHORE) {
			mutInUnsafe(root, path, res);
			v = res;
		}
		resolved[pathID] = true;
		stack.pop();
	}
	return v;
};

/**
 * Repeatedly calls `_resolve` by stepwise descending along given path
 * and returns final value. This is to ensure full resolution of deeper
 * values created by functions at intermediate tree levels.
 *
 * E.g. given:
 *
 * ```text
 * { a: () => ({ b: { c: 1 } }), d: "@/a/b/c" }
 * =>
 * { a: { b: { c: 1 } }, d: 1 }
 * ```
 *
 * @param root -
 * @param path -
 * @param resolved -
 *
 * @internal
 */
const __resolvePath = (
	root: any,
	path: LookupPath,
	resolved: IObjectOf<boolean>,
	stack: string[],
	opts: ResolveOpts
) => {
	// temporarily remove current path to avoid cycle detection
	let pathID = stack.pop();
	let v;
	for (let i = 1, n = path.length; i <= n; i++) {
		v = __resolve(root, path.slice(0, i), resolved, stack, opts);
	}
	// restore
	stack.push(pathID!);
	return v;
};

/**
 * Resolution helper for function values. Checks if the user function
 * uses ES6 object destructuring for its first argument and if so
 * resolves the given keys before calling the function and provides
 * their values as first arg. If no de-structure form is found, calls
 * function only with `resolve` as argument.
 *
 * If the user function returns an array or plain object, all of its
 * nested values are marked as resolved.
 *
 * See `resolve` comments for further details.
 *
 * @param fn -
 * @param resolve -
 * @param pathID - current base path for marking
 * @param resolved -
 *
 * @internal
 */
const __resolveFunction = (
	fn: (x: any, r?: ResolveFn) => any,
	resolve: ResolveFn,
	pathID: string,
	resolved: IObjectOf<boolean>
) => {
	const match = RE_ARGS.exec(fn.toString());
	let res;
	if (match) {
		const args = match[2]
			// remove white space and trailing comma
			.replace(/\s|(,\s*$)/g, "")
			.split(/,/g)
			.map((k) => k.split(":")[0])
			.reduce((acc: any, k) => ((acc[k] = resolve(k)), acc), {});
		res = fn(args, resolve);
	} else {
		res = fn(resolve);
	}
	__markResolved(res, pathID, resolved);
	return res;
};

/** @internal */
const __markResolved = (v: any, path: string, resolved: IObjectOf<boolean>) => {
	resolved[path] = true;
	if (isPlainObject(v)) {
		__markObjResolved(v, path, resolved);
	} else if (isArray(v)) {
		__markArrayResolved(v, path, resolved);
	}
};

/** @internal */
const __markObjResolved = (
	obj: any,
	path: string,
	resolved: IObjectOf<boolean>
) => {
	let v, p;
	for (let k in obj) {
		v = obj[k];
		p = path + "/" + k;
		__markResolved(v, p, resolved);
	}
};

/** @internal */
const __markArrayResolved = (
	arr: any[],
	path: string,
	resolved: IObjectOf<boolean>
) => {
	let v, p;
	for (let i = 0, n = arr.length; i < n; i++) {
		v = arr[i];
		p = path + "/" + i;
		__markResolved(v, p, resolved);
	}
};

/**
 * Takes the path for the current key and a lookup path string. Converts
 * the possibly relative lookup path into its absolute form.
 *
 * @param curr -
 * @param path -
 * @param idx -
 */
export const absPath = (
	curr: LookupPath,
	path: string,
	idx = 1
): NumOrString[] => {
	if (path.charAt(idx) === "/") {
		return path.substring(idx + 1).split("/");
	}
	curr = curr.slice(0, curr.length - 1);
	const sub = path.substring(idx).split("/");
	for (let i = 0, n = sub.length; i < n; i++) {
		if (sub[i] === "..") {
			!curr.length && illegalArgs(`invalid lookup path: ${path}`);
			curr.pop();
		} else {
			return curr.concat(sub.slice(i));
		}
	}
	!curr.length && illegalArgs(`invalid lookup path: ${path}`);
	return curr;
};

/**
 * Value wrapper to protect from future recursive resolution attempts. See
 * {@link resolved} for further details.
 */
export class Resolved<T> implements IDeref<T> {
	constructor(protected _value: T) {}

	deref() {
		return this._value;
	}
}

/**
 * Factory function for {@link Resolved} to wrap & protect values from further
 * resolution attempts. The wrapped value can be later obtained via the standard
 * [`IDeref`](https://docs.thi.ng/umbrella/api/interfaces/IDeref.html)
 * interface/mechanism. In lookup functions, the unwrapped value will be
 * supplied, no `.deref()` necessary there.
 *
 * @param val
 */
export const resolved = <T>(val: T) => new Resolved<T>(val);

/**
 * Special version of
 * [`getInUnsafe()`](https://docs.thi.ng/umbrella/paths/functions/getInUnsafe.html)
 * with extra support for intermediate wrapped {@link Resolved} values and
 * returning tuple of: `[val,isResolved]`.
 *
 * @param obj
 * @param path
 *
 * @internal
 */
const __getInUnsafe = (obj: any, path: LookupPath) => {
	const n = path.length - 1;
	let res = obj;
	let isResolved = obj instanceof Resolved;
	for (let i = 0; res != null && i <= n; i++) {
		res = res[path[i]];
		if (res instanceof Resolved) {
			isResolved = true;
			res = res.deref();
		}
	}
	return [res, isResolved];
};

/**
 * Unwraps all known values wrapped using {@link Resolved} in-place.
 *
 * @param root
 * @param resolved
 *
 * @internal
 */
const __unwrapResolved = <T>(root: T, resolved: IObjectOf<boolean>) => {
	for (let path in resolved) {
		const $path = path.split("/");
		const val = __getInUnsafe(root, $path);
		val[1] && mutInUnsafe(root, $path, val[0]);
	}
	return root;
};
