import type {
	Comparator,
	IClear,
	ICopy,
	IEmpty,
	IInto,
	ILength,
	IStack,
	Maybe,
	Predicate,
	Predicate2,
} from "@thi.ng/api";
import { compare } from "@thi.ng/compare/compare";
import { equiv } from "@thi.ng/equiv";
import type { HeapOpts } from "./api.js";

/**
 * Functional syntax sugar for {@link Heap} constructor.
 *
 * @param values
 * @param opts
 */
export const defHeap = <T>(
	values?: Iterable<T> | null,
	opts?: Partial<HeapOpts<T>>
) => new Heap(values, opts);

/**
 * Generic binary heap / priority queue with customizable ordering via
 * user-supplied comparator. By default, implements min-heap ordering
 * and uses @thi.ng/compare.
 *
 * @example
 * ```ts tangle:../export/heap.ts
 * import { Heap } from "@thi.ng/heaps";
 *
 * const h = new Heap([20, 5, 10]);
 * h.push(15);
 *
 * console.log(h.pop()); // 5
 * console.log(h.pop()); // 10
 * console.log(h.pop()); // 15
 * console.log(h.pop()); // 20
 * console.log(h.pop()); // undefined
 * ```
 */
export class Heap<T>
	implements
		Iterable<T>,
		IClear,
		ICopy<Heap<T>>,
		IEmpty<Heap<T>>,
		IInto<T, Heap<T>>,
		ILength,
		IStack<T, T, Heap<T>>
{
	static parentIndex(idx: number) {
		return idx > 0 ? (idx - 1) >> 1 : -1;
	}

	static childIndex(idx: number) {
		return idx >= 0 ? (idx << 1) + 1 : -1;
	}

	values: T[];
	compare: Comparator<T>;
	equiv: Predicate2<T>;

	constructor(values?: Iterable<T> | null, opts?: Partial<HeapOpts<T>>) {
		opts = { compare, equiv, ...opts };
		this.compare = opts.compare!;
		this.equiv = opts.equiv!;
		this.values = [];
		if (values) {
			this.into(values);
		}
	}

	*[Symbol.iterator]() {
		yield* this.min();
	}

	get length() {
		return this.values.length;
	}

	copy() {
		const h = this.empty();
		h.values = this.values.slice();
		return h;
	}

	clear() {
		this.values.length = 0;
	}

	empty() {
		return new Heap<T>(null, { compare: this.compare });
	}

	peek(): Maybe<T> {
		return this.values[0];
	}

	push(val: T) {
		this.values.push(val);
		this.percolateUp(this.values.length - 1);
		return this;
	}

	pop(): Maybe<T> {
		const vals = this.values;
		const tail = vals.pop();
		let res: T;
		if (vals.length > 0) {
			res = vals[0];
			vals[0] = <T>tail;
			this.percolateDown(0);
		} else {
			res = <T>tail;
		}
		return res;
	}

	pushPop(val: T, vals = this.values): Maybe<T> {
		const head = vals[0];
		if (vals.length > 0 && this.compare(head, val) <= 0) {
			vals[0] = val;
			val = head;
			this.percolateDown(0, vals);
		}
		return val;
	}

	into(vals: Iterable<T>) {
		for (let v of vals) {
			this.push(v);
		}
		return this;
	}

	/**
	 * Calls {@link Heap.pushPop} for each given value in `vals` and
	 * returns last result (i.e. the smallest value in heap after
	 * processing all `vals`).
	 *
	 * @param vals - values to insert
	 */
	pushPopAll(vals: Iterable<T>): Maybe<T> {
		let res: any;
		for (let v of vals) {
			res = this.pushPop(v);
		}
		return <T>res;
	}

	replaceHead(val: T) {
		const res = this.values[0];
		this.values[0] = val;
		this.percolateDown(0);
		return res;
	}

	remove(val: T) {
		const { values, equiv } = this;
		for (let i = values.length; i-- > 0; ) {
			if (equiv(values[i], val)) {
				this.values.splice(i, 1);
				this.heapify();
				return true;
			}
		}
		return false;
	}

	find(val: T) {
		const { values, equiv } = this;
		for (let i = values.length; i-- > 0; ) {
			if (equiv(values[i], val)) {
				return values[i];
			}
		}
	}

	findWith(pred: Predicate<T>) {
		const values = this.values;
		for (let i = values.length; i-- > 0; ) {
			if (pred(values[i])) return values[i];
		}
	}

	has(val: T) {
		return this.find(val) !== undefined;
	}

	heapify(vals = this.values) {
		for (let i = (vals.length - 1) >> 1; i >= 0; i--) {
			this.percolateDown(i, vals);
		}
	}

	/**
	 * Returns the largest `n` values (or less) in heap, based on
	 * comparator ordering.
	 *
	 * @param n - number of values
	 */
	max(n = this.values.length) {
		const { compare, values } = this;
		const res = values.slice(0, n);
		if (!n) {
			return res;
		}
		this.heapify(res);
		for (let m = values.length; n < m; n++) {
			this.pushPop(values[n], res);
		}
		return res.sort((a, b) => compare(b, a));
	}

	/**
	 * Returns the smallest `n` values (or less) in heap, based on
	 * comparator ordering.
	 *
	 * @param n - number of values
	 */
	min(n = this.values.length) {
		const { compare, values } = this;
		const res = values.slice(0, n).sort(compare);
		if (!n) {
			return res;
		}
		let x = res[n - 1],
			y: T;
		for (let i = n, m = values.length; i < m; i++) {
			y = values[i];
			if (compare(y, x) < 0) {
				res.splice(__binarySearch(y, res, 0, n, compare), 0, y);
				res.pop();
				x = res[n - 1];
			}
		}
		return res;
	}

	parent(n: number) {
		n = Heap.parentIndex(n);
		return n >= 0 ? this.values[n] : undefined;
	}

	children(n: number) {
		n = Heap.childIndex(n);
		const vals = this.values;
		const m = vals.length;
		if (n >= m) return;
		if (n === m - 1) return [vals[n]];
		return [vals[n], vals[n + 1]];
	}

	leaves() {
		const vals = this.values;
		if (!vals.length) {
			return [];
		}
		return vals.slice(Heap.parentIndex(vals.length - 1) + 1);
	}

	protected percolateUp(i: number, vals = this.values) {
		const node = vals[i];
		const cmp = this.compare;
		while (i > 0) {
			const pi = (i - 1) >> 1;
			const parent = vals[pi];
			if (cmp(node, parent) >= 0) {
				break;
			}
			vals[pi] = node;
			vals[i] = parent;
			i = pi;
		}
	}

	protected percolateDown(i: number, vals = this.values) {
		const n = vals.length;
		const node = vals[i];
		const cmp = this.compare;
		let child = (i << 1) + 1;
		while (child < n) {
			const next = child + 1;
			if (next < n && cmp(vals[child], vals[next]) >= 0) {
				child = next;
			}
			if (cmp(vals[child], node) < 0) {
				vals[i] = vals[child];
			} else {
				break;
			}
			i = child;
			child = (i << 1) + 1;
		}
		vals[i] = node;
	}
}

/** @internal */
const __binarySearch = <T>(
	x: T,
	vals: T[],
	lo: number,
	hi: number,
	cmp: Comparator<T>
) => {
	let m;
	while (lo < hi) {
		m = (lo + hi) >>> 1;
		if (cmp(x, vals[m]) < 0) {
			hi = m;
		} else {
			lo = m + 1;
		}
	}
	return lo;
};
