// SPDX-License-Identifier: Apache-2.0
import { reactive, syncRAF } from "@thi.ng/rstream";
import { gestureStream, type GestureStream } from "@thi.ng/rstream-gestures";
import { add2, mulN2, type Vec } from "@thi.ng/vectors";
import { DB } from "./atom.js";

/**
 * Compute the currently available canvas size available (window width minus
 * sidebar width)
 */
export const computeCanvasSize = () => [
	// sidebar width = 16rem = 256px
	window.innerWidth - 256,
	window.innerHeight,
];

/**
 * State handler to update the canvas size in the central {@link DB} atom.
 */
export const resizeCanvas = () =>
	DB.resetIn(["canvas", "size"], computeCanvasSize());

/**
 * State handler to update the global canvas background color in the central
 * {@link DB} atom.
 *
 * @param col
 */
export const setCanvasBackground = (col: string) =>
	DB.resetIn(["canvas", "bg"], col);

/**
 * State handler to update the global canvas translation offset in the central
 * {@link DB} atom.
 *
 * @param col
 */
export const setCanvasTranslation = (pos: Vec) =>
	DB.resetIn(["canvas", "translate"], <number[]>pos);

export const resetCanvasView = () => {
	setCanvasTranslation(<number[]>mulN2([], DB.deref().canvas.size, 0.5));
	canvasZoomReset.next(1);
};

export const canvasZoomReset = syncRAF(reactive(1));

export let canvasGestures: GestureStream;

/**
 * Initialize canvas mouse/touch events to translate & zoom the viewport.
 *
 * @param canvas
 */
export const initGestures = (canvas: HTMLCanvasElement) => {
	canvasGestures = gestureStream(canvas, {
		smooth: -0.1,
		zoom: canvasZoomReset,
	});
	canvasGestures.subscribe(
		{
			next(e) {
				switch (e.type) {
					// store current offset at begin of each gesture
					case "start":
						DB.resetIn(
							["canvas", "clickPos"],
							DB.deref().canvas.translate
						);
						break;
					// apply delta offset to stored translation @ gesture start
					case "drag":
						setCanvasTranslation(
							add2(
								[],
								DB.deref().canvas.clickPos!,
								e.active[0].delta!
							)
						);
						break;
					// update scale factor
					case "zoom":
						DB.resetIn(["canvas", "scale"], e.zoom);
						break;
				}
			},
		},
		{ id: "canvasGestures" }
	);
};
