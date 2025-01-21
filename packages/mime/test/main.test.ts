// SPDX-License-Identifier: Apache-2.0
import { expect, test } from "bun:test";
import { comp } from "@thi.ng/compose";
import { preferredType, preferredExtension } from "../src/index.js";

test("roundtrip", () => {
	const extensions = "aac,avif,css,jpeg,js,md,mp4,obj,png,stl,txt,webp".split(
		","
	);
	const fn = comp(preferredExtension, preferredType);
	for (let ext of extensions) {
		expect(fn(ext)).toBe(ext);
	}
});
