// SPDX-License-Identifier: Apache-2.0
import { memoizeO } from "@thi.ng/memoize/memoizeo";

/**
 * @param ch - character
 * @param n - repeat count
 */
export const repeat = memoizeO((ch: string, n: number) => ch.repeat(n));
