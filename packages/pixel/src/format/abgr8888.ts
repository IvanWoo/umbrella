// SPDX-License-Identifier: Apache-2.0
import { identity } from "@thi.ng/api/fn";
import { Lane } from "../api.js";
import { defIntFormat } from "./int-format.js";

export const ABGR8888 = defIntFormat({
	type: "u32",
	size: 32,
	alpha: 8,
	channels: [
		{ size: 8, lane: Lane.ALPHA },
		{ size: 8, lane: Lane.BLUE },
		{ size: 8, lane: Lane.GREEN },
		{ size: 8, lane: Lane.RED },
	],
	fromABGR: identity,
	toABGR: identity,
});
