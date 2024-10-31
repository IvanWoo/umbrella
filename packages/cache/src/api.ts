import type {
	Fn,
	Fn0,
	Fn2,
	Fn3,
	ICopy,
	IEmpty,
	ILength,
	IRelease,
	Maybe,
} from "@thi.ng/api";

export interface ICache<K, V>
	extends Iterable<Readonly<[K, CacheEntry<K, V>]>>,
		ICopy<ICache<K, V>>,
		IEmpty<ICache<K, V>>,
		ILength,
		IRelease {
	readonly size: number;

	/**
	 * Returns true if the given `key` is currently in the cache.
	 *
	 * @param key
	 */
	has(key: K): boolean;
	/**
	 * Looks up value for given `key` and if cached returns it. For cache
	 * misses, returns the optional `notFound` value or else `undefined`.
	 *
	 * @param key
	 * @param notFound
	 */
	get(key: K, notFound?: V): Maybe<V>;
	/**
	 * Set or updates value for given `key` and updates cache internal
	 * statistics (depending on cache policy).
	 *
	 * @param key
	 * @param val
	 */
	set(key: K, val: V): V;
	/**
	 * Combination of {@link ICache.get} and {@link ICache.set}. Looks up the
	 * value for given `key` and returns it. In case of a cache miss, calls
	 * given `fn` to provide a value for the `key` and then stores it in the
	 * cache before returning that value.
	 *
	 * @param key
	 * @param fn
	 */
	getSet(key: K, fn: Fn0<Promise<V>>): Promise<V>;
	/**
	 * Evicts cache entry for given `key` and returns true if the `key` was
	 * still cached. If that's the case and if {@link CacheOpts.release} was
	 * given when the cache was created, also calls that user provided release
	 * handler to perform custom clean up tasks.
	 *
	 * @param key
	 */
	delete(key: K): boolean;
	/**
	 * Returns an iterator of cache entries.
	 */
	entries(): IterableIterator<Readonly<[K, CacheEntry<K, V>]>>;
	/**
	 * Returns an iterator of currently cached keys.
	 */
	keys(): IterableIterator<Readonly<K>>;
	/**
	 * Returns an iterator of currently cached values.
	 */
	values(): IterableIterator<Readonly<V>>;
}

export interface CacheOpts<K, V> {
	/**
	 * Function to compute the size of a given key in arbitrary user defined
	 * units (must be same unit as given to {@link CacheOpts.maxsize}).
	 */
	ksize: Fn<K, number>;
	/**
	 * Function to compute the size of a given value in arbitrary user defined
	 * units (must be same unit as given to {@link CacheOpts.maxsize}).
	 */
	vsize: Fn<V, number>;
	/**
	 * Callback function to perform custom tasks when an item gets evicted from
	 * the cache.
	 */
	release: Fn2<K, V, void>;
	/**
	 * Callback function to perform custom tasks when an item gets updated in the cache.
	 * The function will be called with a key and its associated old and news values.
	 */
	update: Fn3<K, V, V, void>;
	/**
	 * Custom ES6 Map compatible implementation to use as the cache's backing
	 * store.
	 */
	map: Fn0<MapLike<K, any>>;
	/**
	 * Max number of items in the cache.
	 */
	maxlen: number;
	/**
	 * Cache max size in arbitrary user defined units (must be same unit as
	 * given to {@link CacheOpts.ksize} and/or {@link CacheOpts.vsize}).
	 */
	maxsize: number;
}

export interface CacheEntry<K, V> {
	k: K;
	v: V;
	s: number;
}

/**
 * Simplified subset of the ES6 Map API needed for cache implementations.
 */
export interface MapLike<K, V> {
	has(key: K): boolean;
	get(key: K): Maybe<V>;
	set(key: K, val: V): void;
	delete(key: K): void;
	clear(): void;
}
