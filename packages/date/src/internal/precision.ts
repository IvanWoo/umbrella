// SPDX-License-Identifier: Apache-2.0
import type { Precision } from "../api.js";

/**
 * Converts a {@link Precision} into a numeric ID.
 *
 * @param prec -
 *
 * @internal
 */
export const __precisionToID = (prec: Precision) => "yMdhmst".indexOf(prec);

/**
 * Inverse op of {@link __precisionToID}.
 *
 * @param id -
 *
 * @internal
 */
export const __idToPrecision = (id: number) => <Precision>"yMdhmst".charAt(id);
