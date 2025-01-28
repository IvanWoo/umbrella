import { isArray, isProtoPath } from "@thi.ng/checks";
import { illegalArgs } from "@thi.ng/errors";
import { setInUnsafe, updateInUnsafe } from "@thi.ng/paths";
import type { IncomingMessage } from "node:http";

export const parseSearchParams = (params: URLSearchParams) => {
	const acc: Record<string, any> = {};
	for (let [k, v] of params) {
		if (k.includes("[")) return parseObjectVal(acc, k, v);
		if (!isProtoPath(k)) acc[k] = v;
	}
	return acc;
};

export const parseQuerystring = (url: string): Record<string, any> => {
	const idx = url.indexOf("?");
	return idx >= 0 ? parseFormData(url.substring(idx + 1)) : {};
};

export const parseRequestFormData = async (req: IncomingMessage) => {
	let body = "";
	for await (let chunk of req) body += chunk.toString();
	return parseFormData(body);
};

export const parseFormData = (body: string) =>
	body.split("&").reduce((acc, x) => {
		x = decodeURIComponent(x.replace(/\+/g, " "));
		const idx = x.indexOf("=");
		if (idx < 1) return acc;
		const k = x.substring(0, idx);
		const v = x.substring(idx + 1);
		if (k.includes("[")) return parseObjectVal(acc, k, v);
		if (!isProtoPath(k)) acc[k] = v;
		return acc;
	}, <Record<string, any>>{});

const parseObjectVal = (acc: Record<string, any>, key: string, val: string) => {
	const parts = key.split("[");
	if (!parts[0]) __illegal(key);
	const path: string[] = [parts[0]];
	for (let i = 1, n = parts.length - 1; i <= n; i++) {
		const p = parts[i];
		if (p === "]") {
			if (i < n) __illegal(key);
			return !isProtoPath(path)
				? updateInUnsafe(acc, path, (curr) =>
						isArray(curr) ? [...curr, val] : [val]
				  )
				: acc;
		}
		const idx = p.indexOf("]");
		if (idx < 0 || idx < p.length - 1) __illegal(key);
		path.push(p.substring(0, p.length - 1));
	}
	return !isProtoPath(path) ? setInUnsafe(acc, path, val) : acc;
};

const __illegal = (key: string) => illegalArgs("invalid form param: " + key);
