// SPDX-License-Identifier: Apache-2.0
import type { Attribs } from "./api.js";
import { equilateralTriangle2 } from "@thi.ng/geom-poly-utils/equilateral";
import type { Vec } from "@thi.ng/vectors";
import { Triangle } from "./api/triangle.js";
import { __pclike } from "./internal/pclike.js";

export function triangle(a: Vec, b: Vec, c: Vec, attribs?: Attribs): Triangle;
export function triangle(pts: Iterable<Vec>, attribs?: Attribs): Triangle;
export function triangle(...args: any[]) {
	return __pclike(Triangle, args);
}

export const equilateralTriangle = (a: Vec, b: Vec, attribs?: Attribs) =>
	new Triangle(equilateralTriangle2(a, b), attribs);
