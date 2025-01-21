// SPDX-License-Identifier: Apache-2.0
import { isString } from "@thi.ng/checks/is-string";
import { assert } from "@thi.ng/errors/assert";
import { illegalArgs } from "@thi.ng/errors/illegal-arguments";
import type { Lit, Sym, Term } from "../api/nodes.js";
import type { SymOpts } from "../api/syms.js";
import type { ArrayTypeMap, Type } from "../api/types.js";
import { gensym } from "./idgen.js";

export function sym<T extends Type>(init: Term<T>): Sym<T>;
export function sym<T extends Type>(type: T): Sym<T>;
export function sym<T extends Type>(type: T, opts: SymOpts): Sym<T>;
export function sym<T extends Type>(type: T, init: Term<T>): Sym<T>;
export function sym<T extends Type>(type: T, id: string): Sym<T>;
// prettier-ignore
export function sym<T extends Type>(type: T, id: string, opts: SymOpts): Sym<T>;
// prettier-ignore
export function sym<T extends Type>(type: T, opts: SymOpts, init: Term<T>): Sym<T>;
// prettier-ignore
export function sym<T extends Type>(type: T, id: string, opts: SymOpts, init: Term<T>): Sym<T>;
export function sym<T extends Type>(type: any, ...args: any[]): Sym<any> {
	let id: string;
	let opts: SymOpts;
	let init: Term<T>;
	switch (args.length) {
		case 0:
			if (!isString(type)) {
				init = type;
				type = init.type;
			}
			break;
		case 1:
			if (isString(args[0])) {
				id = args[0];
			} else if (args[0].tag) {
				init = args[0];
			} else {
				opts = args[0];
			}
			break;
		case 2:
			if (isString(args[0])) {
				[id, opts] = args;
			} else {
				[opts, init] = args;
			}
			break;
		case 3:
			[id, opts, init] = args;
			break;
		default:
			illegalArgs();
	}
	return {
		tag: "sym",
		type,
		id: id! || gensym(),
		opts: opts! || {},
		init: init!,
	};
}

export const constSym = <T extends Type>(
	type: T,
	id?: string,
	opts?: SymOpts,
	init?: Term<T>
) => sym(type, id || gensym(), { const: true, ...opts }, init!);

/**
 * Defines a new symbol with optional initial array values.
 *
 * Important: Array initializers are UNSUPPORTED in GLSL ES v1 (WebGL),
 * any code using such initializers will only work under WebGL2 or other
 * targets.
 */
export const arraySym = <T extends keyof ArrayTypeMap>(
	type: T,
	id?: string,
	opts: SymOpts = {},
	init?: (Lit<T> | Sym<T>)[]
): Sym<ArrayTypeMap[T]> => {
	if (init && opts.num == null) {
		opts.num = init.length;
	}
	assert(opts.num != null, "missing array length");
	init &&
		assert(
			opts.num === init.length,
			`expected ${opts.num} items in array, but got ${init.length}`
		);
	const atype = <Type>(type + "[]");
	return <any>{
		tag: "sym",
		type: atype,
		id: id || gensym(),
		opts,
		init: init
			? {
					tag: "array_init",
					type: atype,
					init,
			  }
			: undefined,
	};
};

export const input = <T extends Type>(type: T, id: string, opts?: SymOpts) =>
	sym(type, id, { q: "in", type: "in", ...opts });

export const output = <T extends Type>(type: T, id: string, opts?: SymOpts) =>
	sym(type, id, { q: "out", type: "out", ...opts });

export const uniform = <T extends Type>(type: T, id: string, opts?: SymOpts) =>
	sym(type, id, { q: "in", type: "uni", ...opts });
