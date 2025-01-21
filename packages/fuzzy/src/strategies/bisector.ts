// SPDX-License-Identifier: Apache-2.0
import { fit } from "@thi.ng/math/fit";
import type { DefuzzStrategy, DefuzzStrategyOpts } from "../api.js";
import { __defaultOpts } from "./opts.js";

/**
 * Higher-order function: Bisector-of-Area defuzzification strategy. Returns
 * strategy which computes the integral of a given fuzzy set in the defined
 * `[min,max]` domain and returns the position of the bisector which partitions
 * the area into 2 equal halves. The domain is sampled at `opts.samples`
 * uniformly spaced points.
 *
 * @remarks
 * Use `samples` option to adjust precision.
 *
 * Also see {@link DefuzzStrategyOpts}
 *
 * @example
 * ```ts tangle:../../export/bisector-strategy.ts
 * import { bisectorStrategy, trapezoid } from "@thi.ng/fuzzy";
 *
 * console.log(
 *   bisectorStrategy()(trapezoid(0,1,5,6), [0,6])
 * );
 * // 2.97
 *
 * // ......▁█████████████|█████████████▁.....
 * // ......██████████████|██████████████.....
 * // .....███████████████|███████████████....
 * // ....▇███████████████|███████████████▇...
 * // ...▅████████████████|████████████████▅..
 * // ..▃█████████████████|█████████████████▃.
 * // .▁██████████████████|██████████████████▁
 * // .███████████████████|███████████████████
 * //                     ^ 2.97
 * ```
 *
 * @param opts -
 */
export const bisectorStrategy = (
	opts?: Partial<DefuzzStrategyOpts>
): DefuzzStrategy => {
	let { samples } = __defaultOpts(opts);
	return (fn, [min, max]) => {
		const delta = (max - min) / samples;
		let sum: number[] = [];
		for (let i = 0, acc = 0; i <= samples; i++) {
			acc += fn(min + i * delta);
			sum.push(acc);
		}
		if (!sum.length) return min;
		const mean = sum[samples] * 0.5;
		for (let i = 1; i <= samples; i++) {
			if (sum[i] >= mean) {
				return fit(
					mean,
					sum[i - 1],
					sum[i],
					min + (i - 1) * delta,
					min + i * delta
				);
			}
		}
		return min;
	};
};
