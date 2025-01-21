// SPDX-License-Identifier: Apache-2.0
import type { IObjectOf } from "@thi.ng/api";
import { files, readJSON, writeText } from "@thi.ng/file-io";
import { idgen } from "@thi.ng/idgen";
import { tableKeys } from "@thi.ng/markdown-table";
import { Z3 } from "@thi.ng/strings";
import {
	comp,
	filter,
	map,
	mapKeys,
	push,
	transduce,
} from "@thi.ng/transducers";
import { LOGGER, META_FIELD } from "./api.js";
import { initConfig } from "./config.js";
import { thumb } from "./partials/asset.js";

interface Example extends IObjectOf<string> {
	id: string;
	img: string;
	name: string;
	description: string;
}

try {
	initConfig("./tools/config.json", "./package.json");

	const counter = idgen(8);
	const examples = transduce(
		comp(
			// map((f) => `examples/${f}/package.json`),
			// filter(existsSync),
			map((f) => readJSON(f, LOGGER)),
			filter((pkg) => !pkg[META_FIELD]?.skip),
			mapKeys(
				{
					id: () => Z3(counter.next() + 1),
					name: (id) => {
						id = id.substring(9);
						return `[${id}](./${id}/)`;
					},
					img: (_, ex) =>
						ex[META_FIELD]?.screenshot
							? thumb(ex["thi.ng"].screenshot, "../assets")
							: "",
					description: (desc) => desc || "TODO",
				},
				false
			)
		),
		push<Example>(),
		files("examples", "package.json", 2)
	);

	const BODY = `<!-- This file is autogenerated - DO NOT EDIT! -->
# @thi.ng/umbrella examples

This directory contains a growing number (currently ${
		examples.length
	}) of standalone
example projects, including live online versions, build instructions
and commented source code.

If you want to [contribute](../CONTRIBUTING.md) an example, please get
in touch via PR, issue tracker, email or twitter!

${tableKeys(
	["#", "Screenshot", "Name", "Description"],
	["id", "img", "name", "description"],
	examples
)}
`;
	writeText("examples/README.md", BODY, LOGGER);
} catch (e) {
	console.log((<Error>e).message);
	process.exit(1);
}
