// thing:export
import type { Fn, Fn2, FnN, UIntArray } from "@thi.ng/api";
import { isNumber } from "@thi.ng/checks/is-number";
import { clamp } from "@thi.ng/math/interval";
import type {
	BlitCanvasOpts,
	BlitOpts,
	IntFormat,
	IPixelBuffer,
	IToImageData,
} from "../api.js";

export const __luminanceABGR: FnN = (c) =>
	(((c >>> 16) & 0xff) * 29 + ((c >>> 8) & 0xff) * 150 + (c & 0xff) * 76) /
	255;

/** @internal */
export const __clampRegion = (
	sx: number,
	sy: number,
	w: number,
	h: number,
	maxw: number,
	maxh: number,
	dx = 0,
	dy = 0
) => {
	sx |= 0;
	sy |= 0;
	w |= 0;
	h |= 0;
	sx < 0 && ((w += sx), (dx -= sx), (sx = 0));
	sy < 0 && ((h += sy), (dy -= sy), (sy = 0));
	return [sx, sy, clamp(w, 0, maxw - sx), clamp(h, 0, maxh - sy), dx, dy];
};

/** @internal */
export const __prepRegions = (
	src: { width: number; height: number },
	dest: { width: number; height: number },
	opts: Partial<BlitOpts> = {}
) => {
	const sw = src.width;
	const dw = dest.width;
	let sx: number, sy: number;
	let dx: number, dy: number;
	let rw: number, rh: number;
	[sx, sy, rw, rh] = __clampRegion(
		opts.sx || 0,
		opts.sy || 0,
		opts.w || sw,
		opts.h || src.height,
		sw,
		src.height
	);
	[dx, dy, rw, rh, sx, sy] = __clampRegion(
		opts.dx || 0,
		opts.dy || 0,
		rw,
		rh,
		dw,
		dest.height,
		sx,
		sy
	);
	return { sx, sy, dx, dy, rw, rh };
};

/** @internal */
export const __setChannelUni = (
	dbuf: UIntArray,
	src: number,
	set: Fn2<number, number, number>
) => {
	for (let i = dbuf.length; i-- > 0; ) {
		dbuf[i] = set(dbuf[i], src);
	}
};

/** @internal */
export const __setChannelSame = (
	dbuf: UIntArray,
	sbuf: UIntArray,
	get: Fn<number, number>,
	set: Fn2<number, number, number>
) => {
	for (let i = dbuf.length; i-- > 0; ) {
		dbuf[i] = set(dbuf[i], get(sbuf[i]));
	}
};

/** @internal */
export const __setChannelConvert = (
	dbuf: UIntArray,
	sbuf: UIntArray,
	from: Fn<number, number>,
	sto: Fn<number, number>,
	mask: number
) => {
	const invMask = ~mask;
	for (let i = dbuf.length; i-- > 0; ) {
		dbuf[i] = (dbuf[i] & invMask) | (from(sto(sbuf[i])) & mask);
	}
};

export const __transformABGR = (
	pix: UIntArray,
	format: IntFormat,
	fn: Fn<number, number>
) => {
	const from = format.fromABGR;
	const to = format.toABGR;
	for (let i = pix.length; i-- > 0; ) {
		pix[i] = from(fn(to(pix[i])));
	}
};

/** @internal */
export const __asVec = (x: number | [number, number]) =>
	isNumber(x) ? [x, x] : x;

/** @internal */
export const __asIntVec = (x: number | [number, number]) => {
	const v = __asVec(x);
	return [v[0] | 0, v[1] | 0];
};

/**
 * Swaps bytes lanes 1 & 3 (i.e. bits 16-23 with bits 0-7)
 *
 * @remarks
 * Extracted from thi.ng/binary to avoid dependency
 *
 * @param x -
 *
 * @internal
 */
export const __swapLane13: FnN = (x) =>
	((x & 0xff) << 16) | ((x >> 16) & 0xff) | (x & 0xff00ff00);

/**
 * Shared implementation for {@link IBlit.blitCanvas}.
 *
 * @internal
 */
export const __blitCanvas = (
	buf: IPixelBuffer & IToImageData,
	canvas:
		| HTMLCanvasElement
		| CanvasRenderingContext2D
		| OffscreenCanvas
		| OffscreenCanvasRenderingContext2D,
	opts: Partial<BlitCanvasOpts> = {}
) =>
	(canvas instanceof HTMLCanvasElement || canvas instanceof OffscreenCanvas
		? canvas.getContext("2d")!
		: canvas
	).putImageData(buf.toImageData(opts.data), opts.x || 0, opts.y || 0);
