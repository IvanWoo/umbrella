// SPDX-License-Identifier: Apache-2.0
import { assert } from "@thi.ng/errors/assert";
import type { FloatBuffer } from "@thi.ng/pixel/float";
import type { KernelSpec } from "./api.js";
import { convolveImage, LANCZOS } from "./convolve.js";

/**
 * Yields an iterator of progressively downsampled versions of `src` (using
 * `kernel` for filtering, default: {@link LANCZOS}(2)). Each image will be half
 * size of the previous result, stopping only once either width or height
 * becomes less than `minSize` (default: 1). If `includeOrig` is enabled
 * (default), the first emitted image will be the original `src`.
 *
 * @param src -
 * @param kernel -
 * @param minSize -
 * @param includeOrig -
 */
export function* imagePyramid(
	src: FloatBuffer,
	kernel: KernelSpec = LANCZOS(2),
	minSize = 1,
	includeOrig = true
) {
	assert(minSize > 0, `invalid min size`);
	minSize <<= 1;
	if (includeOrig) yield src;
	while (src.width >= minSize && src.height >= minSize) {
		src = convolveImage(src, { kernel, stride: 2 });
		yield src;
	}
}
