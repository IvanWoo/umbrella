import type { ReadonlyVec, Vec } from "@thi.ng/vectors";
import { cornerBisector } from "@thi.ng/vectors/bisect";
import { corner2 } from "@thi.ng/vectors/clockwise";
import { direction2 } from "@thi.ng/vectors/direction";
import { dist } from "@thi.ng/vectors/dist";
import { maddN2 } from "@thi.ng/vectors/maddn";
import { mulN, mulN2 } from "@thi.ng/vectors/muln";
import { perpendicularCW } from "@thi.ng/vectors/perpendicular";
import { set2 } from "@thi.ng/vectors/set";

/** @internal */
const __buildSegments = (tangents: Vec[][], t: number, uniform: boolean) => {
	const res: Vec[][] = [];
	for (let i = 0, num = tangents.length - 1; i < num; i++) {
		const [a, na] = tangents[i];
		const [b, nb] = tangents[i + 1];
		const d = uniform ? t : t * dist(a, b);
		res.push([a, maddN2([], na, d, a), maddN2([], nb, -d, b), b]);
	}
	return res;
};

export const closedCubicFromBreakPoints = (
	points: ReadonlyVec[],
	t = 1 / 3,
	uniform = false
) => {
	const tangents: Vec[][] = [];
	for (let num = points.length, i = num - 1, j = 0; j < num; i = j, j++) {
		const a = points[i];
		const b = points[j];
		const c = points[(j + 1) % num];
		const n = mulN(
			null,
			perpendicularCW(null, cornerBisector([], a, b, c)),
			corner2(a, b, c)
		);
		tangents.push([set2([], b), n]);
	}
	tangents.push(tangents[0]);
	return __buildSegments(tangents, t, uniform);
};

export const openCubicFromBreakPoints = (
	points: ReadonlyVec[],
	t = 1 / 3,
	uniform = false
) => {
	const tangents: Vec[][] = [
		[points[0], direction2([], points[0], points[1])],
	];
	const num = points.length - 1;
	for (let i = 1; i < num; i++) {
		const a = points[i - 1];
		const b = points[i];
		const c = points[i + 1];
		const n = mulN2(
			null,
			perpendicularCW(null, cornerBisector([], a, b, c)),
			corner2(a, b, c)
		);
		tangents.push([set2([], b), n]);
	}
	tangents.push([points[num], direction2([], points[num - 1], points[num])]);
	return __buildSegments(tangents, t, uniform);
};
