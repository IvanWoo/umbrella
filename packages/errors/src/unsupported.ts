// SPDX-License-Identifier: Apache-2.0
import { defError } from "./deferror.js";

export const UnsupportedOperationError = defError<any>(
	() => "unsupported operation"
);

export const unsupported = (msg?: any): never => {
	throw new UnsupportedOperationError(msg);
};
