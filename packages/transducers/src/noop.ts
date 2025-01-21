// SPDX-License-Identifier: Apache-2.0
import { identity } from "@thi.ng/api/fn";
import type { Transducer } from "./api.js";

/**
 * No-op / pass-through transducer, essentially the same as: `map((x) => x)`,
 * but faster. Useful for testing and / or to keep existing values in a
 * {@link multiplex} tuple lane.
 */
export const noop = <T>(): Transducer<T, T> => identity;
