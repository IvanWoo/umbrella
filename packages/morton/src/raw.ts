// SPDX-License-Identifier: Apache-2.0
import type { FnN } from "@thi.ng/api";

export const encode5: FnN = (x) => {
	x &= 0x0000001f;
	x = (x * 0x01041041) & 0x10204081;
	x = (x * 0x00108421) & 0x15500000;
	return x >>> 20;
};

export const encode10: FnN = (x) => {
	x &= 0x000003ff; // ---- ---- ---- ---- ---- --98 7654 3210
	x = (x | (x << 16)) & 0xff0000ff; // ---- --98 ---- ---- ---- ---- 7654 3210
	x = (x | (x << 8)) & 0x0300f00f; // ---- --98 ---- ---- 7654 ---- ---- 3210
	x = (x | (x << 4)) & 0x030c30c3; // ---- --98 ---- 76-- --54 ---- 32-- --10
	x = (x | (x << 2)) & 0x09249249; // ---- 9--8 --7- -6-- 5--4 --3- -2-- 1--0
	return x >>> 0;
};

export const encode16: FnN = (x) => {
	x &= 0x0000ffff; // ---- ---- ---- ---- fedc ba98 7654 3210
	x = (x | (x << 8)) & 0x00ff00ff; // ---- ---- fedc ba98 ---- ---- 7654 3210
	x = (x | (x << 4)) & 0x0f0f0f0f; // ---- fedc ---- ba98 ---- 7654 ---- 3210
	x = (x | (x << 2)) & 0x33333333; // --fe --dc --ba --98 --76 --54 --32 --10
	x = (x | (x << 1)) & 0x55555555; // -f-e -d-c -b-a -9-8 -7-6 -5-4 -3-2 -1-0
	return x >>> 0;
};

export const decode5: FnN = (x) => {
	x &= 0x00000155;
	x = (x | (x >> 1)) & 0x00000133;
	x = (x | (x >> 2)) & 0x0000010f;
	x = (x | (x >> 4)) & 0x0000001f;
	return x;
};

export const decode10: FnN = (x) => {
	x &= 0x09249249;
	x = (x | (x >> 2)) & 0x030c30c3;
	x = (x | (x >> 4)) & 0x0300f00f;
	x = (x | (x >> 8)) & 0xff0000ff;
	x = (x | (x >> 16)) & 0x000003ff;
	return x;
};

export const decode16: FnN = (x) => {
	x &= 0x55555555;
	x = (x | (x >> 1)) & 0x33333333;
	x = (x | (x >> 2)) & 0x0f0f0f0f;
	x = (x | (x >> 4)) & 0x00ff00ff;
	x = (x | (x >> 8)) & 0x0000ffff;
	return x;
};
