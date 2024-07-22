import { DGraph } from "@thi.ng/dgraph";
import { files, readJSON, writeText } from "@thi.ng/file-io";
import { serialize } from "@thi.ng/hiccup";
import { group, text } from "@thi.ng/hiccup-svg";
import {
	comp,
	map,
	mapcat,
	mapIndexed,
	max,
	pluck,
	push,
	reducer,
	repeat,
	transduce,
	zip,
} from "@thi.ng/transducers";
import { barChart, labeledTickX, labeledTickY } from "./viz.js";

const BASE_DIR = "../../packages";

const packages: { id: string; v: string; deps: string[] }[] = transduce(
	comp(
		map(readJSON),
		map((p) => ({
			id: p.name,
			v: p.version,
			deps: p.dependencies ? Object.keys(p.dependencies) : [],
		}))
	),
	push(),
	files(BASE_DIR, "package.json", 2)
);

const graph = transduce(
	mapcat((p: any) => zip(repeat(p.id), p.deps)),
	reducer(
		() => new DGraph<any>(),
		(g, [p, d]: any) => g.addDependency(p, d)
	),
	packages
);

const packageDeps = packages
	.map((p: any) => [p.id, graph.transitiveDependents(p.id).size])
	.sort((a, b) => b[1] - a[1]);

const maxDeps = transduce<any, number, number>(pluck(1), max(), packageDeps);

const width = packages.length * 16;

writeText(
	`package-deps.svg`,
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
				axis: [50, width - 15, 170],
				domain: [0, packageDeps.length, 1],
				range: [50, width - 5],
				ticks: [...map((x) => x[0].substring(8), packageDeps)],
				label: labeledTickX,
			},
			y: {
				axis: [170, 10, 35],
				domain: [0, maxDeps, 20],
				range: [160, 20],
				label: labeledTickY(width - 15),
			},
			axis: "#666",
			fill: "#0cc",
		},
		mapIndexed((i, m) => [i, m[1]], packageDeps),
		group(
			{ "font-size": "20px", "text-anchor": "middle" },
			text([width / 2 + 25, 28], "@thi.ng/umbrella internal re-use"),
			text([width / 2 + 25, 56], "(transitive dependents)")
		),
	])
);
