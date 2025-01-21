// SPDX-License-Identifier: Apache-2.0
import type { IDeref } from "@thi.ng/api";
import type { ILogger } from "@thi.ng/logger";
import type { Quantity } from "@thi.ng/units";
import type { ReadonlyVec } from "@thi.ng/vectors";

/** Start command sequence (configurable via {@link AxiDrawOpts}) */
export type StartCommand = ["start"];

/** Stop command sequence (configurable via {@link AxiDrawOpts}) */
export type StopCommand = ["stop"];

/** Return plotter to initial XY position */
export type HomeCommand = ["home"];

/** Reset curr position as home (0,0) */
export type ResetCommand = ["reset"];

/** Turn XY motors on/off */
export type MotorCommand = ["on" | "off"];

/** Pen config, min/down position, max/up position (in %) */
export type PenConfigCommand = ["pen", number?, number?];

/**
 * Pen up/down, optional delay (in ms), optional custom level/position. If
 * omitted, default values used from {@link AxiDrawOpts}. Using -1 as delay also
 * uses default.
 */
export type PenUpDownCommand = ["u" | "d", number?, number?];

/**
 * Move to abs pos (in worldspace coords, default mm), optional speed factor
 * (default: 1)
 */
export type MoveXYCommand = ["M", ReadonlyVec, number?];

/**
 * Move to **relative** pos (based on curr plotter position, im worldspace
 * units, default mm), optional speed factor (default: 1)
 */
export type MoveRelCommand = ["m", ReadonlyVec, number?];

/** Explicit delay (in ms) */
export type WaitCommand = ["w", number];

/** Ignored, but will be logged (if logging enabled) */
export type CommentCommand = ["comment", string];

/**
 * Stores current pen configuration on stack.
 */
export type SaveCommand = ["save"];

/**
 * Restores current pen configuration from stack.
 */
export type RestoreCommand = ["restore"];

export type DrawCommand =
	| CommentCommand
	| HomeCommand
	| MotorCommand
	| MoveRelCommand
	| MoveXYCommand
	| PenConfigCommand
	| PenUpDownCommand
	| ResetCommand
	| RestoreCommand
	| SaveCommand
	| StartCommand
	| StopCommand
	| WaitCommand;

/**
 * Global plotter drawing configuration. Also see {@link DEFAULT_OPTS}.
 */
export interface AxiDrawOpts {
	/**
	 * Serial connection to use (only used for testing/dev purposes, otherwise
	 * leave default).
	 *
	 * @defaultValue {@link SERIAL_PORT}
	 */
	serial: SerialConnection;
	/**
	 * Logger instance for outputting draw commands, state info and metrics.
	 */
	logger: ILogger;
	/**
	 * Optional implementation to pause, resume or cancel the processing of
	 * drawing commands (see {@link AxiDrawControl} for default impl).
	 *
	 * @remarks
	 * If a control is provided, it will be checked prior to processing each
	 * individual command. Drawing will be paused if the control state is in
	 * {@link AxiDrawState.PAUSE} state and the control will be rechecked every
	 * {@link AxiDrawOpts.refresh} milliseconds for updates. In paused state,
	 * the pen will be automatically lifted (if it wasn't already) and when
	 * resuming it will be sent down again (if it was originally down).
	 *
	 * Draw commands are only sent to the machine if no control is provided at
	 * all or if the control is in the {@link AxiDrawState.CONTINUE} state.
	 */
	control?: IDeref<AxiDrawState>;
	/**
	 * All XY coords will be clamped to given bounding rect, either defined by
	 * `[[minX,minY], [maxX,maxY]]` (in worldspace units) or as paper size
	 * defined as a
	 * [`quantity`](https://docs.thi.ng/umbrella/units/functions/quantity-1.html).
	 * The default value is DIN A3 landscape.
	 *
	 * @remarks
	 * Set to `undefined` to disable bounds/clipping. If given a paper size (via
	 * thi.ng/units `quantity()`), the units used to define these dimensions are
	 * irrelevant (and independent of {@link AxiDrawOpts.unitsPerInch}!) and
	 * will be automatically converted. Also, the resulting bounds will always
	 * be based on [0, 0].
	 *
	 * List of paper sizes/presets:
	 * https://github.com/thi-ng/umbrella/blob/develop/packages/units/README.md#constants
	 *
	 * Also see {@link AxiDrawOpts.unitsPerInch}
	 *
	 * @defaultValue `DIN_A3_LANDSCAPE`
	 */
	bounds?: [ReadonlyVec, ReadonlyVec] | Quantity<number[]>;
	/**
	 * Conversion factor from geometry worldspace units to inches.
	 * Default units are millimeters.
	 *
	 * @defaultValue 25.4
	 */
	unitsPerInch: number;
	/**
	 * Hardware resolution (steps / inch)
	 *
	 * @defaultValue 2032
	 */
	stepsPerInch: number;
	/**
	 * Steps per second for XY movements whilst pen down
	 *
	 * @defaultValue 4000
	 */
	speedDown: number;
	/**
	 * Steps per second for XY movements whilst pen up
	 *
	 * @defaultValue 4000
	 */
	speedUp: number;
	/**
	 * Up position (%)
	 *
	 * @defaultValue 60
	 */
	up: number;
	/**
	 * Up position (%)
	 *
	 * @defaultValue 30
	 */
	down: number;
	/**
	 * Delay after pen up
	 *
	 * @defaultValue 150
	 */
	delayUp: number;
	/**
	 * Delay after pen down
	 *
	 * @defaultValue 150
	 */
	delayDown: number;
	/**
	 * Time in ms to subtract from actual delay time until next command
	 *
	 * @defaultValue 0
	 */
	preDelay: number;
	/**
	 * Sequence for `start` {@link DrawCommand}
	 *
	 * @defaultValue `[ON, PEN, UP]`
	 */
	start: DrawCommand[];
	/**
	 * Sequence for `end` {@link DrawCommand}
	 *
	 * @defaultValue `[UP, HOME, OFF]`
	 */
	stop: DrawCommand[];
	/**
	 * Position (in world space units) which is considered the origin and which
	 * will be added to all coordinates as offset (e.g. for plotting with a
	 * physically offset easel).
	 *
	 * @remarks
	 * Note: The configured {@link AxiDrawOpts.bounds} are independent from this
	 * setting and are intended to enforce the plotter's physical movement
	 * limits. E.g. shifting the home/offset position by +100mm along X (and
	 * assuming only positive coordinates will be used for the drawing), simply
	 * means the available horizontal drawing space will be reduced by the same
	 * amount...
	 *
	 * @defaultValue [0, 0]
	 */
	home: ReadonlyVec;
	/**
	 * Refresh interval for checking the control FSM in paused state.
	 *
	 * @defaultValue 1000
	 */
	refresh: number;
	/**
	 * If true (default), installs SIGINT handler to lift pen when the Node.js
	 * process is terminated.
	 */
	sigint: boolean;
}

