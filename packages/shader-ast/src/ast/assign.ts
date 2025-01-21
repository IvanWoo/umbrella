// SPDX-License-Identifier: Apache-2.0
import { assert } from "@thi.ng/errors/assert";
import type { Assign, Swizzle, Term } from "../api/nodes.js";
import type { Assignable, Type } from "../api/types.js";

export const assign = <L extends Type, R extends L>(
	l: Assignable<L>,
	r: Term<R>
): Assign<L> => {
	assert(
		l.tag !== "swizzle" || (<Swizzle<any>>l).val.tag === "sym",
		"can't assign to non-symbol swizzle"
	);
	return {
		tag: "assign",
		type: l.type,
		l,
		r,
	};
};
