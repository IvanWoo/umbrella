import { adaptDPI } from "@thi.ng/canvas";
import { isString } from "@thi.ng/checks/is-string";
import type { ReadonlyVec } from "@thi.ng/vectors";
import type { WeblGLCanvasOpts } from "./api/canvas.js";
import type { WebGLExtensionMap } from "./api/ext.js";
import { error } from "./error.js";

/** @internal */
const DEFAULT_OPTS: WebGLContextAttributes = {
	alpha: true,
	antialias: true,
	depth: true,
	premultipliedAlpha: true,
	preserveDrawingBuffer: false,
	stencil: false,
};

export const glCanvas = (opts: Partial<WeblGLCanvasOpts> = {}) => {
	const canvas = opts.canvas
		? isString(opts.canvas)
			? <HTMLCanvasElement>document.getElementById(opts.canvas)
			: opts.canvas
		: document.createElement("canvas");
	opts.width && (canvas.width = opts.width);
	opts.height && (canvas.height = opts.height);
	opts.autoScale !== false && adaptDPI(canvas, canvas.width, canvas.height);
	opts.parent && opts.parent.appendChild(canvas);
	const gl = <WebGLRenderingContext>canvas.getContext(
		opts.version !== 1 ? "webgl2" : "webgl",
		{
			...DEFAULT_OPTS,
			...opts.opts,
		}
	);
	if (!gl) {
		error("WebGL unavailable");
	}
	opts.onContextLost &&
		canvas.addEventListener("webglcontextlost", opts.onContextLost);
	return {
		canvas,
		gl,
		ext: getExtensions(gl, opts.ext!),
		resize: (width: number, height: number) => {
			adaptDPI(
				canvas,
				width,
				height,
				opts.autoScale !== false ? window.devicePixelRatio : 1
			);
			gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
		},
	};
};

export const getExtensions = <K extends keyof WebGLExtensionMap>(
	gl: WebGLRenderingContext,
	ids: K[],
	required = true
): Pick<WebGLExtensionMap, K> => {
	const ext: any = {};
	if (ids) {
		for (let id of ids) {
			ext[id] = gl.getExtension(id);
			required && !ext[id] && error(`extension ${id} not available`);
		}
	}
	return ext;
};

/**
 * Sets clear color to given RGB(A) `color` and clears viewport's
 * `COLOR_BUFFER_BIT` and (by default) also `DEPTH_BUFFER_BIT`.
 *
 * @remarks
 * If the given color vector only contains RGB values, alpha will default to
 * 1.0.
 *
 * @param gl
 * @param color
 * @param depth
 */
export const clearCanvas = (
	gl: WebGLRenderingContext,
	[r, g, b, a]: ReadonlyVec,
	depth = true
) => {
	gl.clearColor(r, g, b, a != null ? a : 1);
	gl.clear(gl.COLOR_BUFFER_BIT | (depth ? gl.DEPTH_BUFFER_BIT : 0));
};

/**
 * Resets viewport to full drawing buffer size.
 *
 * @param gl
 */
export const defaultViewport = (gl: WebGLRenderingContext) =>
	gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
