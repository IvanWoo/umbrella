// SPDX-License-Identifier: Apache-2.0
import type { IClear, TypedArray, UIntArray } from "@thi.ng/api";
import { rotateTyped } from "@thi.ng/arrays/rotate";
import { isBigInt } from "@thi.ng/checks/is-bigint";
import { assert } from "@thi.ng/errors/assert";
import type { IRandom } from "@thi.ng/random";
import { SYSTEM } from "@thi.ng/random/system";
import { repeat } from "@thi.ng/transducers";
import { map } from "@thi.ng/transducers/map";
import { mapcat } from "@thi.ng/transducers/mapcat";
import { max } from "@thi.ng/transducers/max";
import { pluck } from "@thi.ng/transducers/pluck";
import { repeatedly } from "@thi.ng/transducers/repeatedly";
import { transduce } from "@thi.ng/transducers/transduce";
import type {
	CAConfig1D,
	CASpec1D,
	Kernel,
	Target,
	UpdateBufferOpts,
	UpdateImageOpts1D,
} from "./api.js";

const $0 = BigInt(0);
const $1 = BigInt(1);
const $32 = BigInt(32);

/**
 * Standard Wolfram automata 3-neighborhood (no history)
 */
export const WOLFRAM3: Kernel = [
	[-1, 0],
	[0, 0],
	[1, 0],
];

/**
 * Standard 5-neighborhood (no history)
 */
export const WOLFRAM5: Kernel = [[-2, 0], ...WOLFRAM3, [2, 0]];

/**
 * Standard 7-neighborhood (no history)
 */
export const WOLFRAM7: Kernel = [[-3, 0], ...WOLFRAM5, [3, 0]];

/**
 * Implementation of a 1D cellular automata environment with support for
 * multiple automata, each with its own settings for replication rules,
 * arbitrary neighborhood kernels (optionally with short term memory) and number
 * of cell states, all selectable via a shared per-cell mask array. This generic
 * setup enables many novel and unusual CA setups as well as coevolution of
 * multiple CAs within a shared environment.
 *
 * @remarks
 * ### Neighborhoods
 *
 * Cell neighborhoods are defined via an arbitrary number of 2D offset vectors
 * `[x, y]`, where `x` coordinates are horizontal offsets and positive `y`
 * coordinates are used to refer to previous generations (e.g. 0 = current gen,
 * 1 = T-1, 2 = T-2 etc.) and thereby providing a form of short term memory for
 * that specific automata. Negative `y` coords will lead to cells being ignored.
 *
 * ### Rule encoding
 *
 * Automata rules are encoded as JS `BigInt` values and are considered
 * anisotropic by default. If isotropy is desired, it has to be explicitly
 * pre-encoded (out of scope of this library). There's also built-in optional
 * support for position independent neighborhood encoding, only considering the
 * number/count of non-zero cells. An encoded rule ID and its overall magnitude
 * is directly related and dependent on the size and shape of its kernel config,
 * e.g.:
 *
 * ```ts
 * kernel = [[-2, 1], [-1, 0], [0, 0], [1, 0], [2, 1]]
 * ```
 *
 * This example kernel defines a 5-cell neighborhood with a max. short term
 * memory of one additional previous generation (i.e. the `[-2,1]` and `[2,1]`
 * offsets)
 *
 * The rules related to this kernel have a 32 bit address space (4 billion
 * possibilities), due to 2^5 = 32 and each kernel offset being assigned a
 * distinct bit value by default, i.e. first kernel offset = 2^0, second kernel
 * offset = 2^1, third = 2^2, fourth = 2^3, fifth = 2^4. Via the
 * {@link CASpec1D.positional} config option, this behavior can be overridden
 * per kernel, to achieve position-independent kernels (with much smaller rule
 * spaces).
 *
 * Given the following example cell matrix with the center cell highlighted with
 * caret (`^`):
 *
 * ```text
 * T-1: 2 0 1 2 1
 * T-0: 0 1 0 3 0
 *          ^
 * ```
 *
 * The above example kernel will select the following values and assign bit
 * positions (for all non-zero cell states) to compute a summed ID:
 *
 * | k index | offset    | cell value | encoded |
 * |--------:|-----------|-----------:|--------:|
 * | 0       | `[-2, 1]` | 2          | 1       |
 * | 1       | `[-1, 0]` | 1          | 2       |
 * | 2       | `[0, 0]`  | 0          | 0       |
 * | 3       | `[1, 0]`  | 3          | 8       |
 * | 4       | `[2, 1]`  | 1          | 16      |
 *
 * Final encoded neighborhood sum: 1 + 2 + 8 + 16 = 27
 *
 * To determine if a the current cell should be active or not in the next
 * generation, we now use that encoded sum as bit position to test a single bit
 * of the automata's rule ID, i.e. here we're testing bit 27. If that
 * corresponding bit is set in the rule ID, the cell's state will be increased
 * by 1.
 *
 * ### Cell states
 *
 * Each automata config can define a max. number of possible cell states (aka
 * age). Once a cell reaches the configured `numStates`, it automatically resets
 * to zero. This is by default, but can be overridden via the
 * {@link CASpec1D.reset} option. Conversely, if the corresponding bit is _not_
 * set in the rule ID, the cell state will be zeroed too.
 *
 * ### Update probabilities
 *
 * Each cell has an optional update probability, which is initialized to 1.0 by
 * default (i.e. to always be updated). Use
 * {@link MultiCA1D.updateProbabilistic} or {@link MultiCA1D.updateImage} to
 * take these probabilities into account.
 *
 * ### Wraparound
 *
 * By default the environment is configured to be toroidal, i.e. both left/right
 * sides of the env are connected. The behavior can be controlled via a ctor arg
 * and/or at runtime via the {@link MultiCA1D.wrap} property.
 *
 * ### Masks
 *
 * The {@link MultiCA1D.mask} array can be used to select different CA
 * configurations for each cell in the environment. Because this mask array is
 * initialized to zero, only the first CA configuration will be used for all
 * cells in the environment by default. It's the user's responsibility to manage
 * the mask and select/enable other (if any) CA configs for individual cells
 * (usually cell ranges). The values stored in this array correspond to the
 * indices of the {@link MultiCA1D.configs} array given at construction.
 *
 * ### Limits
 *
 * Due to using `Uint8Arrays` for storage, only up to 256 cell states are
 * supported. The same limit applies to the number of CA configs given.
 *
 * @example
 * ```ts tangle:../export/wolfram.ts
 * import { MultiCA1D } from "@thi.ng/cellular";
 *
 * // classic Wolfram Rule 110 automata
 * const wolfram = new MultiCA1D(
 *   [{
 *     kernel: [[-1, 0], [0, 0], [1, 0]],
 *     rule: 110,
 *     states: 2,
 *     reset: false
 *   }],
 *   256
 * );
 * ```
 */
