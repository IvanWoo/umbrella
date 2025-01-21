// SPDX-License-Identifier: Apache-2.0
import type { Vec } from "./api.js";

export const setC2 = (out: Vec | null, x: number, y: number) => (
	!out && (out = []), (out[0] = x), (out[1] = y), out
);

export const setC3 = (out: Vec | null, x: number, y: number, z: number) => (
	!out && (out = []), (out[0] = x), (out[1] = y), (out[2] = z), out
);

export const setC4 = (
	out: Vec | null,
	x: number,
	y: number,
	z: number,
	w: number
) => (
	!out && (out = []),
	(out[0] = x),
	(out[1] = y),
	(out[2] = z),
	(out[3] = w),
	out
);

export const setC6 = (
	out: Vec | null,
	a: number,
	b: number,
	c: number,
	d: number,
	e: number,
	f: number
) => (
	!out && (out = []),
	(out[0] = a),
	(out[1] = b),
	(out[2] = c),
	(out[3] = d),
	(out[4] = e),
	(out[5] = f),
	out
);

export const setC = (out: Vec | null, ...values: number[]) => {
	if (!out) return values;
	for (let i = 0, n = values.length; i < n; i++) {
		out[i] = values[i];
	}
	return out;
};
