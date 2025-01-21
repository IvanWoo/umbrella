// SPDX-License-Identifier: Apache-2.0
// thing:no-export
import type { SOAAttribSpec } from "./api.js";

export const prepareSpec = (spec: Partial<SOAAttribSpec>) => {
	spec = { type: "f32", size: 1, ...spec };
	!spec.stride && (spec.stride = spec.size);
	return spec;
};
