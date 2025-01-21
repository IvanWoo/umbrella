// SPDX-License-Identifier: Apache-2.0
import { AKSUID } from "./aksuid.js";
import type { KSUIDOpts } from "./api.js";

export class KSUID64 extends AKSUID {
	constructor(opts?: Partial<KSUIDOpts>) {
		super(8, {
			epoch: 1_600_000_000_000,
			bytes: 12,
			...opts,
		});
	}

	timeOnlyBinary(epoch = Date.now(), buf?: Uint8Array) {
		buf = buf || new Uint8Array(this.size);
		const t = this.ensureTime(epoch - this.epoch);
		const h = (t / 0x1_0000_0000) >>> 0;
		const l = (t & 0xffff_ffff) >>> 0;
		buf[0] = h >>> 24;
		buf[1] = (h >> 16) & 0xff;
		buf[2] = (h >> 8) & 0xff;
		buf[3] = h & 0xff;
		buf[4] = l >>> 24;
		buf[5] = (l >> 16) & 0xff;
		buf[6] = (l >> 8) & 0xff;
		buf[7] = l & 0xff;
		return buf;
	}

	parse(id: string) {
		const buf = this.tmp;
		this.base.decodeBytes(id, buf);
		return {
			epoch:
				this.u32(buf) * 0x1_0000_0000 + this.u32(buf, 4) + this.epoch,
			id: buf.slice(8),
		};
	}
}

/**
 * Creates and returns a new 64bit epoch KSUID generator instance (w/
 * millisecond time precision).
 *
 * @param opts -
 */
export const defKSUID64 = (opts?: Partial<KSUIDOpts>): KSUID64 =>
	new KSUID64(opts);
