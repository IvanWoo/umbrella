// SPDX-License-Identifier: Apache-2.0
import { readJSON } from "@thi.ng/file-io";
import type { BaseConfig, Config, Package, PackageMeta } from "./api.js";

export let CONFIG: Config;

export const initConfig = (configPath: string, pkgPath: string) => {
	const conf = <BaseConfig>readJSON(configPath);
	const root = <Package>readJSON(pkgPath);
	const meta = <PackageMeta>{
		branch: "develop",
		year: 2016,
		...root["thi.ng"],
	};
	CONFIG = {
		...conf,
		root,
		meta,
		assetURL: `${conf.assetURL}/${meta.branch}/assets`,
		branchURL: `${conf.repoURL}/tree/${meta.branch}`,
	};
};
