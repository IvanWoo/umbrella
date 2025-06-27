// SPDX-License-Identifier: Apache-2.0
import type { IObjectOf } from "@thi.ng/api";
import { lch, type ColorRangePreset, type ColorThemePart } from "@thi.ng/color";
import type { ISubscribable, ISubscriber } from "@thi.ng/rstream";
import { NUM_STATE_TOKENS, type MainOutputs } from "./api.js";

export const initFromHash = (
	parts: IObjectOf<ISubscriber<ColorThemePart>>,
	seed: ISubscriber<number>,
	num: ISubscriber<number>,
	variance: ISubscriber<number>
) => {
	// attempt to restore state from hash fragment
	if (location.hash.length > 1) {
		const tokens = window.atob(location.hash.substring(1)).split("|");
		if (tokens.length === NUM_STATE_TOKENS) {
			seed.next(parseInt(tokens[0]));
			num.next(parseInt(tokens[1]));
			variance.next(parseFloat(tokens[2]));
			for (let i = 3, j = 0; j < 4; i += 3, j++) {
				parts[j].next({
					range: <ColorRangePreset>tokens[i],
					base: lch(JSON.parse(tokens[i + 1])),
					weight: parseFloat(tokens[i + 2]),
				});
			}
		}
	}
};

/**
 * Attaches subscription to store current config base64 encoded in hash fragment
 *
 * @param parent -
 */
export const attachSerializer = (parent: ISubscribable<MainOutputs>) =>
	parent.subscribe({
		next({ parts, num, variance, seed }) {
			const res = [
				seed,
				num,
				variance,
				...Object.values(parts).map(
					(p) => `${p.range}|${p.base}|${p.weight}`
				),
			].join("|");
			location.hash = btoa(res);
		},
	});
