// SPDX-License-Identifier: Apache-2.0
import { dirs, readJSON, writeJSON, writeText } from "@thi.ng/file-io";
import { serialize } from "@thi.ng/hiccup";
import { group, text } from "@thi.ng/hiccup-svg";
import { defGetterUnsafe } from "@thi.ng/paths";
import { bytes } from "@thi.ng/strings";
import {
	comp,
	filter,
	map,
	mapIndexed,
	max,
	push,
	transduce,
} from "@thi.ng/transducers";
import { existsSync } from "node:fs";
import { barChart, labeledTickX, labeledTickY } from "./viz.js";

const BASE_DIR = "../../packages";

const IGNORE_PACKAGES = new Set(["hiccup-carbon-icons"]);

const shortName = (x: string) => x.substring(x.lastIndexOf("/") + 1);

const meta = transduce(
	comp(
		filter((x) => !IGNORE_PACKAGES.has(shortName(x))),
		map((m: string) => [shortName(m), m + "/.meta/size.json"]),
		filter(([_, path]) => existsSync(path)),
		map(([m, path]) => [m, readJSON(path)])
	),
	push(),
	dirs(BASE_DIR, "", 1)
);

writeJSON(
	`../../dev/package-sizes-${new Date().toISOString().substring(0, 10)}.json`,
	meta
);
console.log(meta.length);

const fileSizeChart = (stats: any, modType: string, type: string) => {
	const get = defGetterUnsafe([1, modType, type]);
	stats = [...stats].sort((a, b) => get(b) - get(a));

	const width = stats.length * 16;

	const maxSize = transduce(
		map(([_, m]) => m.esm[type]),
		max(),
		stats
	);

	writeText(
		`export/package-sizes-${modType}.svg`,
		serialize([
			barChart,
			{
				attribs: {
					width: width,
					height: 260,
					"font-size": "10px",
					"font-family": "Iosevka-Term-Light, Menlo, sans-serif",
				},
				x: {
					axis: [80, width - 15, 170],
					domain: [0, stats.length, 1],
					range: [80, width - 5],
					ticks: [...map((x: any) => x[0], stats)],
					label: labeledTickX,
				},
				y: {
					axis: [170, 10, 65],
					domain: [0, maxSize, 5 * 1024],
					range: [160, 20],
					label: labeledTickY(width - 15, bytes),
				},
				axis: "#666",
				fill: "#0cc",
			},
			mapIndexed((i, m) => [i, get(m)], stats),
			group(
				{ "font-size": "20px", "text-anchor": "middle" },
				text(
					[width / 2 + 40, 28],
					`@thi.ng/umbrella package sizes (${modType.toUpperCase()})`
				),
				text([width / 2 + 40, 56], `(minified + brotli)`)
			),
		])
	);
};

fileSizeChart(meta, "esm", "brotli");
// fileSizeChart(meta, "cjs", "gzip");
// fileSizeChart(meta, "umd", "gzip");
