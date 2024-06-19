import { isNumber } from "@thi.ng/checks/is-number";
import type {
	ReadonlyVec,
	Vec,
	VecOpVN,
	VecOpVV,
	VecOpVVN,
	VecOpVVV,
} from "./api.js";

/**
 * Takes a vec op `fn`, output array (or null) and a combination of the
 * following inputs:
 *
 * - 2 arrays of vectors
 * - 1 array of vectors & 1 scalar
 * - 3 arrays of vectors
 * - 2 arrays of vectors & 1 scalar
 *
 * Then applies `fn` to each input and writes result into output array,
 * returns `out` (or new array if `out` was given as null).
 *
 * @example
 * ```ts
 * import { addN2, mapVectors, mixN2 } from "@thi.ng/vectors";
 *
 * mapVectors(addN2, [], [[1, 2], [10, 20]], 100)
 * // [ [ 101, 102 ], [ 110, 120 ] ]
 *
 * mapVectors(add2, [], [[1, 2], [10, 20]], [[100, 200], [1000, 2000]])
 * // [ [ 101, 202 ], [ 1010, 2020 ] ]
 *
 * mapVectors(mixN2, null, [[1, 2], [100, 200]], [[10, 20], [1000, 2000]], 0.5)
 * // [ [ 5.5, 11 ], [ 550, 1100 ] ]
 * ```
 *
 * @param fn -
 * @param out -
 * @param a -
 * @param b -
 * @param c -
 */
export function mapVectors(
	fn: VecOpVV,
	out: Vec[] | null,
	a: ReadonlyVec[],
	b: ReadonlyVec[]
): Vec[];
export function mapVectors(
	fn: VecOpVN,
	out: Vec[] | null,
	a: ReadonlyVec[],
	n: number
): Vec[];
export function mapVectors(
	fn: VecOpVVV,
	out: Vec[] | null,
	a: ReadonlyVec[],
	b: ReadonlyVec[],
	c: ReadonlyVec[]
): Vec[];
export function mapVectors(
	fn: VecOpVVN,
	out: Vec[] | null,
	a: ReadonlyVec[],
	b: ReadonlyVec[],
	c: number
): Vec[];
export function mapVectors(
	fn: VecOpVV | VecOpVN | VecOpVVV | VecOpVVN,
	out: Vec[] | null,
	a: ReadonlyVec[],
	b: ReadonlyVec[] | number,
	c?: ReadonlyVec[] | number
): Vec[] {
	const num = a.length;
	!out && (out = new Array(num));
	c !== undefined
		? isNumber(c)
			? __mapVVN(<VecOpVVN>fn, out, a, <ReadonlyVec[]>b, c)
			: __mapVVV(<VecOpVVV>fn, out, a, <ReadonlyVec[]>b, c)
		: isNumber(b)
		? __mapVN(<VecOpVN>fn, out, a, b)
		: __mapVV(<VecOpVV>fn, out, a, b);
	return out;
}

/** @internal */
const __mapVN = (fn: VecOpVN, out: Vec[], a: ReadonlyVec[], b: number) => {
	for (let i = 0, num = a.length; i < num; i++) {
		out[i] = fn(out[i] || [], a[i], b);
	}
};

/** @internal */
const __mapVV = (
	fn: VecOpVV,
	out: Vec[],
	a: ReadonlyVec[],
	b: ReadonlyVec[]
) => {
	for (let i = 0, num = a.length; i < num; i++) {
		out[i] = fn(out[i] || [], a[i], b[i]);
	}
};

/** @internal */
const __mapVVN = (
	fn: VecOpVVN,
	out: Vec[],
	a: ReadonlyVec[],
	b: ReadonlyVec[],
	c: number
) => {
	for (let i = 0, num = a.length; i < num; i++) {
		out[i] = fn(out[i] || [], a[i], b[i], c);
	}
};

/** @internal */
const __mapVVV = (
	fn: VecOpVVV,
	out: Vec[],
	a: ReadonlyVec[],
	b: ReadonlyVec[],
	c: ReadonlyVec[]
) => {
	for (let i = 0, num = a.length; i < num; i++) {
		out[i] = fn(out[i] || [], a[i], b[i], c[i]);
	}
};
