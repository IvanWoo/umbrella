// SPDX-License-Identifier: Apache-2.0
import { DB } from "./generated.js";

/**
 * Decodes list of extensions, taking compressible flag into account.
 *
 * @internal
 */
const __ext = (val: string) => val.substring(~~(val[0] === "1")).split(",");

const __group = (mime: string) => {
	const [prefix, suffix] = mime.split("/");
	const group = DB[prefix];
	return group ? group[suffix] : undefined;
};

// https://www.iana.org/assignments/media-types/

export const MIME_TYPES = ((defs: any) => {
	const res: Record<string, string[]> = {};
	for (let groupID in defs) {
		const group = defs[groupID];
		for (let type in group) {
			const mime = groupID + "/" + type;
			for (let e of __ext(group[type])) {
				const isLowPri = e[0] === "*";
				const ext = isLowPri ? e.substring(1) : e;
				let coll = res[ext];
				!coll && (coll = res[ext] = []);
				isLowPri ? coll.push(mime) : coll.unshift(mime);
			}
		}
	}
	return res;
})(DB);

/**
 * Returns preferred MIME type for given file extension `ext`, or if no match is
 * available, the `fallback` MIME type (default: `application/octet-stream`).
 * `ext` is converted to lowercase first.
 *
 * @remarks
 * Since v0.2.0 the extension can be given as either `".ext"` or `"ext"`.
 * Previously, only the latter was supported.
 *
 * Also see {@link preferredExtension} for reverse operation.
 *
 * @param ext -
 * @param fallback -
 */
export const preferredType = (ext: string, fallback = MIME_TYPES.bin[0]) => {
	ext = ext.toLowerCase();
	const type = MIME_TYPES[ext[0] === "." ? ext.substring(1) : ext];
	return type ? type[0] : fallback;
};

/**
 * Similar to {@link preferredType}, but accepts a file path and first
 * auto-extracts file extension.
 *
 * @param path
 * @param fallback
 */
export const preferredTypeForPath = (path: string, fallback?: string) =>
	preferredType(path.substring(path.lastIndexOf(".")), fallback);

/**
 * Reverse lookup to {@link preferredType}. Takes MIME type string and returns
 * preferred file extension (or failing that) returns `fallback` (default:
 * "bin").
 *
 * @param mime -
 * @param fallback -
 */
export const preferredExtension = (mime: string, fallback = "bin") => {
	const group = __group(mime);
	const ext = group ? __ext(group) : undefined;
	return ext
		? ext.find((x) => x[0] !== "*") || ext[0].substring(1)
		: fallback;
};

/**
 * Returns all known file extensions for given MIME type or undefined if
 * unknown.
 *
 * @param mime
 */
export const extensionsForType = (mime: string) => {
	const group = __group(mime);
	const ext = group ? __ext(group) : undefined;
	return ext
		? ext.map((x) => (x[0] === "*" ? x.substring(1) : x))
		: undefined;
};

/**
 * Returns true if the given MIME type can be compressed (or served using
 * gzip/brotli encoding).
 *
 * @remarks
 * Note: Information here is included as is. Some of these judgements in the
 * original mime-db project (or their sources of information) are highly
 * questionable...
 *
 * @param mime
 */
export const isCompressible = (mime: string) => !!(__group(mime)?.[0] === "1");

export * from "./presets.js";
