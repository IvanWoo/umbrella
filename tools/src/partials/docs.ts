// SPDX-License-Identifier: Apache-2.0
import { link } from "./link.js";
import { shortName } from "./package.js";

export const docLink = (docBaseURL: string, pkgName: string) =>
	link("Generated API docs", `${docBaseURL}/${shortName(pkgName)}/`);
