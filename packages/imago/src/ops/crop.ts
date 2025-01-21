// SPDX-License-Identifier: Apache-2.0
import { isNumber } from "@thi.ng/checks";
import { illegalArgs } from "@thi.ng/errors";
import type { CropSpec, Dim, Processor } from "../api.js";
import {
	computeMargins,
	computeSize,
	computeSizeWithAspect,
	gravityPosition,
	positionOrGravity,
} from "../units.js";

export const cropProc: Processor = async (spec, input, ctx) => {
	const { aspect, border, gravity, pos, size, ref, unit } = <CropSpec>spec;
	if (border == null && size == null)
		illegalArgs("require `border` or `size` option");
	if (border != null) {
		const sides = computeMargins(border, ctx.size, ref, unit);
		const [left, right, top, bottom] = sides;
		return [
			input.extract({
				left,
				top,
				width: ctx.size[0] - left - right,
				height: ctx.size[1] - top - bottom,
			}),
			true,
		];
	}
	let $size: Dim;
	if (aspect != undefined) {
		if (!isNumber(size))
			illegalArgs("size must be numeric if aspect is used");
		$size = computeSizeWithAspect(size, ctx.size, aspect, unit);
	} else {
		$size = computeSize(size!, ctx.size, ref, unit);
	}
	let left = 0,
		top = 0;
	if (pos) {
		({ left = 0, top = 0 } =
			positionOrGravity($size, ctx.size, <CropSpec>spec) || {});
	} else {
		[left, top] = gravityPosition(gravity || "c", $size, ctx.size);
	}
	return [
		input.extract({
			left,
			top,
			width: $size[0],
			height: $size[1],
		}),
		true,
	];
};
