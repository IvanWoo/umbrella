// SPDX-License-Identifier: Apache-2.0
import { sin } from "@thi.ng/dsp";
import {
	asCubic,
	circle,
	group,
	line,
	pathFromCubics,
	star,
	svgDoc,
	withAttribs,
} from "@thi.ng/geom";
import { fromRAF, reactive, Stream, sync } from "@thi.ng/rstream";
import {
	comp,
	iterator,
	map,
	mapcat,
	partition,
	reducer,
	scan,
} from "@thi.ng/transducers";
import { updateDOM } from "@thi.ng/transducers-hdom";

const BUTTONS = {
	blue: "bg-blue white hover-bg-light-blue hover-navy",
	green: "bg-green white hover-bg-light-green hover-dark-green",
};

// HOF event listener to emit a value on given stream
const emitOnStream = (stream: Stream<any>, val: any) => () => stream.next(val);

// button UI component
const button = (
	_: any,
	clazz: string,
	onclick: EventListener,
	label: string
) => [
	"a",
	{
		href: "#",
		onclick,
		class: "dib w4 mr2 pa2 link " + clazz,
	},
	label,
];

// slider UI component
const slider = (
	_: any,
	attribs: any,
	stream: Stream<number>,
	label: string
) => [
	"div.mv3",
	["span.dib.w4.mr2", label],
	[
		"input.mr3",
		{
			type: "range",
			value: stream.deref(),
			oninput: (e: any) => stream.next(parseFloat(e.target.value)),
			...attribs,
		},
	],
	stream.deref()!.toFixed(1),
];

// main app component / stream transformer
// attached to `main` stream sync and responsible to build full UI
// from current stream values
const app =
	(
		_mode: Stream<boolean>,
		_uniform: Stream<boolean>,
		_scale: Stream<number>,
		_uniScale: Stream<number>
	) =>
	({ poly, mode, uniform, scale, uniScale }: any) => {
		// reconstruct poly as cubic curve segments
		// reference: https://github.com/thi-ng/umbrella/tree/develop/packages/geom-splines#polygon-to-cubic-curve-conversion
		const cubics = asCubic(poly, {
			mode: mode ? "break" : "default",
			scale: scale * (uniform ? uniScale : 1),
			uniform,
		});
		// visualize control points as circles
		const controlPoints = iterator(
			comp(
				mapcat((x) => x.points),
				map((p) => circle(p, 0.75))
			),
			cubics
		);
		// visualize control point handles
		const handles = iterator(
			comp(
				mapcat((x) => x.points),
				partition(2),
				map(line)
			),
			cubics
		);
		return [
			"div.sans-serif.ma3",
			// user controls
			[
				"div",
				[
					button,
					BUTTONS.blue,
					emitOnStream(_mode, true),
					mode ? "break points" : "control points",
				],
				[
					button,
					BUTTONS.green,
					emitOnStream(_uniform, true),
					uniform ? "uniform" : "non-uniform",
				],
				[
					slider,
					{ min: -1.3, max: 1.3, step: 0.1 },
					_scale,
					"tangent scale",
				],
				[
					slider,
					{ min: 0, max: 100, step: 1, disabled: !uniform },
					_uniScale,
					"uniform scale",
				],
			],
			[
				"div",
				// all @thi.ng/geom shapes implement the `IToHiccup` interface
				// and so can be used directly in @thi.ng/hdom-canvas
				// visualizations. However, here we're using SVG and hence will
				// need to provide a `__convert` attribute to transform the
				// hiccup format into a hiccup-svg compatible format see:
				// https://docs.thi.ng/umbrella/hiccup-svg/modules.html#convertTree
				svgDoc(
					{
						__convert: true,
						width: 480,
						height: 480,
						viewBox: "-150 -150 300 300",
						stroke: "#ccc",
						"stroke-width": 0.25,
					},
					poly,
					withAttribs(pathFromCubics(cubics), {
						stroke: mode ? "blue" : "red",
						"stroke-width": 1,
					}),
					group({ stroke: "#333" }, [...controlPoints, ...handles])
				),
			],
		];
	};

// stream of animated polygons
const poly = fromRAF().transform(
	map((t) => star(100, 6, [sin(t, 0.01, 0.5, 0.8), 1]))
);

// poly spline mode flag (control points vs break points)
const mode = reactive(false);
// flag for uniform tangent scaling
const uniform = reactive(false);
// tangent scale
const scale = reactive(0.5);
// uniform scale factor (only used if uniform scaling is enabled)
const uniScale = reactive(25);

// re-usable transducer implementing a toggle switch
const toggle = scan(
	reducer(
		() => true,
		(acc) => !acc
	)
);

// main stream combinator
const main = sync({
	src: {
		poly,
		mode: mode.transform(toggle),
		uniform: uniform.transform(toggle),
		scale,
		uniScale,
	},
});

// transform to create & apply UI
main.transform(map(app(mode, uniform, scale, uniScale)), updateDOM());
