// SPDX-License-Identifier: Apache-2.0
import type { FnAny, FnAnyA, MaybePromise } from "@thi.ng/api";

/**
 * Similar to {@link threadLast}. A dataflow operator to improve the legibility
 * of long (or deeply nested) call expressions. Takes an `init` value and a
 * number of functions and/or function tuples, consisting of: `[fn, ...args]`.
 * Executes each function (or tuple) with the return value of the previous
 * step/function inserted as **first** argument, using `init` as the first
 * expression. Returns result of last function/step given.
 *
 * @remarks
 * This operator allows the code to be read more easily in the order of
 * execution (same as the `->` operator/macro in Clojure).
 *
 * @example
 * ```ts tangle:../export/thread-first.ts
 * import { threadFirst } from "@thi.ng/compose";
 *
 * const neg = (x) => -x;
 * const sub = (a, b) => a - b;
 * const div = (a, b) => a / b;
 *
 * // without operator: (-5 - 10) / 20
 * console.log(div(sub(neg(5), 10), 20));
 * // -0.75
 *
 * // rewritten using operator:
 * threadFirst(
 *   5,
 *   neg,       // -5
 *   [sub, 10], // (-5) - 10
 *   [div, 20], // (-5 - 10) / 20
 *   console.log
 * );
 * // -0.75
 * ```
 *
 * @param init - start value
 * @param fns - functions / S-expressions
 */
export const threadFirst = (
	init: any,
	...fns: (FnAny<any> | [FnAny<any>, ...any[]])[]
) =>
	fns.reduce(
		(acc, expr) =>
			typeof expr === "function"
				? expr(acc)
				: expr[0](acc, ...expr.slice(1)),
		init
	);

/**
 * Async version of {@link threadFirst}.
 *
 * @remarks
 * Also see {@link threadLastAsync}.
 *
 * @param init
 * @param fns
 */
export const threadFirstAsync = async (
	init: MaybePromise<any>,
	...fns: (FnAnyA<any> | [FnAnyA<any>, ...any[]])[]
) => {
	let res = await init;
	for (let expr of fns) {
		res = await (typeof expr === "function"
			? expr(res)
			: expr[0](res, ...expr.slice(1)));
	}
	return res;
};
