import type { DefuzzStrategy, DefuzzStrategyOpts } from "../api.js";
import { __defaultOpts } from "./opts.js";

/**
 * Higher-order function: Centre-of-gravity defuzzification strategy, yielding
 * the approx. center of gravity position of a given fuzzy set. The domain is
 * sampled at `opts.samples` uniformly spaced points.
 *
 * @remarks
 * This is the default strategy used by {@link defuzz}. Produces similar results
 * to {@link bisectorStrategy}, but with lower computational cost. Use `samples`
 * option to adjust precision.
 *
 * Also see {@link DefuzzStrategyOpts}
 *
 * @example
 * ```ts tangle:../../export/centroid-strategy.ts
 * import { centroidStrategy, trapezoid } from "@thi.ng/fuzzy";
 *
 * console.log(
 *   centroidStrategy()(trapezoid(0,1,5,6), [0,6])
 * );
 * // 3.0000000000000004
 *
 * // ......▁█████████████|█████████████▁.....
 * // ......██████████████|██████████████.....
 * // .....███████████████|███████████████....
 * // ....▇███████████████|███████████████▇...
 * // ...▅████████████████|████████████████▅..
 * // ..▃█████████████████|█████████████████▃.
 * // .▁██████████████████|██████████████████▁
 * // .███████████████████|███████████████████
 * //                     ^ 3.00
 * ```
 *
 * @param opts -
 */
export const centroidStrategy = (
	opts?: Partial<DefuzzStrategyOpts>
): DefuzzStrategy => {
	let { samples } = __defaultOpts(opts);
	return (fn, [min, max]) => {
		const delta = (max - min) / samples;
		let num = 0;
		let denom = 0;
		for (let i = 0; i <= samples; i++) {
			const x = min + i * delta;
			const y = fn(x);
			num += x * y;
			denom += y;
		}
		return num / denom;
	};
};
