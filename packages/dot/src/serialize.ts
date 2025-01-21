// SPDX-License-Identifier: Apache-2.0
import type { IObjectOf } from "@thi.ng/api";
import { isArray } from "@thi.ng/checks/is-array";
import type { Edge, Graph, GraphAttribs, Node } from "./api.js";

/** @internal */
let __nextID = 0;

/** @internal */
const __nextSubgraphID = () => "cluster" + __nextID++;

/** @internal */
const __wrapQ = (x: any) => `"${x}"`;

/** @internal */
const __escape = (x: any) =>
	String(x).replace(/"/g, `\\"`).replace(/\n/g, "\\n");

/** @internal */
const __formatGraphAttribs = (
	attribs: Partial<GraphAttribs>,
	acc: string[]
) => {
	for (let a in attribs) {
		let v = attribs[a];
		switch (a) {
			case "bgcolor":
			case "color":
			case "fillcolor":
			case "fontcolor":
				isArray(v) && (v = v.join(","));
				break;
			case "edge":
				acc.push(`edge[${__formatAttribs(v)}];`);
				continue;
			case "node":
				acc.push(`node[${__formatAttribs(v)}];`);
				continue;
			default:
				break;
		}
		acc.push(`${a}="${__escape(v)}";`);
	}
	return acc;
};

/** @internal */
const __formatAttribs = (attribs: Partial<Node | Edge>) => {
	const acc: string[] = [];
	for (let a in attribs) {
		let v = attribs[a];
		switch (a) {
			case "color":
			case "fillcolor":
			case "fontcolor":
				isArray(v) && (v = v.join(","));
				break;
			case "label":
				if ((<Node>attribs).ins || (<Node>attribs).outs) {
					v = __formatPortLabel(attribs, v);
				}
				break;
			case "url":
				a = "URL";
				break;
			case "ins":
			case "outs":
			case "src":
			case "dest":
			case "srcPort":
			case "destPort":
				continue;
			default:
		}
		acc.push(`${a}="${__escape(v)}"`);
	}
	return acc.join(", ");
};

/** @internal */
const __formatPorts = (ports: IObjectOf<string>) => {
	const acc: string[] = [];
	for (let i in ports) {
		acc.push(`<${i}> ${__escape(ports[i])}`);
	}
	return `{ ${acc.join(" | ")} }`;
};

/** @internal */
const __formatPortLabel = (node: Partial<Node>, label: string) => {
	const acc: string[] = [];
	node.ins && acc.push(__formatPorts(node.ins));
	acc.push(__escape(label));
	node.outs && acc.push(__formatPorts(node.outs));
	return acc.join(" | ");
};

export const serializeNode = (id: string, n: Partial<Node>) => {
	const attribs = __formatAttribs(n);
	return attribs.length ? `"${id}"[${attribs}];` : `"${id}";`;
};

export const serializeEdge = (e: Edge, directed = true) => {
	const acc: string[] = [__wrapQ(e.src)];
	e.srcPort != null && acc.push(":", __wrapQ(e.srcPort));
	acc.push(directed ? " -> " : " -- ");
	acc.push(__wrapQ(e.dest));
	e.destPort != null && acc.push(":", __wrapQ(e.destPort));
	const attribs = __formatAttribs(e);
	attribs.length && acc.push("[", attribs, "]");
	acc.push(";");
	return acc.join("");
};

export const serializeGraph = (graph: Graph, isSub = false) => {
	const directed = graph.directed !== false;
	const acc = isSub
		? [`subgraph ${graph.id || __nextSubgraphID()} {`]
		: [`${directed ? "di" : ""}graph ${graph.id || "g"} {`];
	if (graph.include) {
		acc.push(graph.include);
	}
	if (graph.attribs) {
		__formatGraphAttribs(graph.attribs, acc);
	}
	for (let id in graph.nodes) {
		acc.push(serializeNode(id, graph.nodes[id]));
	}
	for (let e of graph.edges) {
		acc.push(serializeEdge(e, directed));
	}
	if (graph.sub) {
		for (let sub of graph.sub) {
			acc.push(serializeGraph(sub, true));
		}
	}
	acc.push("}");
	return acc.join("\n");
};
