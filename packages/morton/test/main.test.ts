// SPDX-License-Identifier: Apache-2.0
import { expect, test } from "bun:test";
import {
	cartesianToTree,
	mortonToTree,
	treeToCartesian,
	treeToMorton,
} from "../src/index.js";

test(
	"tree <> cartesian3 fuzz",
	() => {
		const M = 1 << 11;
		const $ = () => (1 + Math.random() * M) | 0;
		for (let i = 0; i < 1e5; i++) {
			const p = [$(), $(), $()];
			const tree = cartesianToTree(p);
			const morton = treeToMorton(tree, 3);
			expect(mortonToTree(morton, 3)).toEqual(tree);
			expect(treeToCartesian(tree, 3)).toEqual(p);
		}
	},
	{
		timeout: 10000,
	}
);
