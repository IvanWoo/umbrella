// SPDX-License-Identifier: Apache-2.0
import { expect, test } from "bun:test";
import { deserialize, serialize } from "../src/index.js";

test("roundtrip", () => {
	const obj = {
		small_i8: -0x0f,
		i8: -0x80,
		small_u8: 0xff,
		i16: -0x8000,
		u16: 0xfedc,
		i32: -0x8000_0000,
		u32: 0xfedc_ba98,
		i64: -0x8000_0000_0000_0000n,
		u64: 0xfedc_ba98_7654_3210n,
		utf8_array: ["👋 Hello", "msgpack!", { nested: "🔥🤌" }],
		now: new Date(2023, 11, 24, 11, 23, 45, 789),
		nullish: null,
		undef: undefined, // should be skipped in serialization
	};
	const bytes = serialize(obj);
	expect(bytes).toEqual(
		new Uint8Array([
			140, 168, 115, 109, 97, 108, 108, 95, 105, 56, 241, 162, 105, 56,
			208, 128, 168, 115, 109, 97, 108, 108, 95, 117, 56, 204, 255, 163,
			105, 49, 54, 209, 128, 0, 163, 117, 49, 54, 205, 254, 220, 163, 105,
			51, 50, 210, 128, 0, 0, 0, 163, 117, 51, 50, 206, 254, 220, 186,
			152, 163, 105, 54, 52, 211, 128, 0, 0, 0, 0, 0, 0, 0, 163, 117, 54,
			52, 207, 254, 220, 186, 152, 118, 84, 50, 16, 170, 117, 116, 102,
			56, 95, 97, 114, 114, 97, 121, 147, 170, 240, 159, 145, 139, 32, 72,
			101, 108, 108, 111, 168, 109, 115, 103, 112, 97, 99, 107, 33, 129,
			166, 110, 101, 115, 116, 101, 100, 168, 240, 159, 148, 165, 240,
			159, 164, 140, 163, 110, 111, 119, 215, 255, 188, 28, 189, 0, 101,
			136, 20, 193, 167, 110, 117, 108, 108, 105, 115, 104, 192,
		])
	);
	const obj2 = deserialize(bytes);
	expect(obj2).toEqual(obj);
});
