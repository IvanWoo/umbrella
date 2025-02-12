// SPDX-License-Identifier: Apache-2.0
import { fract } from "@thi.ng/math/prec";
import type { StatelessOscillator } from "./api.js";

/**
 * Parabolic waveform oscillator.
 *
 * @remarks
 * Reference:
 * https://www.desmos.com/calculator/gsobpc8hsy
 *
 * @param phase -
 * @param freq -
 * @param amp -
 * @param dc -
 */
export const parabolic: StatelessOscillator = (phase, freq, amp = 1, dc = 0) =>
	dc + amp * (8 * (fract(phase * freq) - 0.5) ** 2 - 1);
