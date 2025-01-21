// SPDX-License-Identifier: Apache-2.0
import type { Attribs } from "./api.js";
import type { Vec } from "@thi.ng/vectors";
import { Text } from "./api/text.js";

export const text = (pos: Vec, body: any, attribs?: Attribs) =>
	new Text(pos, body, attribs);
