// SPDX-License-Identifier: Apache-2.0
import { BitMatrix } from "@thi.ng/bitfield/bitmatrix";
import type { DegreeType, Edge, IGraph } from "./api.js";
import { __into, __invert, __toDot } from "./utils.js";

/**
 * Adjacency matrix representation for both directed and undirected graphs and
 * using a compact bit matrix to store edges. Each edge requires only 1 bit
 * in directed graphs or 2 bits in undirected graphs. E.g. this is allows
 * storing 16384 directed edges in just 2KB of memory (128 * 128 / 8 = 2048).
 */
export class AdjacencyBitMatrix implements IGraph<number> {
	mat: BitMatrix;
	protected undirected: boolean;
	protected numE: number;

	constructor(n: number, edges?: Iterable<Edge>, undirected = false) {
		this.mat = new BitMatrix(n);
		this.undirected = undirected;
		this.numE = 0;
		edges && __into(this, edges);
	}

	*edges() {
		const directed = !this.undirected;
		for (let i = this.mat.m; i-- > 0; ) {
			for (let n of this.neighbors(i)) {
				if (directed || n > i) {
					yield <Edge>[i, n];
				}
			}
		}
	}

	numEdges(): number {
		return this.numE;
	}

	numVertices(): number {
		return this.mat.m;
	}

	/**
	 * Resizes matrix to new size given.
	 *
	 * @param n - new max vertices
	 */
	resize(n: number) {
		this.mat.resize(n);
		return this;
	}

	addEdge(from: number, to: number) {
		if (!this.mat.setAt(from, to, true)) {
			this.numE++;
			this.undirected && this.mat.setAt(to, from, true);
			return true;
		}
		return false;
	}

	removeEdge(from: number, to: number) {
		if (this.mat.setAt(from, to, false)) {
			this.numE--;
			this.undirected && this.mat.setAt(to, from, false);
			return true;
		}
		return false;
	}

	hasEdge(from: number, to: number) {
		return this.mat.at(from, to) !== 0;
	}

	hasVertex(id: number): boolean {
		return (
			this.mat.popCountRow(id) !== 0 || this.mat.popCountColumn(id) !== 0
		);
	}

	degree(id: number, type: DegreeType = "out") {
		let degree = 0;
		if (this.undirected || type !== "in")
			degree += this.mat.popCountRow(id);
		if (!this.undirected && type !== "out")
			degree += this.mat.popCountColumn(id);
		return degree;
	}

	neighbors(id: number) {
		return [...this.mat.row(id, true).positions()];
	}

	similarity(id: number, threshold = 0) {
		const mat = this.mat;
		const query = mat.row(id, true);
		const acc: number[][] = [];
		for (let i = 0, m = mat.m; i < m; i++) {
			if (i === id) continue;
			const sim = query.similarity(mat.row(i, true));
			if (sim >= threshold) acc.push([i, sim]);
		}
		return acc.sort((a, b) => b[1] - a[1]);
	}

	invert(): AdjacencyBitMatrix {
		return __invert(
			new AdjacencyBitMatrix(this.mat.n, undefined, this.undirected),
			this.edges()
		);
	}

	toString() {
		return this.mat.toString();
	}

	toDot(ids?: string[]) {
		return __toDot(this.edges(), this.undirected, ids);
	}
}

/**
 * Creates adjacency matrix backed by a
 * [`BitMatrix`](https://docs.thi.ng/umbrella/bitfield/classes/BitMatrix.html)
 * with capacity `n` (max vertices), optionally initialized with given edge
 * pairs. Each edge is `[src-node dest-node]`. If `undirected` is true (default:
 * false), creates symmetrical adjacencies.
 *
 * @param n - max vertices
 * @param edges - edge pairs
 * @param undirected -true, if undirected
 */
export const defAdjBitMatrix = (
	n: number,
	edges?: Iterable<Edge>,
	undirected?: boolean
) => new AdjacencyBitMatrix(n, edges, undirected);
