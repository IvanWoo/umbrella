// SPDX-License-Identifier: Apache-2.0
import type { IObjectOf } from "@thi.ng/api";
import { intersection } from "@thi.ng/associative/intersection";
import { join } from "@thi.ng/associative/join";
import { equiv } from "@thi.ng/equiv";
import { LOGGER } from "@thi.ng/rstream/logger";
import type { Reducer, Transducer } from "@thi.ng/transducers";
import { comp } from "@thi.ng/transducers/comp";
import { compR } from "@thi.ng/transducers/compr";
import { dedupe } from "@thi.ng/transducers/dedupe";
import { keySelector } from "@thi.ng/transducers/key-selector";
import { map } from "@thi.ng/transducers/map";
import type { BindFn, Edit, Solutions, Triple, TripleIds } from "./api.js";
import type { TripleStore } from "./store.js";

export const intersect2: Transducer<IObjectOf<TripleIds>, TripleIds> = comp(
	map(({ a, b }) => intersection(a, b)),
	dedupe(equiv)
);

export const intersect3: Transducer<IObjectOf<TripleIds>, TripleIds> = comp(
	map(({ s, p, o }) => intersection(intersection(s, p), o)),
	dedupe(equiv)
);

export const indexSel =
	(key: any): Transducer<Edit, TripleIds> =>
	(rfn: Reducer<TripleIds, any>) => {
		const r = rfn[2];
		return compR(rfn, (acc, e) => {
			LOGGER.fine("index sel", e.key, key);
			return equiv(e.key, key) ? r(acc, e.index) : acc;
		});
	};

export const resultTriples = (graph: TripleStore) =>
	map<TripleIds, Set<Triple>>((ids) => {
		const res = new Set<Triple>();
		for (let id of ids) res.add(graph.triples[id]);
		return res;
	});

export const joinSolutions = (n: number) =>
	map<IObjectOf<Solutions>, Solutions>((src) => {
		let res: Solutions = src[0];
		for (let i = 1; i < n && res.size; i++) {
			res = join(res, src[i]);
		}
		return res;
	});

export const filterSolutions = (qvars: Iterable<string>) => {
	const filterVars = keySelector([...qvars]);
	return map((sol: Solutions) => {
		const res: Solutions = new Set();
		for (let s of sol) {
			res.add(filterVars(s));
		}
		return res;
	});
};

export const limitSolutions = (n: number) =>
	map((sol: Solutions) => {
		if (sol.size <= n) {
			return sol;
		}
		const res: Solutions = new Set();
		let m = n;
		for (let s of sol) {
			res.add(s);
			if (--m <= 0) break;
		}
		return res;
	});

export const bindVars = (bindings: IObjectOf<BindFn>) =>
	map((sol: Solutions) => {
		const res: Solutions = new Set();
		for (let s of sol) {
			s = { ...s };
			res.add(s);
			for (let b in bindings) {
				s[b] = bindings[b](s);
			}
		}
		return res;
	});
