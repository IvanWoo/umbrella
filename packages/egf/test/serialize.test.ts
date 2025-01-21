// SPDX-License-Identifier: Apache-2.0
import { rdf, schema } from "@thi.ng/prefixes";
import { expect, test } from "bun:test";
// import { writeFileSync } from "node:fs";
import { toEGF } from "../src/index.js";

test("basics", () => {
	const res = toEGF(
		[
			{
				$id: "thi:egf",
				"rdf:type": { $ref: "schema:SoftwareSourceCode" },
				"schema:isPartOf": { $id: "http://thi.ng/umbrella" },
				"schema:dateCreated": new Date("2020-02-16"),
			},
			{
				$id: "thi:umbrella",
				"rdf:type": { $ref: "schema:SoftwareSourceCode" },
				"schema:programmingLanguage": "TypeScript",
			},
		],
		{
			thi: "http://thi.ng/",
			schema,
			rdf,
		}
	);
	// writeFileSync("out.egf", res);
	expect(res).toBe(
		`@prefix thi: http://thi.ng/
@prefix schema: http://schema.org/
@prefix rdf: http://www.w3.org/1999/02/22-rdf-syntax-ns#

thi:egf
\trdf:type -> schema:SoftwareSourceCode
\tschema:isPartOf -> thi:umbrella
\tschema:dateCreated #date 2020-02-16T00:00:00.000Z

thi:umbrella
\trdf:type -> schema:SoftwareSourceCode
\tschema:programmingLanguage TypeScript
`
	);
});
