// SPDX-License-Identifier: Apache-2.0
import { binFreq } from "@thi.ng/dsp";
import { float, percent } from "@thi.ng/strings";
import { map, mapcat, range, repeat } from "@thi.ng/transducers";

export const NUM_BINS = 64;
export const WINDOW_LEN = NUM_BINS * 2;
export const BIN_AMP = NUM_BINS / 4;
export const PITCH_SCALE = 2;
export const FMT = float(3);
export const FMT_PERCENT = percent(3);

export const PRESETS: any[] = [
	() => [0, 1, ...repeat(0, NUM_BINS - 2)],
	() => [0, ...map((i) => 1 / i, range(1, NUM_BINS))],
	() => [...mapcat((i) => [0, 1 / i], range(1, NUM_BINS + 1, 2))],
];

export const BIN_LABELS = [
	...map(
		(i) => (binFreq(i, 48000 / PITCH_SCALE, WINDOW_LEN) | 0) + " Hz",
		range(NUM_BINS)
	),
];
