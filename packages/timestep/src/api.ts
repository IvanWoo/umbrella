// SPDX-License-Identifier: Apache-2.0
import type { EVENT_ALL } from "@thi.ng/api";
import type { TimeStep } from "./timestep.js";

/**
 * Interface for participating in the {@link TimeStep.update} logic.
 */
export interface ITimeStep {
	/**
	 * 1st phase of the update cycle and main update function for this
	 * simulation state. Receives timestep (in seconds) and a `ctx` object.
	 *
	 * @remarks
	 * Implementations must perform the following tasks:
	 *
	 * - backup current state (e.g copy to a `previous` field/var)
	 * - compute new state based on current state (using `dt`)
	 * - set current state to newly computed state
	 *
	 * The `ctx` object is only provided for information. Most update logic will
	 * (and should) only require the timestep arg `dt`.
	 *
	 * @param dt
	 * @param ctx
	 */
	integrate(dt: number, ctx: ReadonlyTimeStep): void;
	/**
	 * Final stage of the update cycle. The `alpha` arg is the tween factor to
	 * use for interpolating between the backed up `previous` state and the
	 * current state.
	 *
	 * @remarks
	 * The aforementioned `previous` / `current` state values are never to be
	 * used directly. Only the interpolated value(s) computed by this function
	 * should be used for rendering (or other external) purposes.
	 *
	 * @param alpha
	 * @param ctx
	 */
	interpolate(alpha: number, ctx: ReadonlyTimeStep): void;
}

export interface ReadonlyTimeStep {
	/**
	 * Simulation time since start (resolution {@link ReadonlyTimeStep.dt}).
	 */
	readonly t: number;
	/**
	 * Configured timestep (in seconds)
	 */
	readonly dt: number;
	/**
	 * Current time relative to configured start time (in seconds)
	 */
	readonly current: number;
	/**
	 * Start time (in seconds)
	 */
	readonly start: number;
	/**
	 * Current render frame
	 */
	readonly frame: number;
	/**
	 * Number of sim updates performed in total so far
	 */
	readonly updates: number;
}

export interface TimeStepOpts {
	/**
	 * Timestep (in seconds)
	 *
	 * @defaultValue 1/60
	 */
	dt: number;
	/**
	 * Start time (see {@link TimeStepOpts.scale}).
	 *
	 * @defaultValue 0
	 */
	startTime: number;
	/**
	 * Max. frame duration (in seconds)
	 *
	 * @defaultValue 1/4
	 */
	maxFrameTime: number;
	/**
	 * Scale factor used to convert timestamp values to seconds, i.e. those
	 * timestamps passed via {@link TimeStepOpts.startTime} and those as
	 * argument given to {@link TimeStep.update}. The default assumes these
	 * value are in milliseconds.
	 *
	 * @defaultValue 0.001
	 */
	scale: number;
}

export type StateUpdate<T> = (curr: T, dt: number, ctx: ReadonlyTimeStep) => T;

export type StateInterpolation<T> = (
	prev: T,
	curr: T,
	alpha: number,
	ctx: ReadonlyTimeStep
) => T;

/**
 * Event ID for {@link TimeStep.addListener} to be notified of calls to
 * {@link TimeStep.update} (triggered at the very end of a frame update).
 */
export const EVENT_FRAME = "frame";

/**
 * Event ID for {@link TimeStep.addListener} to be notified of individual
 * {@link ITimeStep.integrate} iterations.
 */
export const EVENT_SUBFRAME = "subframe";

export type TimeStepEventType =
	| typeof EVENT_FRAME
	| typeof EVENT_SUBFRAME
	| typeof EVENT_ALL;
