// SPDX-License-Identifier: Apache-2.0
import { State, type WithErrorHandlerOpts } from "./api.js";
import { __optsWithID } from "./idgen.js";
import { stream } from "./stream.js";

/**
 * Yields a single-value {@link Stream} of the resolved promise and then
 * automatically marks itself done.
 *
 * @remarks
 * It doesn't matter if the promise resolves before the first subscriber
 * has attached.
 *
 * @param src -
 * @param opts -
 */
export const fromPromise = <T>(
	src: Promise<T>,
	opts?: Partial<WithErrorHandlerOpts>
) => {
	let canceled = false;
	let isError = false;
	let err: any = {};
	src.catch((e) => {
		err = e;
		isError = true;
	});
	return stream<T>((stream) => {
		src.then(
			(x) => {
				if (!canceled && stream.getState() < State.DONE) {
					if (isError) {
						stream.error(err);
						err = null;
					} else {
						stream.next(x);
						stream.closeIn !== "never" && stream.done();
					}
				}
			},
			(e) => stream.error(e)
		);
		return () => {
			canceled = true;
		};
	}, __optsWithID("promise", opts));
};
