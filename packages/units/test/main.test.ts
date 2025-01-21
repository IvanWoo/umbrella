// SPDX-License-Identifier: Apache-2.0
import { eqDelta } from "@thi.ng/math";
import { expect, test } from "bun:test";
import {
	arcmin,
	cm,
	convert,
	deg,
	ft,
	gon,
	inch,
	km,
	m,
	mi,
	mm,
	nm,
	rad,
	turn,
	yd,
	type Unit,
} from "../src/index.js";

const PI = Math.PI;
const TAU = 2 * PI;

const check = (x: number, src: Unit, y: number, dest: Unit) => {
	const res = convert(x, src, dest);
	expect(eqDelta(res, y)).toBeTrue();
};

test("angle", () => {
	check(1, rad, 180 / PI, deg);
	check(TAU, rad, 1, turn);
	check(360, deg, 400, gon);
	check(1 / 60, deg, 1, arcmin);
});

test("length", () => {
	check(1, m, 1000, mm);
	check(1000, mm, 1, m);
	check(1, m, 100, cm);
	check(1, km, 1000, m);
	check(25.4e6, nm, 1, inch);
	check(25.4, mm, 1, inch);
	check(12, inch, 1, ft);
	check(36, inch, 1, yd);
	check(1760 * 36, inch, 1, mi);
});
