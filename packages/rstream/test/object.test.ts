import { expect, test } from "bun:test";
import { Subscription, fromObject, fromTuple, stream } from "../src/index.js";
import { assertUnsub } from "./utils.js";

type Foo = { a?: number; b: string };

test("basic", () => {
	const obj = fromObject(
		<{ a?: number; b: string }>{
			a: 1,
			b: "foo",
		},
		{ id: "test" }
	);
	expect(obj.streams.a instanceof Subscription).toBeTrue();
	expect(obj.streams.b instanceof Subscription).toBeTrue();
	expect(obj.streams.a.id.startsWith("test-a")).toBeTrue();
	expect(obj.streams.b.id.startsWith("test-b")).toBeTrue();

	const acc: any = { a: [], b: [] };
	obj.streams.a.subscribe({
		next(x) {
			acc.a.push(x);
		},
	});
	obj.streams.b.subscribe({
		next(x) {
			acc.b.push(x);
		},
	});
	obj.next({ a: 2, b: "bar" });
	obj.next({ b: "baz" });
	obj.done();
	expect(acc).toEqual({
		a: [1, 2, undefined],
		b: ["foo", "bar", "baz"],
	});
	assertUnsub(obj.streams.a);
	assertUnsub(obj.streams.b);
});

test("subscriber", () => {
	const acc: any = { a: [], b: [] };
	const obj = fromObject(<Foo>{}, { keys: ["a", "b"], initial: false });
	obj.streams.a.subscribe({
		next(x) {
			acc.a.push(x);
		},
	});
	obj.streams.b.subscribe({
		next(x) {
			acc.b.push(x);
		},
	});

	const src = stream<Foo>();
	src.subscribe(obj);

	src.next({ a: 1, b: "foo" });
	src.next({ b: "bar" });
	src.done();
	expect(acc).toEqual({
		a: [1, undefined],
		b: ["foo", "bar"],
	});
	assertUnsub(obj.streams.a);
	assertUnsub(obj.streams.b);
});

test("defaults & dedupe", () => {
	const acc: any = { a: [], b: [] };
	const obj = fromObject(<Foo>{}, {
		keys: ["a", "b"],
		initial: false,
		defaults: { a: 0 },
	});
	obj.streams.a.subscribe({
		next(x) {
			acc.a.push(x);
		},
	});
	obj.streams.b.subscribe({
		next(x) {
			acc.b.push(x);
		},
	});

	obj.next({ b: "foo" });
	obj.next({ a: 1, b: "bar" });
	obj.next({ a: 0, b: "bar" });
	obj.next({ a: 2, b: "bar" });
	obj.next({ a: 2, b: "baz" });
	obj.next({ b: "baz" });
	expect(acc).toEqual({
		a: [0, 1, 0, 2, 0],
		b: ["foo", "bar", "baz"],
	});
});

test("fromTuple", () => {
	const acc = new Map<number, number>();
	const collect = {
		next(x: number) {
			acc.set(x, (acc.get(x) ?? 0) + 1);
		},
	};
	const tup = fromTuple([1, 2, 3]);
	expect(new Set(Object.keys(tup.streams))).toEqual(new Set(["0", "1", "2"]));
	tup.streams[0].subscribe(collect);
	tup.streams[1].subscribe(collect);
	tup.streams[2].subscribe(collect);
	expect(acc).toEqual(
		new Map([
			[1, 1],
			[2, 1],
			[3, 1],
		])
	);
	tup.next([1, 20, 3]);
	tup.next([10, 2, 3]);
	expect(acc).toEqual(
		new Map([
			[1, 1],
			[2, 2],
			[3, 1],
			[10, 1],
			[20, 1],
		])
	);
});