/**
 * FSM state enum for (interactive) control for processing of drawing commands.
 * See {@link AxiDraw.draw} and {@link AxiDrawControl} for details.
 */
export enum AxiDrawState {
	/**
	 * Draw command processing can continue as normal.
	 */
	CONTINUE,
	/**
	 * Draw command processing is suspended indefinitely.
	 */
	PAUSE,
	/**
	 * Draw command processing is cancelled.
	 */
	CANCEL,
}

/**
 * Drawing behavior options for a single polyline.
 */
export interface PolylineOpts {
	/**
	 * Speed factor (multiple of globally configured draw speed). Depending on
	 * pen used, slower speeds might result in thicker strokes.
	 *
	 * @defaultValue 1
	 */
	speed: number;
	/**
	 * Pen down (Z) position (%) for this particular shape/polyline. Will be
	 * reset to globally configured default at the end of the shape.
	 */
	down: number;
	/**
	 * Delay for pen down command at the start of this particular
	 * shape/polyline.
	 */
	delayDown: number;
	/**
	 * Delay for pen up command at the end this particular shape/polyline.
	 */
	delayUp: number;
	/**
	 * If enabled, no pen up/down commands will be included.
	 * {@link PolylineOpts.speed} is the only other option considered then.
	 *
	 * @defaultValue false
	 */
	onlyGeo: boolean;
}

/**
 * Metrics returned by {@link AxiDraw.draw}.
 */
export interface Metrics {
	/**
	 * Total number of milliseconds taken for drawing all given commands (incl.
	 * any pauses caused by the control)
	 */
	duration: number;
	/**
	 * Total draw distance, i.e. distance traveled whilst pen down (in original
	 * user units, see {@link AxiDrawOpts.unitsPerInch}).
	 */
	drawDist: number;
	/**
	 * Total traveled, incl. any movements without drawing (in original user
	 * units, see {@link AxiDrawOpts.unitsPerInch}).
	 */
	totalDist: number;
	/**
	 * Number of pen up/down commands (useful for measuring servo lifespan).
	 */
	penCommands: number;
	/**
	 * Total number of {@link DrawCommand}s processed.
	 */
	commands: number;
}

export interface SerialConnection {
	/**
	 * Async function. Returns a list of available serial ports. The arg given
	 * is the path requested by the user when calling {@link AxiDraw.connect}.
	 *
	 * @param path
	 */
	list(path: string): Promise<{ path: string }[]>;
	/**
	 * Returns an actual serial port (or mock) instance, is given the first
	 * matching path in array returned by {@link SerialConnection.list}.
	 *
	 * @param path
	 * @param baudRate
	 */
	ctor(path: string, baudRate: number): ISerial;
}

export interface ISerial {
	close(): void;
	/**
	 * Writes given string to the port.
	 *
	 * @param msg
	 */
	write(msg: string): void;
}
