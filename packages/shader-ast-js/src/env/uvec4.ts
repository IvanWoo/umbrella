// SPDX-License-Identifier: Apache-2.0
import { addNU4 } from "@thi.ng/vectors/addnu";
import { addU4 } from "@thi.ng/vectors/addu";
import { bitAndU4 } from "@thi.ng/vectors/bit-andu";
import { bitNotU4 } from "@thi.ng/vectors/bit-notu";
import { bitOrU4 } from "@thi.ng/vectors/bit-oru";
import { bitXorU4 } from "@thi.ng/vectors/bit-xoru";
import { divNU4 } from "@thi.ng/vectors/divnu";
import { divU4 } from "@thi.ng/vectors/divu";
import { fmod4 } from "@thi.ng/vectors/fmod";
import { fmodN4 } from "@thi.ng/vectors/fmodn";
import { lshiftNU4 } from "@thi.ng/vectors/lshiftnu";
import { lshiftU4 } from "@thi.ng/vectors/lshiftu";
import { mulNU4 } from "@thi.ng/vectors/mulnu";
import { mulU4 } from "@thi.ng/vectors/mulu";
import { rshiftNU4 } from "@thi.ng/vectors/rshiftnu";
import { rshiftU4 } from "@thi.ng/vectors/rshiftu";
import { subNU4 } from "@thi.ng/vectors/subnu";
import { subU4 } from "@thi.ng/vectors/subu";
import type { JSBuiltinsIntVec } from "../api.js";
import { POOL_UVEC4 } from "../pool.js";
import { VEC4 } from "./vec4.js";

const { next, uniform } = POOL_UVEC4;

export const UVEC4: JSBuiltinsIntVec = {
	...VEC4(POOL_UVEC4),
	add: (a, b) => addU4(next(), a, b),
	addvn: (a, b) => addNU4(next(), a, b),
	addnv: (a, b) => addNU4(next(), b, a),
	div: (a, b) => divU4(next(), a, b),
	divvn: (a, b) => divNU4(next(), a, b),
	divnv: (a, b) => divU4(null, uniform(a), b),
	modi: (a, b) => fmod4(next(), a, b),
	modivn: (a, b) => fmodN4(next(), a, b),
	modinv: (a, b) => fmod4(null, uniform(a), b),
	mul: (a, b) => mulU4(next(), a, b),
	mulvn: (a, b) => mulNU4(next(), a, b),
	mulnv: (a, b) => mulNU4(next(), b, a),
	sub: (a, b) => subU4(next(), a, b),
	subvn: (a, b) => subNU4(next(), a, b),
	subnv: (a, b) => subU4(null, uniform(a), b),
	bitand: (a, b) => bitAndU4(next(), a, b),
	lshift: (a, b) => lshiftU4(next(), a, b),
	lshiftvn: (a, b) => lshiftNU4(next(), a, b),
	bitnot1: (a) => bitNotU4(next(), a),
	bitor: (a, b) => bitOrU4(next(), a, b),
	rshift: (a, b) => rshiftU4(next(), a, b),
	rshiftvn: (a, b) => rshiftNU4(next(), a, b),
	bitxor: (a, b) => bitXorU4(next(), a, b),
};
