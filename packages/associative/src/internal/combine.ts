import type { Fn0 } from "@thi.ng/api";
import type { Reducer } from "@thi.ng/transducers";
import { reduce } from "@thi.ng/transducers/reduce";
import { ensureSet } from "../checks.js";

export const __combineSet = <T>(
	rfn: Fn0<Reducer<Iterable<T>, Set<T>>>,
	op: (a: Set<T>, b: Set<T>, c?: Set<T>) => Set<T>,
	src?: Iterable<Iterable<T>>
) =>
	src
		? reduce(rfn(), src)
		: <Reducer<Iterable<T>, Set<T>>>[
				() => <any>null,
				(acc) => acc || new Set<T>(),
				(acc, x) => (!acc ? ensureSet(x) : op(acc, ensureSet(x))),
		  ];
