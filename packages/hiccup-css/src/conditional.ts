import { isString } from "@thi.ng/checks/is-string";
import { expand, indent } from "./impl.js";
import type { Conditional, CSSOpts, RuleFn } from "./api.js";

export const conditional =
	(type: string, cond: Conditional, rules: any[]): RuleFn =>
	(acc: string[], opts: CSSOpts) => {
		const space = indent(opts);
		acc.push(
			`${space}${type} ${__formatCond(cond)}${opts.format.declStart}`
		);
		opts.depth++;
		expand(acc, [], rules, opts);
		opts.depth--;
		acc.push(space + opts.format.declEnd);
		return acc;
	};

/** @internal */
const __formatCond = (cond: any) => {
	if (isString(cond)) {
		return cond;
	}
	const acc = [];
	for (let c in cond) {
		if (cond.hasOwnProperty(c)) {
			let v = cond[c];
			if (v === true) {
				v = MEDIA_TYPES.has(c) ? c : `(${c})`;
			} else if (v === false) {
				v = `(not ${MEDIA_TYPES.has(c) ? c : `(${c})`})`;
			} else if (v === "only") {
				v += " " + c;
			} else {
				v = `(${c}:${v})`;
			}
			acc.push(v);
		}
	}
	return acc.join(" and ");
};

const MEDIA_TYPES = new Set(["all", "print", "screen"]);
