// SPDX-License-Identifier: Apache-2.0
import { satisfy, satisfyD } from "./satisfy.js";

export const always = (id = "always") => satisfy<any>(() => true, id);

export const alwaysD = () => satisfyD<any>(() => true);
