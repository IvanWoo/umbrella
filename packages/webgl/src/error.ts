// SPDX-License-Identifier: Apache-2.0
import { defError } from "@thi.ng/errors/deferror";

export const WebGLError = defError(() => "WebGL");

export const error = (msg?: string): never => {
	throw new WebGLError(msg);
};
