// SPDX-License-Identifier: Apache-2.0
import { expect, test } from "bun:test";
import { classifyField, type Field, type FieldClass } from "../src/index.js";

const checkAll = (
	specs: [
		Pick<Field, "type" | "tag" | "len" | "const">,
		{ classifier: FieldClass; isConst: boolean }
	][]
) => {
	for (let [f, res] of specs) {
		expect(classifyField(f, {})).toEqual(res);
	}
};

test("string", () => {
	checkAll([
		[{ type: "string" }, { classifier: "str", isConst: true }],
		[
			{ type: "string", const: false },
			{ classifier: "str", isConst: false },
		],
		[
			{ type: "string", tag: "array", len: 1 },
			{ classifier: "strArray", isConst: true },
		],
		[
			{ type: "string", tag: "ptr" },
			{ classifier: "strPtr", isConst: true },
		],
		[
			{ type: "string", tag: "ptr", len: 2 },
			{ classifier: "strPtrFixed", isConst: true },
		],
		[
			{ type: "string", tag: "ptr", len: 0 },
			{ classifier: "strPtrMulti", isConst: true },
		],
		[
			{ type: "string", tag: "slice" },
			{ classifier: "strSlice", isConst: true },
		],
	]);
	expect(() =>
		classifyField({ type: "string", tag: "array", len: 0 }, {})
	).toThrow();
	expect(() =>
		classifyField({ type: "string", tag: "vec", len: 2 }, {})
	).toThrow();
});

test("opaque", () => {
	checkAll([
		[{ type: "opaque" }, { classifier: "opaque", isConst: false }],
		[
			{ type: "opaque", const: true },
			{ classifier: "opaque", isConst: true },
		],
		[
			{ type: "opaque", tag: "array", len: 1 },
			{ classifier: "opaqueArray", isConst: false },
		],
		[
			{ type: "opaque", tag: "ptr" },
			{ classifier: "opaquePtr", isConst: false },
		],
		[
			{ type: "opaque", tag: "ptr", len: 2 },
			{ classifier: "opaquePtrFixed", isConst: false },
		],
		[
			{ type: "opaque", tag: "ptr", len: 0 },
			{ classifier: "opaquePtrMulti", isConst: false },
		],
		[
			{ type: "opaque", tag: "slice" },
			{ classifier: "opaqueSlice", isConst: false },
		],
	]);
	expect(() =>
		classifyField({ type: "opaque", tag: "array", len: 0 }, {})
	).toThrow();
	expect(() =>
		classifyField({ type: "opaque", tag: "vec", len: 2 }, {})
	).toThrow();
});

test("prim", () => {
	checkAll([
		[{ type: "u8" }, { classifier: "single", isConst: false }],
		[
			{ type: "u8", const: true },
			{ classifier: "single", isConst: true },
		],
		[
			{ type: "u8", tag: "array", len: 1 },
			{ classifier: "array", isConst: false },
		],
		[
			{ type: "u8", tag: "ptr" },
			{ classifier: "ptr", isConst: false },
		],
		[
			{ type: "u8", tag: "ptr", len: 2 },
			{ classifier: "ptrFixed", isConst: false },
		],
		[
			{ type: "u8", tag: "ptr", len: 0 },
			{ classifier: "ptrMulti", isConst: false },
		],
		[
			{ type: "u8", tag: "slice" },
			{ classifier: "slice", isConst: false },
		],
		[
			{ type: "u8", tag: "vec", len: 2 },
			{ classifier: "vec", isConst: false },
		],
	]);
	expect(() =>
		classifyField({ type: "u8", tag: "array", len: 0 }, {})
	).toThrow();
	expect(() =>
		classifyField({ type: "u8", tag: "array", len: 0 }, {})
	).toThrow();
});
