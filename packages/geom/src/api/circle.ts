import type { Attribs, IHiccupShape2 } from "@thi.ng/geom-api";
import type { Vec } from "@thi.ng/vectors";
import { set2 } from "@thi.ng/vectors/set";
import { __copyAttribs } from "../internal/copy.js";

export class Circle implements IHiccupShape2<Circle> {
	readonly type = "circle";
	readonly dim = 2;

	constructor(
		public pos: Vec = [0, 0],
		public r = 1,
		public attribs?: Attribs
	) {}

	copy(): Circle {
		return new Circle(set2([], this.pos), this.r, __copyAttribs(this));
	}

	withAttribs(attribs: Attribs) {
		return new Circle(this.pos, this.r, attribs);
	}

	toHiccup() {
		return [this.type, this.attribs, this.pos, this.r];
	}
}
