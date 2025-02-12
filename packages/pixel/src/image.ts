// SPDX-License-Identifier: Apache-2.0
import {
	canvas2d,
	type Canvas2DOpts,
	type CanvasContext,
} from "@thi.ng/canvas";
import { isNumber } from "@thi.ng/checks/is-number";

/**
 * Creates canvas for given image and draws image, optionally with given
 * new size. If no width/height is given, the canvas will be of same
 * size as image. If `parent` is given, the canvas is appended to it as
 * child.
 *
 * @param img -
 * @param width -
 * @param height -
 * @param parent -
 */
export const imageCanvas = (
	img: HTMLImageElement,
	width?: number,
	height = width,
	parent?: HTMLElement,
	opts?: Partial<Canvas2DOpts>
): CanvasContext => {
	const ctx =
		isNumber(width) && isNumber(height)
			? canvas2d(width, height, parent, opts)
			: canvas2d(img.width, img.height, parent, opts);
	ctx.ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
	return ctx;
};

/**
 * Async function. Loads image from given `src` URL. By default, the image will
 * have its `crossorigin` HTML attribute set to 'anonymous' to avoid errors with
 * tainted image data in canvas elements. Can be reconfigured via optional
 * `cors` arg.
 *
 * @remarks
 * References:
 *
 * - https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin
 * - https://stackoverflow.com/a/55136314/294515
 *
 * Also see {@link imageFromFile} to load from local file.
 *
 * @param src -
 * @param cors -
 */
export const imageFromURL = async (src: string, cors = "anonymous") => {
	const img = new Image();
	img.crossOrigin = cors;
	img.src = src;
	await img.decode();
	return img;
};

/**
 * @deprecated renamed to {@link imageFromURL}
 */
export const imagePromise = imageFromURL;

/**
 * Async function. Loads image from given `file` via the FileReader Web API,
 * e.g. as part of a drag & drop workflow.
 *
 * @remarks
 * See {@link imageFromURL} for loading an image via URL.
 *
 * @param file
 */
export const imageFromFile = (file: File) =>
	new Promise<HTMLImageElement>((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			const img = new Image();
			img.src = <string>(<FileReader>e.target).result;
			img.onload = () => resolve(img);
			img.onerror = (e) => reject(e);
		};
		reader.readAsDataURL(file);
	});
