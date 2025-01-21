// SPDX-License-Identifier: Apache-2.0
import {
	subscription,
	sync,
	syncRAF,
	type ISubscribable,
	type ISubscriber,
} from "@thi.ng/rstream";
import { autoObj, map, reducer, scan, vals } from "@thi.ng/transducers";
import { updateDOM } from "@thi.ng/transducers-hdom";

// example user context object
// here only used to provide style / theme config using
// Tachyons CSS classes
const ctx = {
	ui: {
		root: {
			class: "pa2",
		},
		button: {
			class: "w4 h2 bg-black white bn br2 mr2 pointer",
		},
	},
};

/**
 * Takes a `root` DOM element, a stream of `tree` component values and
 * an (optional) arbitrary user context object which will be implicitly
 * passed to all component functions embedded in the root component.
 * Subscribes to `root` stream & performs DOM diffs / updates using
 * incoming values (i.e. UI components). Additionally, a RAF side chain
 * stream is used here to synchronize DOM update requests to be only
 * processed during RAF. If multiple updates are triggered per frame,
 * this also ensures that the DOM is only updated once per frame.
 *
 * Without RAF synchronization, the following would be sufficient:
 *
 * ```
 * root.transform(updateDOM({root, ctx}))
 * ```
 *
 * Returns stream of hdom trees.
 *
 * @param root - oot DOM element
 * @param tree - dom component stream
 * @param ctx - ser context object
 */
const domUpdate = (root: HTMLElement, tree: ISubscribable<any>, ctx?: any) =>
	syncRAF(tree).transform(updateDOM({ root, ctx }));

/**
 * Generic button component.
 *
 * @param ctx - dom user context
 * @param onclick - vent handler
 * @param body - utton body
 */
const button = (ctx: any, onclick: EventListener, body: any) => [
	"button",
	{ ...ctx.ui.button, onclick },
	body,
];

/**
 * Specialized button component for counters.
 *
 * @param _ - dom user context (unused)
 * @param stream - ounter stream
 */
const clickButton = (_: any, stream: ISubscriber<boolean>) => [
	button,
	() => stream.next(true),
	stream.deref(),
];

/**
 * Specialized button to reset all counters.
 *
 * @param _ - dom user context (unused)
 * @param counters - treams to reset
 */
const resetButton = (_: any, counters: ISubscriber<boolean>[]) => [
	button,
	() => counters.forEach((c) => c.next(false)),
	"reset",
];

/**
 * Creates a stream of counter values. Each time `true` is written to
 * the stream, the counter increases by given step value. If false is
 * written, the counter resets to the `start` value.
 *
 * @param start -
 * @param step -
 */
const counter = (start: number, step: number) => {
	const s = subscription<boolean, number>(
		undefined,
		// the `scan` transducer is used to provide counter functionality
		// see: https://docs.thi.ng/umbrella/transducers/modules.html#scan
		{
			xform: scan(
				reducer(
					() => start,
					(x, y) => (y ? x + step : start)
				)
			),
		}
	);
	s.next(false);
	return s;
};

/**
 * Root component stream factory. Accepts array of initial counter
 * values and their step values, creates streams for each and returns a
 * StreamSync instance, which merges and converts these streams into a
 * single component.
 *
 * @param initial - nitial counter configs
 */
const app = (ctx: any, initial: number[][]) => {
	const counters = initial.map(([start, step]) => counter(start, step));
	return sync({
		src: autoObj(
			"",
			counters.map((c) => c.transform(map(() => [clickButton, c])))
		),
		xform: map(
			// build the app's actual root component
			(buttons) => [
				"div",
				ctx.ui.root,
				...vals(buttons),
				[resetButton, counters],
			]
		),
		// this config ensures that only at the very beginning *all*
		// inputs must have delivered a value (i.e. stream
		// synchronization) before this stream itself delivers a value.
		// however, by stating `reset: false` (actually the default) any
		// subsequent changes to any of the inputs will not be
		// synchronized see here for further details:
		// https://docs.thi.ng/umbrella/rstream/interfaces/StreamSyncOpts.html
		// https://docs.thi.ng/umbrella/transducers/modules.html#partitionSync
		reset: false,
	});
};

// start app & DOM updates
domUpdate(
	document.getElementById("app")!,
	app(ctx, [
		[10, 1],
		[20, 5],
		[30, 10],
	]),
	ctx
);
