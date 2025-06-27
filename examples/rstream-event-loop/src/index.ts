// SPDX-License-Identifier: Apache-2.0
import { syncRAF } from "@thi.ng/rstream";
import { map } from "@thi.ng/transducers";
import { updateDOM } from "@thi.ng/transducers-hdom";
import { NEXT, PREV, type AppState } from "./api.js";
import { dispatch } from "./events.js";
import { state } from "./state.js";

/**
 * Main/root UI component, receives app state and returns hdom component tree.
 *
 * @param state -
 */
const app = ({ pageID, isLoading }: AppState) =>
	isLoading
		? [
				"div.w-100.vh-100.flex.items-center.justify-center.bg-black.white",
				["div", "Loading..."],
		  ]
		: [
				"div.ma3",
				// delegate to child component
				[page, pageID],
				// navigation buttons w/ event dispatch
				[
					"div",
					[
						"button",
						{
							disabled: pageID < 5,
							onclick: () => dispatch([PREV, 5]),
						},
						"<<",
					],
					[
						"button",
						{
							disabled: pageID === 0,
							onclick: () => dispatch([PREV, 1]),
						},
						"<",
					],
					[
						"button",
						{
							disabled: pageID === 19,
							onclick: () => dispatch([NEXT, 1]),
						},
						">",
					],
					[
						"button",
						{
							disabled: pageID >= 15,
							onclick: () => dispatch([NEXT, 5]),
						},
						">>",
					],
				],
				// only here to show timestamp of last DOM update
				["div.mt3", new Date().toString()],
		  ];

/**
 * Dummy page content.
 *
 * @param _ - hdom user context (unused)
 * @param pageID -
 */
const page = (_: any, pageID: number) => ["h1", `Page: ${pageID}`];

// subscription & transformation of app state stream. uses a RAF
// sidechain to buffer intra-frame state updates. then only passes the
// most recent one to `app()` and its resulting UI tree to the
// `updateDOM()` transducer
syncRAF(state).transform(map(app), updateDOM());
