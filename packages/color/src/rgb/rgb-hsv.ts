// SPDX-License-Identifier: Apache-2.0
import { EPS } from "@thi.ng/math/api";
import type { ColorOp } from "../api.js";
import { rgbHcv } from "./rgb-hcv.js";

export const rgbHsv: ColorOp = (out, src) => {
	out = rgbHcv(out, src);
	out[1] /= out[2] + EPS;
	return out;
};
