import { downloadWithMime } from "@thi.ng/dl-asset";
import { dropdown } from "@thi.ng/hdom-components";
import {
	fromIterable,
	fromRAF,
	reactive,
	sidechainTrigger,
	stream,
	sync,
} from "@thi.ng/rstream";
import {
	buildKernel1d,
	comp,
	convolve1d,
	filter,
	flatten,
	iterator1,
	lookup1d,
	map,
	range,
	range2d,
	reducer,
	scan,
	sideEffect,
	slidingWindow,
	str,
	transduce,
	zip,
} from "@thi.ng/transducers";
import { bits, randomBits } from "@thi.ng/transducers-binary";
import { updateDOM } from "@thi.ng/transducers-hdom";

const WIDTH = 160;
const HEIGHT = 32;

const resetCA = () => [...randomBits(0.25, WIDTH)];

const evolveCA = (src: number[], { kernel, rule, reset }: any) =>
	reset
		? resetCA()
		: [
				...iterator1(
					comp(
						convolve1d({
							src,
							kernel,
							width: src.length,
							wrap: true,
						}),
						map(lookup1d(<number[]>rule))
					),
					range(src.length)
				),
		  ];

const triggerReset = () =>
	wolfram.add(fromIterable([true, false], { delay: 16 }), "reset");

const triggerOBJExport = () => objExport.next(1);

const setRule = (e: Event) => {
	rule.next(parseInt((<HTMLInputElement>e.target).value));
	triggerReset();
};

const setKernel = (e: Event) =>
	kernel.next(parseInt((<HTMLInputElement>e.target).value));

const app = ({ id, ksize, sim }: any) => [
	"div.sans-serif.ma3",
	[
		"div",
		"Rule:",
		[
			"input.w4.h2.mh3.pa2",
			{
				type: "number",
				value: id,
				oninput: setRule,
			},
		],
		"Kernel:",
		[
			dropdown,
			{ class: "h2 pa2 mh3", onchange: setKernel },
			[
				[3, "3"],
				[5, "5"],
			],
			ksize,
		],
		[
			"button.mr3.pa2",
			{
				onclick: triggerReset,
			},
			"Reset",
		],
		[
			"button.mr3.pa2",
			{
				onclick: triggerOBJExport,
			},
			"Export OBJ",
		],
		[
			"a.link.blue",
			{
				href: "https://en.wikipedia.org/wiki/Elementary_cellular_automaton#Random_initial_state",
			},
			"Wikipedia",
		],
	],
	["pre.f7.code", sim],
];

const rule = reactive(105);
const kernel = reactive(3);
const objExport = stream<number>();

const wolfram = sync<any, any>({
	src: {
		rule: rule.transform(map((x) => [...bits(32, false, [x])])),
		kernel: kernel.transform(
			map((x) => buildKernel1d([1, 2, 4, 8, 16], x))
		),
		_: fromRAF(),
	},
	xform: scan(reducer<any, number[]>(resetCA, evolveCA)),
});

sync({
	src: {
		id: rule,
		ksize: kernel,
		sim: wolfram.transform(
			map((gen) => gen.map((x: number) => " █"[x]).join("")),
			slidingWindow(HEIGHT),
			map((win: string[]) => win.join("\n"))
		),
	},
}).transform(map(app), updateDOM());

// Wavefront OBJ 3D pointcloud export attached as second subscription to wolfram
// stream, uses `objExport` stream as trigger to produce OBJ file and trigger
// download
sidechainTrigger(
	wolfram
		// always collect new generations
		// history length same as WIDTH to export square area
		.transform(slidingWindow(WIDTH)),
	objExport
)
	// actual OBJ conversion & export
	.subscribe(
		{
			next(obj) {
				downloadWithMime(`ca-${rule.deref()}.obj`, obj, {
					mime: "model/obj",
				});
			},
		},
		{
			xform: map((grid: any[]) =>
				transduce(
					comp(
						filter((t) => !!t[1]),
						map(([[x, y]]) => `v ${x} ${y} 0`)
					),
					str("\n"),
					zip(range2d(WIDTH, WIDTH), flatten<number[]>(grid))
				)
			),
		}
	);
