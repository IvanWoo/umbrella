import type { AABBLike, Attribs, IHiccupShape3 } from "@thi.ng/geom-api";
import { add3 } from "@thi.ng/vectors/add";
import { addN3 } from "@thi.ng/vectors/addn";
import { ZERO3, type Vec } from "@thi.ng/vectors/api";
import { max3 } from "@thi.ng/vectors/max";
import { set3 } from "@thi.ng/vectors/set";
import { subN3 } from "@thi.ng/vectors/subn";
import { __asVec } from "../internal/args.js";
import { __copyAttribs } from "../internal/copy.js";

export class AABB implements AABBLike, IHiccupShape3<AABB> {
	readonly type = "aabb";
	readonly dim = 3;

	size: Vec;

	constructor(
		public pos: Vec = [0, 0, 0],
		size: number | Vec = 1,
		public attribs?: Attribs
	) {
		this.size = __asVec(size, 3);
	}

	copy(): AABB {
		return new AABB(
			set3([], this.pos),
			set3([], this.size),
			__copyAttribs(this)
		);
	}

	withAttribs(attribs: Attribs) {
		return new AABB(this.pos, this.size, attribs);
	}

	max() {
		return add3([], this.pos, this.size);
	}

	offset(offset: number) {
		subN3(null, this.pos, offset);
		max3(null, addN3(null, this.size, offset * 2), ZERO3);
		return this;
	}

	toHiccup() {
		return ["aabb", this.attribs, this.pos, this.size];
	}
}
