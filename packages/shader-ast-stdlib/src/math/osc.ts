import type { FnU } from "@thi.ng/api";
import type { FloatTerm, NumericF } from "@thi.ng/shader-ast";
import {
	float,
	FLOAT0,
	FLOAT05,
	FLOAT1,
	FLOAT2,
	TAU,
} from "@thi.ng/shader-ast/ast/lit";
import { madd, mul, sub } from "@thi.ng/shader-ast/ast/ops";
import { abs, fract, sin, step } from "@thi.ng/shader-ast/builtin/math";

/** @internal */
const __defOsc =
	(fn: FnU<FloatTerm>) =>
	(
		phase: NumericF,
		freq: NumericF,
		amp: NumericF = FLOAT1,
		dc: NumericF = FLOAT0
	) =>
		madd(fn(mul(float(phase), float(freq))), amp, dc);

/**
 * Sine oscillator (ported from thi.ng/dsp)
 *
 * @param phase - normalized phase
 * @param freq -
 * @param amp -
 * @param dc -
 */
export const sinOsc = __defOsc((phase) => sin(mul(phase, TAU)));

/**
 * Sawtooth oscillator (ported from thi.ng/dsp)
 *
 * @param phase - normalized phase
 * @param freq -
 * @param amp -
 * @param dc -
 */
export const sawOsc = __defOsc((phase) =>
	sub(FLOAT1, mul(fract(phase), FLOAT2))
);

/**
 * Triangle oscillator (ported from thi.ng/dsp)
 *
 * @param phase - normalized phase
 * @param freq -
 * @param amp -
 * @param dc -
 */
export const triOsc = __defOsc((phase) =>
	sub(abs(madd(fract(phase), 4, float(-2))), FLOAT1)
);

/**
 * Rect oscillator w/ customizable duty cycle (default: 0.5) (ported from
 * thi.ng/dsp)
 *
 * @param phase - normalized phase
 * @param freq -
 * @param amp -
 * @param dc -
 * @param duty -
 */
export const rectOsc = (
	phase: NumericF,
	freq: NumericF,
	amp: NumericF = FLOAT1,
	dc: NumericF = FLOAT0,
	duty: NumericF = FLOAT05
) =>
	madd(
		madd(
			step(float(duty), fract(mul(float(phase), float(freq)))),
			FLOAT2,
			float(-1)
		),
		amp,
		dc
	);
