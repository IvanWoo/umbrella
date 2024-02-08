// thing:no-export
import { isString } from "@thi.ng/checks";
import { readText, writeText } from "@thi.ng/file-io";
import type { ILogger } from "@thi.ng/logger";
import { Stream, reactive, sync } from "@thi.ng/rstream";
import { Z4 } from "@thi.ng/strings";
import { assocObj, map } from "@thi.ng/transducers";
import { watch } from "fs";
import { resolve } from "path";
import type { CompiledSpecs } from "./api.js";

export const maybeWriteText = (
	out: string | undefined,
	body: string | string[],
	logger: ILogger
) => {
	body = isString(body) ? body : body.join("\n");
	out
		? writeText(resolve(out), body, logger)
		: process.stdout.write(body + "\n");
};

export const generateHeader = ({ info: { name, version } }: CompiledSpecs) =>
	`/*! ${name} v${version} - generated by thi.ng/meta-css @ ${new Date().toISOString()} */`;

export const watchInputs = (paths: string[], logger: ILogger) => {
	const close = () => {
		logger.info("closing watchers...");
		inputs.forEach((i) => i.watcher.close());
	};
	const inputs = paths.map((file, i) => {
		file = resolve(file);
		const input = reactive(readText(file, logger), {
			id: `in${Z4(i)}`,
		});
		return {
			input,
			watcher: watch(file, {}, (event) => {
				if (event === "change") {
					try {
						input.next(readText(file, logger));
					} catch (e) {
						logger.warn((<Error>e).message);
						close();
					}
				} else {
					logger.warn(`input removed:`, file);
					close();
				}
			}),
		};
	});
	// close watchers when ctrl-c is pressed
	process.on("SIGINT", close);
	return sync({
		src: assocObj<Stream<string>>(
			map(
				({ input }) => <[string, Stream<string>]>[input.id, input],
				inputs
			)
		),
	});
};
