// SPDX-License-Identifier: Apache-2.0
import { isIterable } from "@thi.ng/checks/is-iterable";
import type { Transducer } from "./api.js";
import { keySelector } from "./key-selector.js";
import { iterator1 } from "./iterator.js";
import { map } from "./map.js";

/**
 * Transducer which yields sequence of transformed objects, each only only
 * containing the given `keys`. If a key's value is `undefined` (or missing
 * entirely) it will be omitted in the result.
 *
 * @remarks
 * For single key extraction {@link pluck} is a faster alternative.
 *
 * @example
 * ```ts tangle:../export/select-keys.ts
 * import { selectKeys } from "@thi.ng/transducers";
 *
 * const res = [...selectKeys(
 *   ["id", "age"],
 *   [
 *     {id: 1, age: 23, name: "alice"},
 *     {id: 2, age: 42, name: "bob"},
 *     {id: 3, name: "charlie"},
 *   ]
 * )];
 *
 * console.log(res);
 * // [ { age: 23, id: 1 }, { age: 42, id: 2 }, { id: 3 } ]
 * ```
 *
 * @param keys -
 */
export function selectKeys<T>(keys: PropertyKey[]): Transducer<T, any>;
export function selectKeys<T>(
	keys: PropertyKey[],
	src: Iterable<T>
): IterableIterator<any>;
export function selectKeys<T>(keys: PropertyKey[], src?: Iterable<T>): any {
	return isIterable(src)
		? iterator1(selectKeys(keys), src)
		: map(keySelector(keys));
}
