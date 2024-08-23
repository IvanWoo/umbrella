import { type Fn } from "@thi.ng/api";
import { cliApp, flag, string, strings, type CommandCtx } from "@thi.ng/args";
import { dirs, files, readJSON } from "@thi.ng/file-io";
import type { ILogger } from "@thi.ng/logger";
import { preferredType } from "@thi.ng/mime";
import { map } from "@thi.ng/transducers";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { basename, resolve } from "node:path";
import {
	AWS_PROFILE,
	CF_DISTRO_EXAMPLES,
	S3_BUCKET_EXAMPLES,
	S3_OPTS,
} from "./aws-config.js";

interface UploadOpts {
	ext: string;
	compress: boolean;
	depth: number;
	process: Fn<string, void>;
}
interface CLIOpts {
	noInvalidate: boolean;
	base: string;
}

interface CLICtx extends CommandCtx<CLIOpts, any> {}

const COMPRESS_OPTS = `${S3_OPTS} --content-encoding br`;
const DEST_BASE = "/umbrella";
const NEVER_COMPRESS = new Set(["mp4"]);

const execAWS = (args: string, logger: ILogger) => {
	const $args = args.split(" ");
	logger.info("aws", args);
	execFileSync("aws", $args);
};

const deploy = async ({ opts, logger }: CLICtx, name: string) => {
	const BASE = `${opts.base}/${name}`;
	const BUILD = `${opts.base}/${name}/dist/`;
	const DEST_DIR = `${DEST_BASE}/${name}`;
	const PKG = readJSON(resolve(`${BASE}/package.json`), logger);

	if (PKG["thi.ng"]?.online === false) {
		logger.warn("example marked as offline-only, skipping...");
		return;
	}

	execFileSync(
		"find",
		`${BASE} -type f -name '*.DS_Store' -ls -delete`.split(" ")
	);

	const uploadAssets = (dir: string, opts?: Partial<UploadOpts>) => {
		const root = `${BUILD}${dir}`;
		if (!existsSync(root)) return;
		opts = { ext: "", compress: true, depth: Infinity, ...opts };
		for (let f of files(root, opts.ext!, opts.depth)) {
			const fd = `${S3_BUCKET_EXAMPLES}${DEST_DIR}/${f
				.replace(BUILD, "")
				.substring(dir === "" ? 1 : 0)}`;
			const ext = f.substring(f.lastIndexOf(".") + 1);
			const type = preferredType(ext);
			logger.debug(f, "->", fd, type);
			opts.process && opts.process(f);
			if (opts.compress && !NEVER_COMPRESS.has(ext)) {
				execFileSync("brotli", ["-9", f]);
				execAWS(
					`s3 cp ${f}.br ${fd} ${COMPRESS_OPTS} --content-type ${type}`,
					logger
				);
			} else {
				execAWS(
					`s3 cp ${f} ${fd} ${S3_OPTS} --content-type ${type}`,
					logger
				);
			}
		}
	};

	uploadAssets("assets");

	uploadAssets("js", { ext: ".js", depth: 2 });
	uploadAssets("", { ext: ".js", depth: 1 });
	uploadAssets("", { ext: ".html" });

	if (!opts.noInvalidate) {
		logger.info("invaliding", DEST_DIR);
		execAWS(
			`cloudfront create-invalidation --distribution-id ${CF_DISTRO_EXAMPLES} --paths ${DEST_DIR}/* ${AWS_PROFILE}`,
			logger
		);
	}
};

cliApp<CLIOpts, CLICtx>({
	opts: {
		base: string({
			alias: "b",
			desc: "Examples base directory",
			default: "examples",
		}),
		noInvalidate: flag({
			alias: "n",
			desc: "Don't create a CDN invalidation for the example(s)",
		}),
	},
	commands: {
		default: {
			desc: "Deploy example(s) to CDN",
			fn: async (ctx) => {
				let inputs = ctx.inputs;
				let isAll = !inputs.length;
				if (isAll) {
					inputs = [...map(basename, dirs(ctx.opts.base, "", 1))];
					ctx.opts.noInvalidate = true;
				}
				for (let name of inputs) {
					ctx.logger.info("--------------------------------");
					ctx.logger.info(name);
					try {
						await deploy(ctx, name);
					} catch (e) {
						ctx.logger.severe(
							"error deploying:",
							name,
							(<Error>e).message
						);
					}
				}
				if (isAll) {
					ctx.logger.info("invaliding all");
					execAWS(
						`cloudfront create-invalidation --distribution-id ${CF_DISTRO_EXAMPLES} --paths ${DEST_BASE}/* ${AWS_PROFILE}`,
						ctx.logger
					);
				}
				ctx.logger.info("done");
			},
			opts: {},
		},
	},
	single: true,
	name: "deploy-example",
	ctx: async (ctx) => ctx,
	usage: {
		prefix: "Usage: deploy-example [OPTS] [NAME...]",
		paramWidth: 20,
	},
});
