// SPDX-License-Identifier: Apache-2.0
import type { Processor, RotateSpec } from "../api.js";
import { coerceColor } from "../units.js";

export const rotateProc: Processor = async (spec, input, _) => {
	const { angle, bg, flipX, flipY } = <RotateSpec>spec;
	if (flipX) input = input.flop();
	if (flipY) input = input.flip();
	return [
		input.rotate(angle, { background: coerceColor(bg || "#0000") }),
		true,
	];
};
