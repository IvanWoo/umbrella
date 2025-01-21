// SPDX-License-Identifier: Apache-2.0
import { exposeGlobal } from "@thi.ng/expose";
import { App } from "./app";
import { CONFIG } from "./config";

const APP = new App(CONFIG);
exposeGlobal("APP", APP);

APP.start();
