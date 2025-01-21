// SPDX-License-Identifier: Apache-2.0
import { Atom } from "@thi.ng/atom";
import { fromIterable } from "@thi.ng/rstream";
import { map } from "@thi.ng/transducers";
import { expect, test } from "bun:test";
import { add, initGraph, mul, node1 } from "../src/index.js";

test("basic", (done) => {
	const acc: number[] = [];
	const state = new Atom<any>({ a: 1, b: 2 });
	const graph = initGraph(state, {
		foo: () => ({
			node: fromIterable([2]),
			ins: {},
			outs: {},
		}),
		bar: ($) => ({
			node: $("/foo/node").transform(map((x: number) => x * 10)),
			ins: {},
			outs: {},
		}),
		add: {
			fn: add,
			ins: {
				a: { path: "a" },
				b: { path: "b" },
			},
			outs: {
				alt: (n) => n.subscribe({}), // identical to main out, testing only
			},
		},
		mul: {
			fn: mul,
			ins: {
				a: { stream: "/add/outs/alt" },
				b: { stream: () => fromIterable([10, 20, 30]) },
				c: { stream: "/bar/node" },
			},
			outs: {
				baz: (n, id) =>
					n.subscribe({
						next: (x) => state.resetInUnsafe(["foo", id], x),
					}),
			},
		},
		res: {
			ins: {
				src: { stream: "/mul/node" },
			},
			fn: node1(map((x: number) => ({ x: x, x2: x * 2 }))),
			outs: {
				"*": "res",
			},
		},
		res2: {
			ins: {
				src: { stream: "/res/node" },
			},
			fn: node1(),
			outs: {
				x: "res2.x",
			},
		},
	});
	graph.mul.node.subscribe({ next: (x) => acc.push(x) });
	setTimeout(() => {
		state.resetIn(["a"], 10);
		// console.log(graph);
		expect(acc).toEqual([600, 1200, 1800, 7200]);
		expect(state.deref()).toEqual({
			a: 10,
			b: 2,
			foo: { baz: 7200 },
			res: { x: 7200, x2: 14400 },
			res2: { x: 7200 },
		});
		done();
	}, 30);
});
