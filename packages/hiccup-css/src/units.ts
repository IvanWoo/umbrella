export let PRECISION = 4;

/**
 * Sets the number of fractional digits used for formatting various floating
 * point values in the serialized SVG. The current value can be read via
 * {@link PRECISION}.
 *
 * @param n
 */
export const setPrecision = (n: number) => (PRECISION = n);

/** @internal */
export const ff = (x: number) =>
	x === (x | 0)
		? String(x)
		: x
				.toFixed(PRECISION)
				.replace(/^0./, ".")
				.replace(/^-0./, "-.")
				.replace(/0+$/, "");

export const cap = (x: number) => `${ff(x)}cap`;
export const ch = (x: number) => `${ff(x)}ch`;
export const cm = (x: number) => `${ff(x)}cm`;
export const em = (x: number) => `${ff(x)}em`;
export const ex = (x: number) => `${ff(x)}ex`;
export const inch = (x: number) => `${ff(x)}in`;
export const lh = (x: number) => `${ff(x)}lh`;
export const mm = (x: number) => `${ff(x)}mm`;
export const rem = (x: number) => `${ff(x)}rem`;
export const percent = (x: number) => `${ff(x)}%`;
export const px = (x: number) => `${ff(x)}px`;
export const vh = (x: number) => `${ff(x)}vh`;
export const vw = (x: number) => `${ff(x)}vw`;
export const vmin = (x: number) => `${ff(x)}vmin`;
export const vmax = (x: number) => `${ff(x)}vmax`;

export const ms = (x: number) => `${x | 0}ms`;
export const second = (x: number) => `${ff(x)}s`;
/** @deprecated use {@link second} */
export const sec = second;

export const deg = (x: number) => `${ff(x)}deg`;
export const rad = (x: number) => `${ff(x)}rad`;
export const turn = (x: number) => `${ff(x)}turn`;

export const url = (x: string) => `url(${x})`;
