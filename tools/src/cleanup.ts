// SPDX-License-Identifier: Apache-2.0
import { files } from "@thi.ng/file-io";
import { unlinkSync } from "node:fs";

for (let f of files("packages", ".map")) {
	if (f.indexOf("/lib/") === -1) {
		console.log(f);
		unlinkSync(f);
	}
}
