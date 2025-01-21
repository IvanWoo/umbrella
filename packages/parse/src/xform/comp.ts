// SPDX-License-Identifier: Apache-2.0
import type { ScopeTransform } from "../api.js";

/**
 * Takes any number of {@link ScopeTransform}s and composes them into
 * new xform w/ left to right order of execution.
 *
 * @param xforms -
 */
export const comp = <T>(...xforms: ScopeTransform<T>[]): ScopeTransform<T> => {
	const [a, b, c, d] = xforms;
	switch (xforms.length) {
		case 0:
			return (x) => x;
		case 1:
			return a;
		case 2:
			return (scope, ctx, user) => b(a(scope, ctx, user), ctx, user);
		case 3:
			return (scope, ctx, user) =>
				c(b(a(scope, ctx, user), ctx, user), ctx, user);
		case 4:
			return (scope, ctx, user) =>
				d(c(b(a(scope, ctx, user), ctx, user), ctx, user), ctx, user);
		default:
			return (scope, ctx, user) =>
				xforms.reduce((scope, x) => x(scope, ctx, user), scope);
	}
};
