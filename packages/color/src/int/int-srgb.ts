// SPDX-License-Identifier: Apache-2.0
import { setC4 } from "@thi.ng/vectors/setc";
import type { Color } from "../api.js";
import { INV8BIT } from "../api/constants.js";

export const intArgb32Srgb = (out: Color | null, src: number) =>
	setC4(
		out || [],
		((src >>> 16) & 0xff) * INV8BIT,
		((src >>> 8) & 0xff) * INV8BIT,
		(src & 0xff) * INV8BIT,
		(src >>> 24) * INV8BIT
	);

export const intAbgr32Srgb = (out: Color | null, src: number) =>
	setC4(
		out || [],
		(src & 0xff) * INV8BIT,
		((src >>> 8) & 0xff) * INV8BIT,
		((src >>> 16) & 0xff) * INV8BIT,
		(src >>> 24) * INV8BIT
	);

export const intRgb24Srgb = (out: Color | null, src: number) =>
	intArgb32Srgb(out, src | 0xff000000);

export const intBgr24Srgb = (out: Color | null, src: number) =>
	intAbgr32Srgb(out, src | 0xff000000);
