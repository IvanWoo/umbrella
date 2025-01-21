// SPDX-License-Identifier: Apache-2.0
import type { Fn0 } from "@thi.ng/api";
import { isString } from "@thi.ng/checks/is-string";
import type { Locale, LocaleSpec, LocaleUnit, Precision } from "./api.js";
import { EN_SHORT } from "./i18n/en.js";

/** @internal */
const __prepLocale = (spec: LocaleSpec): Locale => {
	const locale = <Locale>{
		sepED: " ",
		sepDM: "/",
		sepMY: "/",
		sepHM: ":",
		date: ["E", "/ED", "d", "/DM", "MMM", "/MY", "yyyy"],
		time: ["H", "/HM", "mm"],
		...spec,
	};
	!locale.dateTime &&
		(locale.dateTime = [...locale.date, ", ", ...locale.time]);
	return locale;
};

/**
 * Sets {@link LOCALE} for formatting and fills in missing default values.
 * Unless called explicitly, the package uses {@link EN_SHORT} by default.
 *
 * @param locale -
 */
export const setLocale = (locale: LocaleSpec): Locale =>
	(LOCALE = __prepLocale(locale));

/**
 * Executes given `fn` with temporarily active `locale`. Returns result of `fn`.
 *
 * @remarks
 * `fn` will be called within a try/catch block and the previous locale will be
 * restored even if `fn` throws an error.
 *
 * @param locale -
 * @param fn -
 */
export const withLocale = <T>(locale: LocaleSpec, fn: Fn0<T>) => {
	const old = LOCALE;
	setLocale(locale);
	try {
		const res = fn();
		setLocale(old);
		return res;
	} catch (e) {
		setLocale(old);
		throw e;
	}
};

export let LOCALE = __prepLocale(EN_SHORT);

/**
 * Returns a copy of current {@link LOCALE}'s weekday names array.
 */
export const weekdayNames = () => LOCALE.days.slice();

/**
 * Returns a copy of current {@link LOCALE}'s month names array.
 */
export const monthNames = () => LOCALE.months.slice();

/**
 * Returns a suitable version of requested `unit` from current {@link LOCALE},
 * based on quantity `x` and optional dativ grammar form. If `unitsOnly` is true
 * (default false) only the unit (w/o quantity) will be returned.
 *
 * @remarks
 * Also see {@link unitsLessThan}, {@link formatRelative},
 * {@link formatRelativeParts}.
 *
 * @example
 * ```ts tangle:../export/units.ts
 * import { units, withLocale, FR_LONG, DE_LONG } from "@thi.ng/date";
 *
 * console.log(
 *   withLocale(FR_LONG, () => units(1, "y"))
 * );
 * // "1 année"
 *
 * console.log(
 *   withLocale(FR_LONG, () => units(1, "y", true))
 * );
 * // "1 an"
 *
 * console.log(
 *   withLocale(FR_LONG, () => units(2, "y"))
 * );
 * // "2 ans"
 *
 * console.log(
 *   withLocale(FR_LONG, () => units(2, "y", true))
 * );
 * // "2 ans"
 *
 * console.log(
 *   withLocale(DE_LONG, () => units(2, "y"))
 * );
 * // "2 Jahre"
 *
 * console.log(
 *   withLocale(DE_LONG, () => units(2, "y", true))
 * );
 * // "2 Jahren"
 * ```
 *
 * @param x -
 * @param unit -
 * @param isDativ -
 * @param unitsOnly -
 */
export const units = (
	x: number,
	unit: Precision | LocaleUnit,
	isDativ = false,
	unitsOnly = false
) => {
	unit = isString(unit) ? LOCALE.units[unit] : unit;
	const res =
		x > 1 || x === 0
			? isDativ
				? unit.pd || unit.p
				: unit.p
			: isDativ
			? unit.sd || unit.s
			: unit.s;
	return unitsOnly ? res : `${x} ${res}`;
};

/**
 * Similar to {@link units}, but for cases to express/format the phrase `less
 * than {x} {unit(s)}`.
 *
 * @example
 * ```ts tangle:../export/units-less-than.ts
 * import { unitsLessThan, withLocale, DE_LONG } from "@thi.ng/date";
 *
 * console.log(
 *   withLocale(DE_LONG, () => unitsLessThan(1, "y"))
 * );
 * // "weniger als 1 Jahr"
 * ```
 *
 * @param x -
 * @param unit -
 * @param isDativ -
 */
export const unitsLessThan = (
	x: number,
	unit: Precision | LocaleUnit,
	isDativ = false
) =>
	`${LOCALE.less.replace("%s", String(x))} ${units(
		Math.max(x, 1),
		unit,
		isDativ,
		true
	)}`;

/**
 * Wraps given (presumably localized) string in current {@link LOCALE}'s `past`
 * or `future` phrases, depending on given `sign`.
 *
 * @param sign -
 * @param res -
 */
export const tense = (sign: number, res: string) =>
	(sign < 0 ? LOCALE.past : LOCALE.future).replace("%s", res);
