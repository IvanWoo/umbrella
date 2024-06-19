import type { Fn, Maybe } from "@thi.ng/api";
import type { FnBody1 } from "../api/function.js";
import type {
	Branch,
	ControlFlow,
	ForLoop,
	Sym,
	Term,
	Ternary,
	WhileLoop,
} from "../api/nodes.js";
import type { BoolTerm } from "../api/terms.js";
import type { Type } from "../api/types.js";
import { decl, scope } from "./scope.js";

export const ifThen = (
	test: BoolTerm,
	truthy: Term<any>[],
	falsey?: Term<any>[]
): Branch => ({
	tag: "if",
	type: "void",
	test,
	t: scope(truthy),
	f: falsey ? scope(falsey) : undefined,
});

export const ternary = <A extends Type, B extends A>(
	test: BoolTerm,
	t: Term<A>,
	f: Term<B>
): Ternary<A> => ({
	tag: "ternary",
	type: t.type,
	test,
	t,
	f,
});

// prettier-ignore
export function forLoop<T extends Type>(test: Fn<Sym<T>, BoolTerm>, body: FnBody1<T>): ForLoop;
// prettier-ignore
export function forLoop<T extends Type>(init: Maybe<Sym<T>>, test: Fn<Sym<T>, BoolTerm>, body: FnBody1<T>): ForLoop;
// prettier-ignore
export function forLoop<T extends Type>(init: Maybe<Sym<T>>, test: Fn<Sym<T>, BoolTerm>, iter: Fn<Sym<T>, Term<any>>, body: FnBody1<T>): ForLoop;
export function forLoop(...args: any[]): ForLoop {
	const [init, test, iter, body] =
		args.length === 2
			? [undefined, args[0], undefined, args[1]]
			: args.length === 3
			? [args[0], args[1], undefined, args[2]]
			: args;
	return {
		tag: "for",
		type: "void",
		init: init ? decl(init) : undefined,
		test: test(init!),
		iter: iter ? iter(init!) : undefined,
		scope: scope(body(init!)),
	};
}

export const whileLoop = (test: BoolTerm, body: Term<any>[]): WhileLoop => ({
	tag: "while",
	type: "void",
	test,
	scope: scope(body),
});

/** @internal */
const __ctrl = (id: string): ControlFlow => ({
	tag: "ctrl",
	type: "void",
	id,
});

export const brk = __ctrl("break");

export const cont = __ctrl("continue");

export const discard = __ctrl("discard");
