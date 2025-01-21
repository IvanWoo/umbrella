// SPDX-License-Identifier: Apache-2.0
import type { Parser } from "../api.js";
import { parseError } from "../error.js";

export const fail =
	(msg: string): Parser<any> =>
	(ctx) =>
		parseError(ctx, msg);
