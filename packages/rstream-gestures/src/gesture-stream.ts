import type { IObjectOf, Maybe } from "@thi.ng/api";
import { isBoolean } from "@thi.ng/checks/is-boolean";
import { isNumber } from "@thi.ng/checks/is-number";
import { clamp } from "@thi.ng/math/interval";
import type { Stream } from "@thi.ng/rstream";
import { fromDOMEvent } from "@thi.ng/rstream/event";
import { __nextID } from "@thi.ng/rstream/idgen";
import { merge } from "@thi.ng/rstream/merge";
import { map } from "@thi.ng/transducers/map";
import type {
	GestureEvent,
	GestureInfo,
	GestureStream,
	GestureStreamOpts,
	GestureType,
	UIEvent,
	UIEventID,
} from "./api.js";

const START_EVENTS = new Set([
	"mousedown",
	"touchmove",
	"touchstart",
	"mousemove",
]);

const END_EVENTS = new Set(["mouseup", "touchend", "touchcancel"]);

const BASE_EVENTS = <const>["mousemove", "mousedown", "touchstart", "wheel"];

const EVENT_GESTURETYPES: IObjectOf<GestureType> = {
	touchstart: "start",
	touchmove: "drag",
	touchend: "end",
	touchcancel: "end",
	mousedown: "start",
	mouseup: "end",
	wheel: "zoom",
};

/**
 * Attaches mouse & touch event listeners to given DOM element and returns a
 * stream of {@link GestureEvent}s and their {@link GestureInfo} details.
 *
 * In multi-touch environments, a `GestureEvent` can contain multiple such
 * `GestureInfo` objects (one per active touch). In general, the `click` and
 * `delta` values are only present if the abstracted event `type == "drag"`.
 * Both (and `pos` too) are 2-element arrays of `[x,y]` coordinates.
 *
 * The `zoom` value is always present, but is only updated with wheel events.
 * The value will be constrained to `minZoom` ... `maxZoom` interval (provided
 * via options object).
 *
 * Note: If using `preventDefault` and attaching the event stream to
 * `document.body`, the following event listener options SHOULD be used:
 *
 * @example
 * ```text
 * eventOpts: { passive: false }
 * ```
 *
 * https://www.chromestatus.com/features/5093566007214080
 *
 * @param el -
 * @param opts -
 */
