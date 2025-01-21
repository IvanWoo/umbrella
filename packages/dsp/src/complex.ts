// SPDX-License-Identifier: Apache-2.0
import type { NumericArray } from "@thi.ng/api";
import { isNumber } from "@thi.ng/checks/is-number";
import type { ComplexArray } from "./api.js";

export const isComplex = (
	buf: NumericArray | ComplexArray
): buf is ComplexArray => !isNumber(buf[0]);
