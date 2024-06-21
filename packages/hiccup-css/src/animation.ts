import type { IObjectOf } from "@thi.ng/api";
import { at_keyframes, type Keyframe } from "./keyframes.js";

export interface AnimationOpts {
	delay: string;
	direction:
		| "unset"
		| "inherit"
		| "initial"
		| "normal"
		| "reverse"
		| "alternate"
		| "alternate-reverse";
	duration: string;
	"fill-mode": "none" | "forwards" | "backwards" | "both";
	"iteration-count": number | string;
	"play-state": "unset" | "inherit" | "initial" | "paused" | "running";
	"timing-function": string;
}

/**
 * Defines new `@keyframes` with given `id` and creates related class of
 * same name to configure given animation `opts`. Only the `duration`
 * option is given a default value (250ms), all others are optional.
 *
 * @example
 * ```ts tangle:../export/animation.ts
 * import { animation, css } from "@thi.ng/hiccup-css";
 *
 * console.log(
 *   css(
 *     animation(
 *       "fadein",
 *       { delay: "0.5s" },
 *       { opacity: 0 },
 *       { opacity: 1 }
 *     )
 *   )
 * );
 * ```
 *
 * Result:
 *
 * ```css
 * @keyframes fadein {
 *     0% {
 *         opacity: 0;
 *     }
 *     100% {
 *         opacity: 1;
 *     }
 * }
 *
 * .fadein {
 *     animation-duration: 250ms;
 *     animation-name: fadein;
 *     animation-delay: 0.5s;
 * }
 * ```
 *
 * @param id - animation name
 * @param opts - animation config options
 * @param keyframes - keyframes
 */
export const animation = (
	id: string,
	opts: Partial<AnimationOpts>,
	...keyframes: Keyframe[]
) => {
	const $opts: IObjectOf<any> = {
		duration: "250ms",
		name: id,
		...opts,
	};
	return [
		at_keyframes.apply(null, <any>[id, ...keyframes]),
		[
			`.${id}`,
			Object.entries($opts).reduce(
				(acc: any, [k, v]) => ((acc[`animation-${k}`] = v), acc),
				{}
			),
		],
	];
};
