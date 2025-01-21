// SPDX-License-Identifier: Apache-2.0
import { TAU } from "@thi.ng/math/api";
import type { StatelessOscillator } from "./api.js";

export const cos: StatelessOscillator = (phase, freq, amp = 1, dc = 0) =>
	dc + amp * Math.cos(phase * freq * TAU);
