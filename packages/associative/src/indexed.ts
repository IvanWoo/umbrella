import { empty } from "@thi.ng/object-utils/empty";
import { selectKeysObj } from "@thi.ng/object-utils/select-keys";
import { EquivMap } from "./equiv-map.js";

/**
 * Takes an iterable of plain objects and array of indexing keys. Calls
 * {@link selectKeysObj} on each value and uses returned objects as new keys
 * to group original values. Returns a new {@link EquivMap} of sets.
 *
 * @example
 * ```ts tangle:../export/indexed.ts
 * import { indexed } from "@thi.ng/associative";
 *
 * console.log(
 *   indexed(
 *     new Set([{a: 1, b: 1}, {a: 1, b: 2}, {a: 1, b: 1, c: 2}]),
 *     ["a","b"]
 *   )
 * );
 * // EquivMap {
 * //   { a: 1, b: 1 } => Set { { a: 1, b: 1 }, { a: 1, b: 1, c: 2 } },
 * //   { a: 1, b: 2 } => Set { { a: 1, b: 2 } } }
 * ```
 *
 * @param records - objects to index
 * @param ks - keys used for indexing
 */
export const indexed = <T extends object>(
	records: Iterable<T>,
	ks: (keyof T)[]
) => {
	const res = new EquivMap<{ [id in keyof T]?: T[id] }, Set<T>>();
	let x, ik, rv;
	for (x of records) {
		ik = selectKeysObj(x, ks);
		rv = res.get(ik);
		!rv && res.set(ik, (rv = empty(records, Set)));
		rv.add(x);
	}
	return res;
};
