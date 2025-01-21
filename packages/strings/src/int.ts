// SPDX-License-Identifier: Apache-2.0
import { memoizeJ } from "@thi.ng/memoize/memoizej";
import type { Stringer } from "./api.js";

export const int: Stringer<number> = (x) => String(Math.trunc(x));

export const intLocale: (locale?: string) => Stringer<number> = memoizeJ(
	(locale) => (x) => Math.trunc(x).toLocaleString(locale)
);