export class MultiCA1D implements IClear {
	configs: CAConfig1D[];
	rows: number;
	numStates: number;
	mask!: Uint8Array;
	gens!: Uint8Array[];
	prob!: Float32Array;

	constructor(configs: CASpec1D[], public width: number, public wrap = true) {
		this.configs = configs.map(__compileSpec);
		this.rows =
			transduce(
				mapcat((c) => map((k) => k[1], c.kernel)),
				max(),
				configs
			) + 1;
		this.numStates = transduce(pluck("states"), max(), configs);
		assert(
			this.numStates >= 2 && this.numStates <= 256,
			"num states must be in [2..256] range"
		);
		this.resize(width);
	}

	get current() {
		return this.gens[1];
	}

	get previous() {
		return this.gens[2 % this.gens.length];
	}

	clear() {
		this.gens.forEach((g) => g.fill(0));
		this.mask.fill(0);
		this.prob.fill(1);
	}

	clearTarget(target: Target) {
		this._getTarget(target)[0].fill(target === "prob" ? 1 : 0);
	}

	resize(width: number) {
		this.width = width;
		this.mask = new Uint8Array(width);
		this.gens = [...repeatedly(() => new Uint8Array(width), this.rows + 1)];
		this.prob = new Float32Array(width).fill(1);
	}

	/**
	 * Sets a parametric pattern in the current generation or mask array.
	 *
	 * @param target - target buffer ID to apply pattern
	 * @param width - number of consecutive cells per segment
	 * @param stride -  number of cells between each pattern segment
	 * @param val - start cell value per segment
	 * @param inc - cell value increment
	 * @param offset - start cell offset
	 */
	setPattern(
		target: Target,
		width: number,
		stride: number,
		val = 1,
		inc = 0,
		offset = 0
	) {
		const [dest, num] = this._getTarget(target);
		for (let x = offset, w = this.width; x < w; x += stride) {
			for (let k = 0, v = val; k < width; k++, v += inc) {
				dest[x + k] = v % num;
			}
		}
		return this;
	}

	/**
	 * Sets cells in current generation array to a random state using given
	 * `probability` and optional PRNG
	 * ([`IRandom`](https://docs.thi.ng/umbrella/random/interfaces/IRandom.html)
	 * instance).
	 *
	 * @param target
	 * @param prob
	 * @param rnd
	 */
	setNoise(target: Target, prob = 0.5, rnd: IRandom = SYSTEM) {
		const [dest, num] = this._getTarget(target);
		const fn =
			target === "prob" ? () => rnd.float() : () => rnd.int() % num;
		for (let x = 0, width = this.width; x < width; x++) {
			if (rnd.probability(prob)) dest[x] = fn();
		}
		return this;
	}

	/**
	 * Computes a single new generation using current cell states and mask only
	 * (no consideration for cell update probabilities, use
	 * {@link MultiCA1D.updateProbabilistic} for that instead). Als see
	 * {@link MultiCA1D.updateImage} for batch updates.
	 */
	update() {
		const { width, gens, configs, mask } = this;
		const [next, curr] = gens;
		for (let x = 0; x < width; x++) {
			next[x] = this.computeCell(configs[mask[x]], x, curr[x]);
		}
		gens.unshift(gens.pop()!);
	}

