import { binarySearch } from "@thi.ng/arrays/binary-search";
import type { Reducer, SortOpts, Transducer } from "./api.js";
import { __drain } from "./internal/drain.js";
import { __sortOpts } from "./internal/sort-opts.js";
import { __iter, iterator } from "./iterator.js";

/**
 * Transducer. Similar to {@link partitionSort}, however uses a sliding window
 * of size `n` and insertion sort instead of fully sorting window as done by
 * `partitionSort`.
 *
 * @example
 * ```ts tangle:../export/stream-sort.ts
 * import { streamSort } from "@thi.ng/transducers";
 *
 * console.log(
 *   [...streamSort(4, [5,9,2,6,4,1,3,8,7,0])]
 * );
 * // [ 2, 4, 1, 3, 5, 6, 0, 7, 8, 9 ]
 * ```
 *
 * @param n -
 * @param opts -
 */
export function streamSort<A, B>(
	n: number,
	opts?: Partial<SortOpts<A, B>>
): Transducer<A, A>;
export function streamSort<A, B>(
	n: number,
	src: Iterable<A>
): IterableIterator<A>;
export function streamSort<A, B>(
	n: number,
	opts: Partial<SortOpts<A, B>>,
	src: Iterable<A>
): IterableIterator<A>;
export function streamSort<A, B>(...args: any[]): any {
	const iter = __iter(streamSort, args, iterator);
	if (iter) {
		return iter;
	}
	const { key, compare } = __sortOpts<A, B>(args[1]);
	const n = args[0];
	return ([init, complete, reduce]: Reducer<A, any>) => {
		const buf: A[] = [];
		return <Reducer<A, any>>[
			init,
			__drain(buf, complete, reduce),
			(acc, x) => {
				const idx = binarySearch(buf, x, key, compare);
				buf.splice(idx < 0 ? -(idx + 1) : idx, 0, x);
				if (buf.length === n) {
					acc = reduce(acc, buf.shift()!);
				}
				return acc;
			},
		];
	};
}
