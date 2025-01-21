// SPDX-License-Identifier: Apache-2.0
import type {
	ArrayLikeIterable,
	EVENT_ALL,
	Fn0,
	IClear,
	IID,
	INotify,
	IRelease,
	Maybe,
	Type,
	TypedArray,
	UIntArray,
} from "@thi.ng/api";
import type { IMemPoolArray } from "@thi.ng/malloc";

export type ComponentID<S> = keyof S & string;

export type ComponentDefaultValue<T> = T | Fn0<T>;

export type GroupTuple<SPEC, K extends ComponentID<SPEC>> = Pick<SPEC, K> &
	IID<number>;

export type GroupInfo<SPEC, K extends ComponentID<SPEC>> = {
	[P in K]: ComponentInfo<SPEC, P>;
};

export interface ComponentInfo<SPEC, K extends ComponentID<SPEC>> {
	values: SPEC[K] extends TypedArray ? SPEC[K] : SPEC[K][];
	size: number;
	stride: number;
}

export interface IComponent<K extends string, VALUES, GET, SET>
	extends IID<K>,
		INotify {
	dense: UIntArray;
	sparse: UIntArray;
	vals: VALUES;
	readonly size: number;
	readonly stride: number;

	owner?: IID<string>;

	resize(pool: IMemPoolArray, cap: number): void;
	has(id: number): boolean;
	add(id: number, val?: SET): boolean;
	delete(id: number): boolean;
	get(id: number): Maybe<GET>;
	set(i: number, val: SET): boolean;
	getIndex(i: number): Maybe<GET>;
	setIndex(i: number, val: SET): boolean;
	setIndexUnsafe(i: number, val: SET, notify?: boolean): void;

	keys(): ArrayLikeIterable<number>;
	values(): IterableIterator<GET>;

	/**
	 * Swaps slots of `src` & `dest` indices. The given args are NOT
	 * entity IDs, but indices in the `dense` array. The corresponding
	 * sparse & value slots are swapped too. Returns true if swap
	 * happened (false, if `src` and `dest` are equal)
	 *
	 * @param src -
	 * @param dest -
	 */
	swapIndices(src: number, dest: number): boolean;
}

export interface MemMappedComponentOpts<ID extends string> {
	id: ID;
	type: Type;
	buf?: ArrayBuffer;
	byteOffset?: number;
	size?: number;
	stride?: number;
	default?: ComponentDefaultValue<ArrayLike<number>>;
	cache?: ICache<TypedArray>;
}

export interface ObjectComponentOpts<ID extends string, T> {
	id: ID;
	default?: ComponentDefaultValue<T>;
}

export interface GroupOpts {
	id: string;
	cache?: ICache<any>;
}

export interface ICache<T> extends IClear, IRelease {
	keys(): Iterable<number>;
	set(key: number, val: T): T;
	get(key: number): Maybe<T>;
	getSet(key: number, notFound: Fn0<T>): T;
	delete(key: number): boolean;
}

export interface ECSOpts {
	/**
	 * Max. number of entities
	 *
	 * @defaultValue 1000
	 */
	capacity: number;
	/**
	 * Optional
	 * [`IMemPoolArray`](https://docs.thi.ng/umbrella/malloc/interfaces/IMemPoolArray.html)
	 * implementation
	 *
	 * @defaultValue
	 * [`NativePool`](https://docs.thi.ng/umbrella/malloc/classes/NativePool.html)
	 */
	pool: IMemPoolArray;
}

export const EVENT_ADDED = "added";
export const EVENT_PRE_DELETE = "pre-delete";
export const EVENT_CHANGED = "changed";

export type ECSEventType =
	| typeof EVENT_ADDED
	| typeof EVENT_PRE_DELETE
	| typeof EVENT_ALL;

export type ComponentEventType = ECSEventType | typeof EVENT_CHANGED;