	/**
	 * Same as {@link MultiCA1D.update}, but also considering cell update
	 * probabilities stored in the {@link MultiCA1D.prob} array.
	 *
	 * @param rnd
	 */
	updateProbabilistic(rnd: IRandom = SYSTEM) {
		const { width, prob, gens, configs, mask } = this;
		const [next, curr] = gens;
		for (let x = 0; x < width; x++) {
			next[x] = rnd.probability(prob[x])
				? this.computeCell(configs[mask[x]], x, curr[x])
				: curr[x];
		}
		gens.unshift(gens.pop()!);
	}

	/**
	 * Computes (but doesn't apply) the new state for a single cell.
	 *
	 * @param config - CA configuration
	 * @param x - cell index
	 * @param val - current cell value
	 */
	computeCell(
		{ rule, kernel, weights, fn }: CAConfig1D,
		x: number,
		val: number
	) {
		const { width, gens, wrap } = this;
		let sum = $0;
		for (let i = 0, n = kernel.length; i < n; i++) {
			const k = kernel[i];
			let xx = x + k[0];
			if (wrap) {
				if (xx < 0) xx += width;
				else if (xx >= width) xx -= width;
			} else if (xx < 0 || xx >= width) continue;
			const y = k[1];
			if (y >= 0 && gens[1 + y][xx] !== 0) sum += weights[i];
		}
		return rule & ($1 << sum) ? fn(val) : 0;
	}

	/**
	 * Batch version of {@link MultiCA1D.update} to compute an entire image of
	 * given `height` (and assumed to be the same width as this CA instance has
	 * been configured to). Fills given `pixels` array with consecutive
	 * generations.
	 *
	 * @remarks
	 * Via the provided options object, per-generation & per-cell perturbance
	 * settings can be provided for cell states, mask and cell update
	 * probabilities. The latter are only considered if the
	 * {@link UpdateImageOpts1D.probabilistic} option is enabled. This can be
	 * helpful to sporadically introduce noise into the sim, break constant
	 * patterns and/or produce more varied/complex outputs.
	 *
	 * See {@link UpdateImageOpts1D} for further options.
	 *
	 * @param pixels
	 * @param height
	 * @param opts
	 */
	updateImage(
		pixels: UIntArray,
		height: number,
		opts: Partial<UpdateImageOpts1D> = {}
	) {
		assert(
			pixels.length >= this.width * height,
			"target pixel buffer too small"
		);
		const {
			probabilistic = false,
			rnd = SYSTEM,
			cells,
			mask,
			prob,
			onupdate,
		} = opts;
		const $ = (id: Target, conf?: Partial<UpdateBufferOpts>) => {
			conf &&
				conf.perturb &&
				rnd.probability(conf.perturb) &&
				this.setNoise(id, conf.density || 0.05, rnd);
		};
		for (let y = 0; y < height; y++) {
			$("cells", cells);
			$("mask", mask);
			$("prob", prob);
			probabilistic ? this.updateProbabilistic(rnd) : this.update();
			onupdate?.(this, y);
			pixels.set(this.current, y * this.width);
		}
	}

	rotate(target: Target | "all", dir: number) {
		if (target === "all") {
			rotateTyped(this.current, dir);
			rotateTyped(this.mask, dir);
			rotateTyped(this.prob, dir);
		} else {
			rotateTyped(this._getTarget(target)[0], dir);
		}
	}

	protected _getTarget(target: Target): [TypedArray, number] {
		return target === "cells"
			? [this.current, this.numStates]
			: target === "mask"
			? [this.mask, this.configs.length]
			: [this.prob, 1];
	}
}

const __compileSpec = ({
	rule,
	kernel,
	positional,
	states,
	reset,
}: CASpec1D) => {
	const max = states - 1;
	return <CAConfig1D>{
		kernel,
		states,
		rule: isBigInt(rule) ? rule : BigInt(rule),
		weights:
			positional !== false
				? kernel.map((_, i) => BigInt(2) ** BigInt(i))
				: [...repeat($1, kernel.length)],
		fn:
			reset !== false
				? (y) => (++y >= states ? 0 : y)
				: (y) => (++y >= max ? max : y),
	};
};

/**
 * Creates a random rule ID for given `kernelSize` and using optionally provided
 * `rnd`
 * [`IRandom`](https://docs.thi.ng/umbrella/random/interfaces/IRandom.html)
 * instance.
 *
 * @param kernelSize
 * @param rnd
 */
export const randomRule1D = (kernelSize: number, rnd: IRandom = SYSTEM) => {
	const n = BigInt(2 ** kernelSize);
	let id = $0;
	for (let i = $0; i < n; i += $32) {
		id <<= $32;
		let mask = n - i;
		if (mask > $32) mask = $32;
		id |= BigInt(rnd.int()) & (($1 << mask) - $1);
	}
	return id;
};
