// SPDX-License-Identifier: Apache-2.0
import type { Reducer } from "./api.js";
import { reduce } from "./reduce.js";

/**
 * Reducer computing mean of received inputs. Returns 0 if no inputs
 * were processed.
 */
export function mean(): Reducer<number, number>;
export function mean(src: Iterable<number>): number;
export function mean(src?: Iterable<number>): any {
	let n = 1;
	return src
		? reduce(mean(), src)
		: <Reducer<number, number>>[
				() => (n = 0),
				(acc) => (n > 1 ? acc / n : acc),
				(acc, x) => (n++, acc + x),
		  ];
}
