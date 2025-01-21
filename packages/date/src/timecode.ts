// SPDX-License-Identifier: Apache-2.0
import { Z2 } from "@thi.ng/strings/pad-left";
import { decomposeDuration } from "./duration.js";

/**
 * Returns a time formatter for given FPS (frames / second, in [1..1000] range),
 * e.g. `HH:mm:ss:ff`. The returned function takes a single arg (time in
 * milliseconds) and returns formatted string.
 *
 * @remarks
 * The timecode considers days too, but only includes them in the result if the
 * day part is non-zero. The 4 separators between each field can be customized
 * via 2nd arg (default: all `:`).
 *
 * @example
 * ```ts tangle:../export/timecode.ts
 * import { defTimecode, DAY, HOUR, MINUTE, SECOND } from "@thi.ng/date";
 *
 * const fmt = defTimecode(30);
 *
 * console.log(
 *   fmt(HOUR + 2*MINUTE + 3*SECOND + 4*1000/30)
 * );
 * // "01:02:03:04"
 *
 * console.log(fmt(DAY));
 * // "01:00:00:00:00"
 *
 * const fmt2 = defTimecode(30, ["d ", "h ", "' ", '" ']);
 *
 * console.log(
 *   fmt2(DAY + HOUR + 2 * MINUTE + 3 * SECOND + 999)
 * );
 * // "01d 01h 02' 03" 29"
 * ```
 *
 * @param fps -
 * @param sep -
 */
export const defTimecode = (fps: number, sep: ArrayLike<string> = "::::") => {
	const frame = 1000 / fps;
	return (t: number) => {
		const [_, __, d, h, m, s, ms] = decomposeDuration(t);
		const parts = [
			Z2(h),
			sep[1],
			Z2(m),
			sep[2],
			Z2(s),
			sep[3],
			Z2((ms / frame) | 0),
		];
		d > 0 && parts.unshift(Z2(d), sep[0]);
		return parts.join("");
	};
};
