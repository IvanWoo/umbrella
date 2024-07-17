import { dirs, readJSON } from "@thi.ng/file-io";
import { tableKeys } from "@thi.ng/markdown-table";
import { capitalize, namedNumber } from "@thi.ng/strings";
import { LOGGER, META_FIELD } from "../api.js";
import { CONFIG } from "../config.js";
import { thumb } from "./asset.js";
import { link } from "./link.js";
import { shortName } from "./package.js";

export const examplesTable = (pkgName: string) => {
	const examples = [];
	let hasImg = false;
	for (let ex of dirs(CONFIG.exampleDir, "", 1)) {
		try {
			const expkg = readJSON(`${ex}/package.json`);
			const meta = expkg[META_FIELD] || {};
			const explicitInclude =
				Array.isArray(meta.readme) &&
				meta.readme.includes(shortName(pkgName));
			if (
				explicitInclude ||
				(meta.readme === true &&
					expkg.dependencies &&
					expkg.dependencies[pkgName])
			) {
				hasImg = !!meta.screenshot || hasImg;
				const exampleName = shortName(expkg.name);
				const body = {
					img: meta.screenshot ? thumb(meta.screenshot) : "",
					desc: expkg.description || "",
					demo:
						meta.online !== false
							? link(
									"Demo",
									meta.demo ||
										`${CONFIG.demoURL}/${exampleName}/`
							  )
							: "",
					src: link(
						"Source",
						`${CONFIG.branchURL}/examples/${exampleName}`
					),
				};
				examples.push(body);
			}
		} catch (e) {
			LOGGER.warn("error reading example", e);
		}
	}
	const headers = ["Screenshot", "Description", "Live demo", "Source"];
	const keys = ["img", "desc", "demo", "src"];
	if (!hasImg) {
		headers.shift();
		keys.shift();
	}
	const [numProjects, verb] =
		examples.length > 1
			? [`${capitalize(namedNumber()(examples.length))} projects`, "are"]
			: ["One project", "is"];
	return examples.length
		? [
				"## Usage examples",
				"",
				`${numProjects} in this repo's`,
				link("/examples", `${CONFIG.branchURL}/examples`),
				`directory ${verb} using this package:`,
				"",
				tableKeys(headers, <any>keys, examples),
		  ].join("\n")
		: "";
};