export const gestureStream = (
	el: Element,
	_opts?: Partial<GestureStreamOpts>
): GestureStream => {
	const opts = <GestureStreamOpts>{
		zoom: 1,
		absZoom: true,
		minZoom: 0.25,
		maxZoom: 4,
		smooth: 1,
		eventOpts: { capture: true },
		preventDefault: true,
		preventScrollOnZoom: true,
		preventContextMenu: true,
		local: true,
		scale: false,
		..._opts,
	};
	opts.id = opts.id || `gestures-${__nextID()}`;
	const active: GestureInfo[] = [];
	let zoom = clamp(
		isNumber(opts.zoom) ? opts.zoom : opts.zoom.deref() || 1,
		opts.minZoom,
		opts.maxZoom
	);
	let zoomDelta = 0;
	let numTouches = 0;
	let lastPos: number[] = [0, 0];

	let tempStreams: Maybe<Stream<UIEvent>[]>;

	const isBody = el === document.body;
	const tempEvents: UIEventID[] = [
		"touchend",
		"touchcancel",
		"touchmove",
		"mouseup",
	];
	!isBody && tempEvents.push("mousemove");

	opts.preventContextMenu &&
		el.addEventListener("contextmenu", (e) => e.preventDefault());

	const gestureStart = (
		etype: string,
		events: Array<Touch | MouseEvent | WheelEvent>,
		bounds: DOMRect,
		isTouch: boolean
	) => {
		const isStart = etype === "mousedown" || etype === "touchstart";
		for (let t of events) {
			const id = (<Touch>t).identifier || 0;
			const pos = getPos(t, bounds, opts.local, opts.scale);
			let touch = active.find((t) => t.id === id);
			if (!touch && isStart) {
				touch = <GestureInfo>{ id, start: pos };
				active.push(touch);
				numTouches++;
			}
			if (touch) {
				touch.pos = pos;
				touch.delta = [
					pos[0] - touch.start![0],
					pos[1] - touch.start![1],
				];
				if (isTouch) {
					touch.force = (<Touch>t).force;
				}
			}
		}
		if (isStart && !tempStreams) {
			tempStreams = tempEvents.map((id) =>
				eventSource(document.body, id, opts, "-temp")
			);
			stream.addAll(tempStreams);
			!isBody && stream.removeID("mousemove");
		}
	};

	const gestureEnd = (events: Array<Touch | MouseEvent | WheelEvent>) => {
		for (let t of events) {
			const id = (<Touch>t).identifier || 0;
			const idx = active.findIndex((t) => t.id === id);
			if (idx !== -1) {
				active.splice(idx, 1);
				numTouches--;
			}
		}
		if (numTouches === 0) {
			stream.removeAll(tempStreams!);
			!isBody && stream.add(eventSource(el, "mousemove", opts));
			tempStreams = undefined;
		}
	};

	const updateZoom = (e: UIEvent) => {
		const zdelta =
			opts.smooth *
			("wheelDeltaY" in <any>e
				? -(<any>e).wheelDeltaY / 120
				: (<WheelEvent>e).deltaY / 40);
		zoom = opts.absZoom
			? clamp(zoom + zdelta, opts.minZoom, opts.maxZoom)
			: zdelta;
		zoomDelta = zdelta;
	};

	const stream = merge<UIEvent, GestureEvent>({
		id: opts.id,
		src: BASE_EVENTS.map((id) => eventSource(el, id, opts)),

		xform: map((e) => {
			const etype = e.type;

			if (etype === "$zoom") {
				zoomDelta = (<any>e).value - zoom;
				if (opts.absZoom) {
					zoom = clamp(zoom + zoomDelta, opts.minZoom, opts.maxZoom);
				} else {
					zoom = zoomDelta;
				}
				return {
					pos: lastPos.slice(),
					buttons: 0,
					type: "zoom",
					active,
					zoom,
					zoomDelta,
					isTouch: false,
				};
			}

			const type = classifyEventType(etype, !!tempStreams);
			let isTouch = !!(<TouchEvent>e).touches;
			let events: Array<Touch | MouseEvent | WheelEvent> = isTouch
				? Array.from((<TouchEvent>e).changedTouches)
				: [<MouseEvent | WheelEvent>e];
			const bounds = el.getBoundingClientRect();

			if (START_EVENTS.has(etype)) {
				gestureStart(etype, events, bounds, isTouch);
			} else if (END_EVENTS.has(etype)) {
				gestureEnd(events);
			} else if (type === "zoom") {
				updateZoom(e);
			}

			lastPos = getPos(events[0], bounds, opts.local, opts.scale);

			opts.preventDefault && e.preventDefault();
			return {
				event: e,
				pos: lastPos,
				buttons: isTouch ? active.length : (<MouseEvent>e).buttons,
				type,
				active,
				zoom,
				zoomDelta,
				isTouch,
			};
		}),
	});

	// attach zoom reset
	if (!isNumber(opts.zoom)) {
		stream.add(opts.zoom.map((x) => <any>{ type: "$zoom", value: x }));
	}

	return stream;
};

const eventSource = (
	el: Element,
	type: UIEventID,
	opts: GestureStreamOpts,
	suffix = ""
) => {
	let eventOpts = opts.eventOpts;
	if (type === "wheel" && opts.preventScrollOnZoom) {
		eventOpts = isBoolean(eventOpts)
			? { capture: eventOpts, passive: false }
			: { ...eventOpts, passive: false };
	}
	return fromDOMEvent(el, type, eventOpts, { id: type + suffix });
};

const classifyEventType = (etype: string, isActive: boolean) =>
	etype === "mousemove"
		? isActive
			? "drag"
			: "move"
		: EVENT_GESTURETYPES[etype];

const getPos = (
	e: Touch | MouseEvent | WheelEvent,
	bounds: DOMRect,
	isLocal: boolean,
	doScale: boolean
) => {
	let x = e.clientX;
	let y = e.clientY;
	if (isLocal) {
		x -= bounds.left;
		y -= bounds.top;
	}
	if (doScale) {
		const dpr = window.devicePixelRatio || 1;
		x *= dpr;
		y *= dpr;
	}
	return [x | 0, y | 0];
};
