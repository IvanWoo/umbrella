// SPDX-License-Identifier: Apache-2.0
import { expect, test } from "bun:test";
import { aabb, ellipse, polygon, rect } from "../src/index.js";

test("aabb", () => {
	let e = aabb({ a: 1 });
	expect(e.pos).toEqual([0, 0, 0]);
	expect(e.size).toEqual([1, 1, 1]);
	expect(e.attribs).toEqual({ a: 1 });
	e = aabb(1);
	expect(e.pos).toEqual([0, 0, 0]);
	expect(e.size).toEqual([1, 1, 1]);
	expect(e.attribs).toBeUndefined();
	e = aabb([1, 2, 3]);
	expect(e.pos).toEqual([0, 0, 0]);
	expect(e.size).toEqual([1, 2, 3]);
	expect(e.attribs).toBeUndefined();
	e = aabb([1, 2, 3], { a: 2 });
	expect(e.pos).toEqual([0, 0, 0]);
	expect(e.size).toEqual([1, 2, 3]);
	expect(e.attribs).toEqual({ a: 2 });
	e = aabb([1, 2, 3], [4, 5, 6], { a: 3 });
	expect(e.pos).toEqual([1, 2, 3]);
	expect(e.size).toEqual([4, 5, 6]);
	expect(e.attribs).toEqual({ a: 3 });
	e = aabb([1, 2, 3], [4, 5, 6], undefined);
	expect(e.pos).toEqual([1, 2, 3]);
	expect(e.size).toEqual([4, 5, 6]);
	expect(e.attribs).toBeUndefined();
});

test("ellipse", () => {
	let e = ellipse({ a: 1 });
	expect(e.pos).toEqual([0, 0]);
	expect(e.r).toEqual([1, 1]);
	expect(e.attribs).toEqual({ a: 1 });
	e = ellipse(1);
	expect(e.pos).toEqual([0, 0]);
	expect(e.r).toEqual([1, 1]);
	expect(e.attribs).toBeUndefined();
	e = ellipse([1, 2]);
	expect(e.pos).toEqual([0, 0]);
	expect(e.r).toEqual([1, 2]);
	expect(e.attribs).toBeUndefined();
	e = ellipse([1, 2], { a: 2 });
	expect(e.pos).toEqual([0, 0]);
	expect(e.r).toEqual([1, 2]);
	expect(e.attribs).toEqual({ a: 2 });
	e = ellipse([1, 2], [3, 4], { a: 3 });
	expect(e.pos).toEqual([1, 2]);
	expect(e.r).toEqual([3, 4]);
	expect(e.attribs).toEqual({ a: 3 });
	e = ellipse([1, 2], [3, 4], undefined);
	expect(e.pos).toEqual([1, 2]);
	expect(e.r).toEqual([3, 4]);
	expect(e.attribs).toBeUndefined();
});

test("polygon", () => {
	let p = polygon();
	expect(p.points).toEqual([]);
	expect(p.attribs).toBeUndefined();
	p = polygon([[0, 0]], { a: 2 });
	expect(p.points).toEqual([[0, 0]]);
	expect(p.attribs).toEqual({ a: 2 });
});

test("rect", () => {
	let r = rect({ a: 1 });
	expect(r.pos).toEqual([0, 0]);
	expect(r.size).toEqual([1, 1]);
	expect(r.attribs).toEqual({ a: 1 });
	r = rect(1);
	expect(r.pos).toEqual([0, 0]);
	expect(r.size).toEqual([1, 1]);
	expect(r.attribs).toBeUndefined();
	r = rect([1, 2]);
	expect(r.pos).toEqual([0, 0]);
	expect(r.size).toEqual([1, 2]);
	expect(r.attribs).toBeUndefined();
	r = rect([1, 2], { a: 2 });
	expect(r.pos).toEqual([0, 0]);
	expect(r.size).toEqual([1, 2]);
	expect(r.attribs).toEqual({ a: 2 });
	r = rect([1, 2], [3, 4], { a: 3 });
	expect(r.pos).toEqual([1, 2]);
	expect(r.size).toEqual([3, 4]);
	expect(r.attribs).toEqual({ a: 3 });
	r = rect([1, 2], [3, 4], undefined);
	expect(r.pos).toEqual([1, 2]);
	expect(r.size).toEqual([3, 4]);
	expect(r.attribs).toBeUndefined();
});
