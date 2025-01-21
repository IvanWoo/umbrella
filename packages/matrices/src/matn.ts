// SPDX-License-Identifier: Apache-2.0
import type { Mat } from "./api.js";
import { scale22, scale23, scale33, scale44 } from "./scale.js";

export const mat22n = (out: Mat | null, n: number) => scale22(out, n);

export const mat23n = (out: Mat | null, n: number) => scale23(out, n);

export const mat33n = (out: Mat | null, n: number) => scale33(out, n);

export const mat44n = (out: Mat | null, n: number) =>
	scale44(out, [n, n, n, n]);
