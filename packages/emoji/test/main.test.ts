// SPDX-License-Identifier: Apache-2.0
import { expect, test } from "bun:test";
import { EMOJI, NAMES, replaceNames } from "../src/index.js";

test("roundtrip", () => {
	Object.keys(EMOJI).forEach((id) => {
		expect(
			NAMES[EMOJI[id]] === id || EMOJI[NAMES[EMOJI[id]]] === EMOJI[id]
		).toBeTrue();
	});
});

test("no-hyphens", () => {
	const ignore = ["-1"];
	const invalid = Object.keys(EMOJI).filter(
		(id) => !(ignore.includes(id) || id.indexOf("-") == -1)
	);
	expect(invalid).toEqual([]);
});

test("replaceNames", () => {
	expect(replaceNames("Amazing :grin::heart_eyes::invalid:!")).toBe(
		"Amazing 😁😍:invalid:!"
	);
});
