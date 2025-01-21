// SPDX-License-Identifier: Apache-2.0
import { Lane } from "../api.js";
import { defFloatFormat } from "./float-format.js";

export const FLOAT_GRAY = defFloatFormat({
	gray: true,
	channels: [Lane.RED],
});
