import { TAU } from "@thi.ng/math/api";
import { fit } from "@thi.ng/math/fit";
import type { ReadonlyVec } from "@thi.ng/vectors";
import { heading } from "@thi.ng/vectors/heading";
import { sub2 } from "@thi.ng/vectors/sub";
import { slider1Val } from "./slider.js";

export const dialVal = (
	p: ReadonlyVec,
	origin: ReadonlyVec,
	startTheta: number,
	thetaGap: number,
	min: number,
	max: number,
	prec: number
) => {
	let theta = heading(sub2([], p, origin)) - startTheta;
	theta < -0.5 && (theta += TAU);
	return slider1Val(
		fit(Math.min(theta / (TAU - thetaGap)), 0, 1, min, max),
		min,
		max,
		prec
	);
};
