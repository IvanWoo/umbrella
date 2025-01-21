// SPDX-License-Identifier: Apache-2.0
import { lch, rgb, type LCH } from "@thi.ng/color";
import { rect } from "@thi.ng/hiccup-svg";
import { Z3 } from "@thi.ng/strings";
import { comp, filter, iterator, map, normRange2d } from "@thi.ng/transducers";
import { writeSVG } from "./write.js";

const isValidRgb = (lch: LCH) => {
	const [r, g, b] = rgb(lch);
	return r >= 0 && r <= 1 && g >= 0 && g <= 1 && b >= 0 && b <= 1;
};

const luminanceSlice = (lum: number, n = 100) => [
	...iterator(
		comp(
			map(([c, h]) => lch(lum, c * 1.31, h)),
			filter(isValidRgb),
			map((lch) =>
				rect([lch[2] * 100, (lch[1] * 100) / 1.31], 100 / n, 100 / n, {
					fill: lch,
				})
			)
		),
		normRange2d(n, n)
	),
];

const svgSlice = (i: number, lum: number, n?: number) =>
	writeSVG(
		`export/lslice-${Z3(i)}.svg`,
		{ width: 600, height: 600, viewBox: "0 0 100 100" },
		...luminanceSlice(lum, n)
	);

for (let i = 0; i < 100; i++) svgSlice(i, i / 100, 200);
