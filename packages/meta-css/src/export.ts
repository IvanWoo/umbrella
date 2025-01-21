// SPDX-License-Identifier: Apache-2.0
// thing:no-export
import type { Maybe } from "@thi.ng/api";
import type { Command } from "@thi.ng/args";
import { readJSON, readText } from "@thi.ng/file-io";
import {
	COMPACT,
	PRETTY,
	QUOTED_FNS,
	at_media,
	css,
	type CSSOpts,
} from "@thi.ng/hiccup-css";
import type { ILogger } from "@thi.ng/logger";
import { resolve } from "node:path";
import {
	ARG_INCLUDE,
	ARG_MEDIA_QUERIES,
	ARG_NO_DECLS,
	ARG_NO_HEADER,
	ARG_ONLY_DECLS,
	ARG_OUTPUT,
	ARG_PRETTY,
	ARG_SCOPE,
	type AppCtx,
	type CommonOpts,
	type CompiledSpecs,
} from "./api.js";
import { generateHeader, maybeWriteText, withoutInternals } from "./utils.js";

interface ExportOpts extends CommonOpts {
	include?: string[];
	media?: string[];
	noDecls: boolean;
	noHeader: boolean;
	onlyDecls: boolean;
	out?: string;
	pretty: boolean;
	scope?: string;
}

export const EXPORT: Command<ExportOpts, CommonOpts, AppCtx<ExportOpts>> = {
	desc: "Export entire generated framework as CSS",
	opts: {
		...ARG_INCLUDE,
		...ARG_NO_DECLS,
		...ARG_ONLY_DECLS,
		...ARG_OUTPUT,
		...ARG_PRETTY,
		...ARG_NO_HEADER,
		...ARG_MEDIA_QUERIES,
		...ARG_SCOPE,
	},
	inputs: 1,
	fn: async (ctx) => {
		const {
			logger,
			opts: {
				include,
				media,
				noDecls,
				noHeader,
				onlyDecls,
				out,
				pretty,
				scope,
			},
			inputs,
		} = ctx;
		const cssOpts: Partial<CSSOpts> = {
			format: pretty ? PRETTY : COMPACT,
			fns: QUOTED_FNS,
			scope,
		};
		const specs = readJSON<CompiledSpecs>(resolve(inputs[0]), logger);
		const bundle: string[] = include
			? include.map((x) => readText(resolve(x), logger).trim())
			: [];
		if (!noHeader) bundle.push(generateHeader(specs));
		if (!noDecls && specs.decls.length) {
			bundle.push(css(specs.decls, cssOpts));
		}
		if (!onlyDecls) {
			bundle.push(serializeSpecs(specs, media, cssOpts, logger));
		}
		maybeWriteText(out, bundle, logger);
	},
};

export const serializeSpecs = (
	specs: CompiledSpecs,
	media: Maybe<string[]>,
	opts: Partial<CSSOpts>,
	logger: ILogger
) => {
	const rules: any[] = __suffixed("", specs);
	if (media) {
		const mediaIDs = media[0] === "ALL" ? Object.keys(specs.media) : media;
		for (let id of mediaIDs) {
			const query = specs.media[id];
			if (query) {
				rules.push(
					at_media(specs.media[id], __suffixed("-" + id, specs))
				);
			} else {
				logger.warn(`invalid media query ID: ${id}, skipping...`);
			}
		}
	}
	return css(rules, opts);
};

/** @internal */
const __suffixed = (suffix: string, specs: CompiledSpecs) =>
	Object.entries(specs.classes).map(([id, props]) => [
		`.${id}${suffix}`,
		withoutInternals(props),
	]);
