import type { ISeq, Maybe, Nullable } from "@thi.ng/api";

/**
 * Returns a zero-copy
 * [`ISeq`](https://docs.thi.ng/umbrella/api/interfaces/ISeq.html) for the given
 * array and optionally for defined index range only.
 *
 * @remarks
 * If given, `start` MUST be < `end`. The latter defaults to the end of the
 * array (`.length`). Also see
 * [`arrayIterator()`](https://docs.thi.ng/umbrella/arrays/functions/arrayIterator.html)
 * for related functionality.
 *
 * @param buf - array
 * @param start - start index
 * @param end - end index (excluded)
 */
export const aseq = <T>(
	buf: Nullable<ArrayLike<T>>,
	start = 0,
	end?: number
): Maybe<ISeq<T>> => {
	if (!buf) return;
	end === undefined && (end = buf.length);
	return start < end!
		? {
				first() {
					return buf[start];
				},
				next() {
					return aseq<T>(buf, start + 1, end);
				},
		  }
		: undefined;
};

/**
 * Similar to {@link aseq}, returns a zero-copy
 * [`ISeq`](https://docs.thi.ng/umbrella/api/interfaces/ISeq.html) for the given
 * array, though in reverse order and optionally for defined index range only.
 *
 * @remarks
 * If given, `start` MUST be > `end`. The latter defaults to beginning of the
 * array (-1). Also see
 * [`arrayIterator()`](https://docs.thi.ng/umbrella/arrays/functions/arrayIterator.html)
 * for related functionality.
 *
 * @param buf - array
 * @param start - start index
 * @param end - end index (excluded)
 */
export const rseq = <T>(
	buf: Nullable<ArrayLike<T>>,
	start?: number,
	end = -1
): Maybe<ISeq<T>> => {
	if (!buf) return;
	start === undefined && (start = buf.length - 1);
	return start > end
		? {
				first() {
					return buf[start!];
				},
				next() {
					return rseq<T>(buf, start! - 1, end);
				},
		  }
		: undefined;
};
