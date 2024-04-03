import type { SortOpts, Transducer } from "./api.js";
import { comp } from "./comp.js";
import { __sortOpts } from "./internal/sort-opts.js";
import { __iter } from "./iterator.js";
import { map } from "./map.js";
import { partition } from "./partition.js";

/**
 * Transducer. Similar to {@link movingAverage}, but yields median of sliding
 * window and supports non-numeric inputs.
 *
 * @remarks
 * The optional `key` and `cmp` function options can be used to select / compute
 * a sortable value and change sorting behavior.
 *
 * @param n - window size
 * @param opts -
 */
export function movingMedian<A, B>(
	n: number,
	opts?: Partial<SortOpts<A, B>>
): Transducer<A, A>;
export function movingMedian<A, B>(
	n: number,
	src: Iterable<A>
): IterableIterator<A>;
export function movingMedian<A, B>(
	n: number,
	opts: Partial<SortOpts<A, B>>,
	src: Iterable<A>
): IterableIterator<A>;
export function movingMedian<A, B>(...args: any[]): any {
	const iter = __iter(movingMedian, args);
	if (iter) return iter;

	const { key, compare } = __sortOpts<A, B>(args[1]);
	const n = args[0];
	const m = n >> 1;
	return comp(
		partition<A>(n, 1, true),
		map(
			(window: A[]) =>
				window.slice().sort((a, b) => compare(key(a), key(b)))[m]
		)
	);
}
