/**
 * Generated by @thi.ng/wasm-api-bindgen at 2025-02-13T12:41:58.460Z
 * DO NOT EDIT!
 */

// @ts-ignore possibly includes unused imports
import { defType, Pointer, WasmStringPtr, type IWasmMemoryAccess, type MemorySlice, type MemoryView, type WasmTypeBase, type WasmTypeKeys } from "@thi.ng/wasm-api";
// @ts-ignore
import { __array, __instanceArray, __slice32, __primslice32 } from "@thi.ng/wasm-api/memory";

// @ts-ignore possibly unused
const __str = (mem: IWasmMemoryAccess, base: number, isConst = true) => new WasmStringPtr(mem, base, isConst);

export enum EventType {
	UNKOWN = -1,
	DRAG,
	FOCUS,
	INPUT,
	KEY,
	MOUSE,
	POINTER,
	SCROLL,
	TOUCH,
	WHEEL,
}

export enum MouseButton {
	NONE,
	PRIMARY = 1,
	SECONDARY = 2,
	MIDDLE = 4,
}

export enum PointerType {
	MOUSE,
	PEN,
	TOUCH,
}

export enum WheelDeltaMode {
	PIXEL,
	LINE,
	PAGE,
}

export enum KeyModifier {
	SHIFT = 1,
	CTRL = 2,
	ALT = 4,
	META = 8,
}

/**
 * Various browser window related information (TODO)
 */
export interface WindowInfo extends WasmTypeBase {
	/**
	 * Zig type: `u16`
	 */
	innerWidth: number;
	/**
	 * Zig type: `u16`
	 */
	innerHeight: number;
	/**
	 * Horizontal scroll offset in fractional CSS pixels
	 * 
	 * @remarks
	 * Zig type: `f32`
	 */
	scrollX: number;
	/**
	 * Vertical scroll offset in fractional CSS pixels
	 * 
	 * @remarks
	 * Zig type: `f32`
	 */
	scrollY: number;
	/**
	 * Current device pixel ratio
	 * 
	 * @remarks
	 * Zig type: `u8`
	 */
	dpr: number;
	/**
	 * Encoded bitmask indicating fullscreen status / capability:
	 * - 1 (bit 0): fullscreen active
	 * - 2 (bit 1): fullscreen supported
	 * 
	 * @remarks
	 * Zig type: `u8`
	 */
	fullscreen: number;
}

// @ts-ignore possibly unused args
export const $WindowInfo = defType<WindowInfo>(4, 16, (mem, base) => {
	return {
		get innerWidth(): number {
			return mem.u16[base >>> 1];
		},
		set innerWidth(x: number) {
			mem.u16[base >>> 1] = x;
		},
		get innerHeight(): number {
			return mem.u16[(base + 2) >>> 1];
		},
		set innerHeight(x: number) {
			mem.u16[(base + 2) >>> 1] = x;
		},
		get scrollX(): number {
			return mem.f32[(base + 4) >>> 2];
		},
		set scrollX(x: number) {
			mem.f32[(base + 4) >>> 2] = x;
		},
		get scrollY(): number {
			return mem.f32[(base + 8) >>> 2];
		},
		set scrollY(x: number) {
			mem.f32[(base + 8) >>> 2] = x;
		},
		get dpr(): number {
			return mem.u8[(base + 12)];
		},
		set dpr(x: number) {
			mem.u8[(base + 12)] = x;
		},
		get fullscreen(): number {
			return mem.u8[(base + 13)];
		},
		set fullscreen(x: number) {
			mem.u8[(base + 13)] = x;
		},
	};
});

export interface DragEvent extends WasmTypeBase {
	/**
	 * Mouse X position in the local space of the element's bounding rect
	 * 
	 * @remarks
	 * Zig type: `i16`
	 */
	clientX: number;
	/**
	 * Mouse Y position in the local space of the element's bounding rect
	 * 
	 * @remarks
	 * Zig type: `i16`
	 */
	clientY: number;
	/**
	 * If non-zero, data that is being dragged during a drag & drop operation can be
	 * obtained via various DnD related API calls (only available when called from
	 * event handler).
	 * 
	 * @remarks
	 * Zig type: `u8`
	 */
	isDataTransfer: number;
	/**
	 * Encoded bitmask of currently pressed modifier keys, see `KeyModifier` enum
	 * 
	 * @remarks
	 * Zig type: `u8`
	 */
	modifiers: number;
	/**
	 * Encoded bitmask of all currently pressed mouse buttons, see `MouseButton`
	 * enum
	 * 
	 * @remarks
	 * Zig type: `u8`
	 */
	buttons: number;
	/**
	 * Event related mouse button ID (if any)
	 */
	button: MouseButton;
	
	fromEvent(e: globalThis.DragEvent): void;
	
}

// @ts-ignore possibly unused args
export const $DragEvent = defType<DragEvent>(2, 8, (mem, base) => {
	return {
		get clientX(): number {
			return mem.i16[base >>> 1];
		},
		set clientX(x: number) {
			mem.i16[base >>> 1] = x;
		},
		get clientY(): number {
			return mem.i16[(base + 2) >>> 1];
		},
		set clientY(x: number) {
			mem.i16[(base + 2) >>> 1] = x;
		},
		get isDataTransfer(): number {
			return mem.u8[(base + 4)];
		},
		set isDataTransfer(x: number) {
			mem.u8[(base + 4)] = x;
		},
		get modifiers(): number {
			return mem.u8[(base + 5)];
		},
		set modifiers(x: number) {
			mem.u8[(base + 5)] = x;
		},
		get buttons(): number {
			return mem.u8[(base + 6)];
		},
		set buttons(x: number) {
			mem.u8[(base + 6)] = x;
		},
		get button(): MouseButton {
			return mem.u8[(base + 7)];
		},
		set button(x: MouseButton) {
			mem.u8[(base + 7)] = x;
		},
		
		fromEvent(e: globalThis.DragEvent) {
			const bounds = (<Element>(e.target)).getBoundingClientRect();
			this.clientX = e.clientX - bounds.left;
			this.clientY = e.clientY - bounds.top;
			this.buttons = e.buttons;
			this.button = e.button;
			this.isDataTransfer = e.dataTransfer ? 1 : 0;
		}
		
	};
});

export interface InputEvent extends WasmTypeBase {
	/**
	 * Value of the targeted input element.
	 * The memory is owned by the DOM API and will be freed immediately after the
	 * event handler has returned.
	 */
	readonly value: WasmStringPtr;
	/**
	 * Length of the value string
	 * 
	 * @remarks
	 * Zig type: `u32`
	 */
	len: number;
	/**
	 * Encoded bitmask of currently pressed modifier keys, see `KeyModifier` enum
	 * 
	 * @remarks
	 * Zig type: `u8`
	 */
	modifiers: number;
	
	fromEvent(e: globalThis.InputEvent): MemorySlice;
	
}

// @ts-ignore possibly unused args
export const $InputEvent = defType<InputEvent>(4, 12, (mem, base) => {
	let $value: WasmStringPtr;
	return {
		get value(): WasmStringPtr {
			return $value || ($value = __str(mem, base));
		},
		get len(): number {
			return mem.u32[(base + 4) >>> 2];
		},
		set len(x: number) {
			mem.u32[(base + 4) >>> 2] = x;
		},
		get modifiers(): number {
			return mem.u8[(base + 8)];
		},
		set modifiers(x: number) {
			mem.u8[(base + 8)] = x;
		},
		
		fromEvent(e: globalThis.InputEvent) {
			const el = <HTMLInputElement>e.target;
			const value = el.type === "checkbox" ? el.checked ? "on" : "off" : el.value;
			const slice = this.value.setAlloc(value);
			this.len = slice[1] - 1;
			return slice;
		}
		
	};
});

export interface KeyEvent extends WasmTypeBase {
	/**
	 * Value/name of the key pressed
	 * 
	 * @remarks
	 * Zig type: `[15:0]u8`
	 */
	readonly key: Uint8Array;
	/**
	 * Number of characters of the `key` string
	 * 
	 * @remarks
	 * Zig type: `u8`
	 */
	len: number;
	/**
	 * Encoded bitmask of currently pressed modifier keys, see `KeyModifier` enum
	 * 
	 * @remarks
	 * Zig type: `u8`
	 */
	modifiers: number;
	/**
	 * Non-zero value indicates key is being held down such that it's automatically
	 * repeating
	 * 
	 * @remarks
	 * Zig type: `u8`
	 */
	repeat: number;
	
	fromEvent(e: globalThis.KeyboardEvent): void;
	
}

// @ts-ignore possibly unused args
export const $KeyEvent = defType<KeyEvent>(1, 19, (mem, base) => {
	return {
		get key(): Uint8Array {
			const addr = base;
			return mem.u8.subarray(addr, addr + 15);
		},
		get len(): number {
			return mem.u8[(base + 16)];
		},
		set len(x: number) {
			mem.u8[(base + 16)] = x;
		},
		get modifiers(): number {
			return mem.u8[(base + 17)];
		},
		set modifiers(x: number) {
			mem.u8[(base + 17)] = x;
		},
		get repeat(): number {
			return mem.u8[(base + 18)];
		},
		set repeat(x: number) {
			mem.u8[(base + 18)] = x;
		},
		
		fromEvent(e: globalThis.KeyboardEvent) {
			this.len = mem.setString(e.key, this.key.byteOffset, 16, true);
		}
		
	};
});

export interface MouseEvent extends WasmTypeBase {
	/**
	 * Mouse X position in the local space of the element's bounding rect
	 * 
	 * @remarks
	 * Zig type: `i16`
	 */
	clientX: number;
	/**
	 * Mouse Y position in the local space of the element's bounding rect
	 * 
	 * @remarks
	 * Zig type: `i16`
	 */
	clientY: number;
	/**
	 * Encoded bitmask of currently pressed modifier keys, see `KeyModifier` enum
	 * 
	 * @remarks
	 * Zig type: `u8`
	 */
	modifiers: number;
	/**
	 * Encoded bitmask of all currently pressed mouse buttons, see `MouseButton`
	 * enum
	 * 
	 * @remarks
	 * Zig type: `u8`
	 */
	buttons: number;
	/**
	 * Event related mouse button ID (if any)
	 */
	button: MouseButton;
	
	fromEvent(e: globalThis.MouseEvent): void;
	
}

// @ts-ignore possibly unused args
export const $MouseEvent = defType<MouseEvent>(2, 8, (mem, base) => {
	return {
		get clientX(): number {
			return mem.i16[base >>> 1];
		},
		set clientX(x: number) {
			mem.i16[base >>> 1] = x;
		},
		get clientY(): number {
			return mem.i16[(base + 2) >>> 1];
		},
		set clientY(x: number) {
			mem.i16[(base + 2) >>> 1] = x;
		},
		get modifiers(): number {
			return mem.u8[(base + 4)];
		},
		set modifiers(x: number) {
			mem.u8[(base + 4)] = x;
		},
		get buttons(): number {
			return mem.u8[(base + 5)];
		},
		set buttons(x: number) {
			mem.u8[(base + 5)] = x;
		},
		get button(): MouseButton {
			return mem.u8[(base + 6)];
		},
		set button(x: MouseButton) {
			mem.u8[(base + 6)] = x;
		},
		
		fromEvent(e: globalThis.MouseEvent) {
			const bounds = (<Element>(e.target)).getBoundingClientRect();
			this.clientX = e.clientX - bounds.left;
			this.clientY = e.clientY - bounds.top;
			this.buttons = e.buttons;
			this.button = e.button;
		}
		
	};
});

export interface PointerEvent extends WasmTypeBase {
	/**
	 * Mouse X position in the local space of the element's bounding rect
	 * 
	 * @remarks
	 * Zig type: `i16`
	 */
	clientX: number;
	/**
	 * Mouse Y position in the local space of the element's bounding rect
	 * 
	 * @remarks
	 * Zig type: `i16`
	 */
	clientY: number;
	/**
	 * Unique pointer ID
	 * 
	 * @remarks
	 * Zig type: `u32`
	 */
	id: number;
	/**
	 * Normalized pressure value 0..1
	 * 
	 * @remarks
	 * Zig type: `f32`
	 */
	pressure: number;
	/**
	 * The plane angle (in degrees, in the range of -90 to 90) between the Y-Z plane
	 * and the plane containing both the pointer (e.g. pen stylus) axis and the Y
	 * axis.
	 * 
	 * @remarks
	 * Zig type: `i8`
	 */
	tiltX: number;
	/**
	 * The plane angle (in degrees, in the range of -90 to 90) between the X-Z plane
	 * and the plane containing both the pointer (e.g. pen stylus) axis and the X
	 * axis.
	 * 
	 * @remarks
	 * Zig type: `i8`
	 */
	tiltY: number;
	/**
	 * The clockwise rotation of the pointer (e.g. pen stylus) around its major axis
	 * in degrees, with a value in the range 0 to 359.
	 * 
	 * @remarks
	 * Zig type: `u16`
	 */
	twist: number;
	pointerType: PointerType;
	/**
	 * Non-zero if event's pointer is the primary pointer (in a multitouch scenario)
	 * 
	 * @remarks
	 * Zig type: `u8`
	 */
	isPrimary: number;
	/**
	 * Encoded bitmask of currently pressed modifier keys, see `KeyModifier` enum
	 * 
	 * @remarks
	 * Zig type: `u8`
	 */
	modifiers: number;
	/**
	 * Encoded bitmask of all currently pressed mouse buttons, see `MouseButton`
	 * enum
	 * 
	 * @remarks
	 * Zig type: `u8`
	 */
	buttons: number;
	/**
	 * Event related mouse button ID (if any)
	 */
	button: MouseButton;
	
	fromEvent(e: globalThis.PointerEvent): void;
	
}

// @ts-ignore possibly unused args
export const $PointerEvent = defType<PointerEvent>(4, 24, (mem, base) => {
	return {
		get clientX(): number {
			return mem.i16[base >>> 1];
		},
		set clientX(x: number) {
			mem.i16[base >>> 1] = x;
		},
		get clientY(): number {
			return mem.i16[(base + 2) >>> 1];
		},
		set clientY(x: number) {
			mem.i16[(base + 2) >>> 1] = x;
		},
		get id(): number {
			return mem.u32[(base + 4) >>> 2];
		},
		set id(x: number) {
			mem.u32[(base + 4) >>> 2] = x;
		},
		get pressure(): number {
			return mem.f32[(base + 8) >>> 2];
		},
		set pressure(x: number) {
			mem.f32[(base + 8) >>> 2] = x;
		},
		get tiltX(): number {
			return mem.i8[(base + 12)];
		},
		set tiltX(x: number) {
			mem.i8[(base + 12)] = x;
		},
		get tiltY(): number {
			return mem.i8[(base + 13)];
		},
		set tiltY(x: number) {
			mem.i8[(base + 13)] = x;
		},
		get twist(): number {
			return mem.u16[(base + 14) >>> 1];
		},
		set twist(x: number) {
			mem.u16[(base + 14) >>> 1] = x;
		},
		get pointerType(): PointerType {
			return mem.u8[(base + 16)];
		},
		set pointerType(x: PointerType) {
			mem.u8[(base + 16)] = x;
		},
		get isPrimary(): number {
			return mem.u8[(base + 17)];
		},
		set isPrimary(x: number) {
			mem.u8[(base + 17)] = x;
		},
		get modifiers(): number {
			return mem.u8[(base + 18)];
		},
		set modifiers(x: number) {
			mem.u8[(base + 18)] = x;
		},
		get buttons(): number {
			return mem.u8[(base + 19)];
		},
		set buttons(x: number) {
			mem.u8[(base + 19)] = x;
		},
		get button(): MouseButton {
			return mem.u8[(base + 20)];
		},
		set button(x: MouseButton) {
			mem.u8[(base + 20)] = x;
		},
		
		fromEvent(e: globalThis.PointerEvent) {
			const bounds = (<Element>(e.target)).getBoundingClientRect();
			this.clientX = e.clientX - bounds.left;
			this.clientY = e.clientY - bounds.top;
			this.tiltX = e.tiltX;
			this.tiltY = e.tiltY;
			this.twist = e.twist;
			this.isPrimary = ~~e.isPrimary;
			this.pointerType = PointerType[<"PEN">e.pointerType.toUpperCase()];
			this.buttons = e.buttons;
			this.button = e.button;
		}
		
	};
});

export interface ScrollEvent extends WasmTypeBase {
	/**
	 * Horizontal scroll offset in fractional CSS pixels.
	 * 
	 * @remarks
	 * Zig type: `f32`
	 */
	scrollX: number;
	/**
	 * Vertical scroll offset in fractional CSS pixels.
	 * 
	 * @remarks
	 * Zig type: `f32`
	 */
	scrollY: number;
	
	fromEvent(e: globalThis.Event): void;
	
}

// @ts-ignore possibly unused args
export const $ScrollEvent = defType<ScrollEvent>(4, 8, (mem, base) => {
	return {
		get scrollX(): number {
			return mem.f32[base >>> 2];
		},
		set scrollX(x: number) {
			mem.f32[base >>> 2] = x;
		},
		get scrollY(): number {
			return mem.f32[(base + 4) >>> 2];
		},
		set scrollY(x: number) {
			mem.f32[(base + 4) >>> 2] = x;
		},
		
		fromEvent(e: globalThis.Event) {
			const target = <HTMLElement>((<any>e.target).scrollTop != null ? e.target : document.scrollingElement);
			this.scrollX = target.scrollLeft || 0;
			this.scrollY = target.scrollTop || 0;
		}
		
	};
});

export interface TouchEvent extends WasmTypeBase {
	/**
	 * Touch X position in the local space of the element's bounding rect
	 * 
	 * @remarks
	 * Zig type: `i16`
	 */
	clientX: number;
	/**
	 * Touch Y position in the local space of the element's bounding rect
	 * 
	 * @remarks
	 * Zig type: `i16`
	 */
	clientY: number;
	/**
	 * Encoded bitmask of currently pressed modifier keys, see `KeyModifier` enum
	 * 
	 * @remarks
	 * Zig type: `u8`
	 */
	modifiers: number;
	
	fromEvent(e: globalThis.TouchEvent): void;
	
}

// @ts-ignore possibly unused args
export const $TouchEvent = defType<TouchEvent>(2, 6, (mem, base) => {
	return {
		get clientX(): number {
			return mem.i16[base >>> 1];
		},
		set clientX(x: number) {
			mem.i16[base >>> 1] = x;
		},
		get clientY(): number {
			return mem.i16[(base + 2) >>> 1];
		},
		set clientY(x: number) {
			mem.i16[(base + 2) >>> 1] = x;
		},
		get modifiers(): number {
			return mem.u8[(base + 4)];
		},
		set modifiers(x: number) {
			mem.u8[(base + 4)] = x;
		},
		
		fromEvent(e: globalThis.TouchEvent) {
			const bounds = (<Element>(e.target)).getBoundingClientRect();
			this.clientX = e.touches[0].clientX - bounds.left;
			this.clientY = e.touches[0].clientY - bounds.top;
		}
		
	};
});

export interface WheelEvent extends WasmTypeBase {
	/**
	 * Scroll X delta
	 * 
	 * @remarks
	 * Zig type: `i16`
	 */
	deltaX: number;
	/**
	 * Scroll Y delta
	 * 
	 * @remarks
	 * Zig type: `i16`
	 */
	deltaY: number;
	/**
	 * Scroll Z delta
	 * 
	 * @remarks
	 * Zig type: `i16`
	 */
	deltaZ: number;
	/**
	 * Delta mode
	 */
	mode: WheelDeltaMode;
	/**
	 * Encoded bitmask of currently pressed modifier keys, see `KeyModifier` enum
	 * 
	 * @remarks
	 * Zig type: `u8`
	 */
	modifiers: number;
	/**
	 * Encoded bitmask of currently pressed mouse buttons, see `MouseButton` enum
	 * 
	 * @remarks
	 * Zig type: `u8`
	 */
	buttons: number;
	
	fromEvent(e: globalThis.WheelEvent): void;
	
}

// @ts-ignore possibly unused args
export const $WheelEvent = defType<WheelEvent>(2, 10, (mem, base) => {
	return {
		get deltaX(): number {
			return mem.i16[base >>> 1];
		},
		set deltaX(x: number) {
			mem.i16[base >>> 1] = x;
		},
		get deltaY(): number {
			return mem.i16[(base + 2) >>> 1];
		},
		set deltaY(x: number) {
			mem.i16[(base + 2) >>> 1] = x;
		},
		get deltaZ(): number {
			return mem.i16[(base + 4) >>> 1];
		},
		set deltaZ(x: number) {
			mem.i16[(base + 4) >>> 1] = x;
		},
		get mode(): WheelDeltaMode {
			return mem.u8[(base + 6)];
		},
		set mode(x: WheelDeltaMode) {
			mem.u8[(base + 6)] = x;
		},
		get modifiers(): number {
			return mem.u8[(base + 7)];
		},
		set modifiers(x: number) {
			mem.u8[(base + 7)] = x;
		},
		get buttons(): number {
			return mem.u8[(base + 8)];
		},
		set buttons(x: number) {
			mem.u8[(base + 8)] = x;
		},
		
		fromEvent(e: globalThis.WheelEvent) {
			this.deltaX = e.deltaX;
			this.deltaY = e.deltaY;
			this.deltaZ = e.deltaZ;
			this.mode = e.deltaMode;
			this.buttons = e.buttons;
		}
		
	};
});

export interface EventBody extends WasmTypeBase {
	readonly drag: DragEvent;
	readonly input: InputEvent;
	readonly key: KeyEvent;
	readonly mouse: MouseEvent;
	readonly pointer: PointerEvent;
	readonly scroll: ScrollEvent;
	readonly touch: TouchEvent;
	readonly wheel: WheelEvent;
}

// @ts-ignore possibly unused args
export const $EventBody = defType<EventBody>(4, 24, (mem, base) => {
	return {
		get drag(): DragEvent {
			return $DragEvent(mem).instance(base);
		},
		get input(): InputEvent {
			return $InputEvent(mem).instance(base);
		},
		get key(): KeyEvent {
			return $KeyEvent(mem).instance(base);
		},
		get mouse(): MouseEvent {
			return $MouseEvent(mem).instance(base);
		},
		get pointer(): PointerEvent {
			return $PointerEvent(mem).instance(base);
		},
		get scroll(): ScrollEvent {
			return $ScrollEvent(mem).instance(base);
		},
		get touch(): TouchEvent {
			return $TouchEvent(mem).instance(base);
		},
		get wheel(): WheelEvent {
			return $WheelEvent(mem).instance(base);
		},
	};
});

export interface Event extends WasmTypeBase {
	id: EventType;
	/**
	 * Target element ID, > 1 if a known (WASM created) element, otherwise:
	 * 
	 * - -2: = unknown
	 * - -1: window
	 * - 0: document.head
	 * - 1: document.body
	 * 
	 * @remarks
	 * Zig type: `i32`
	 */
	target: number;
	/**
	 * Event details / payload. Currently, only the following event types have a
	 * defined body:
	 * 
	 * - drag
	 * - input
	 * - key
	 * - mouse
	 * - pointer
	 * - scroll
	 * - touch
	 * - wheel
	 */
	readonly body: EventBody;
}

// @ts-ignore possibly unused args
export const $Event = defType<Event>(4, 32, (mem, base) => {
	return {
		get id(): EventType {
			return mem.i32[base >>> 2];
		},
		set id(x: EventType) {
			mem.i32[base >>> 2] = x;
		},
		get target(): number {
			return mem.i32[(base + 4) >>> 2];
		},
		set target(x: number) {
			mem.i32[(base + 4) >>> 2] = x;
		},
		get body(): EventBody {
			return $EventBody(mem).instance((base + 8));
		},
	};
});

/**
 * DOM event listener
 */
export interface EventListener extends WasmTypeBase {
}

// @ts-ignore possibly unused args
export const $EventListener = defType<EventListener>(4, 8, (mem, base) => {
	return {
	};
});

/**
 * Data structure used for declarative creation of DOM elements / trees (passed
 * to `createElement()`)
 * Also see `CreateCanvasOpts` for canvas specific use cases
 */
export interface CreateElementOpts extends WasmTypeBase {
	/**
	 * DOM element name
	 */
	readonly tag: WasmStringPtr;
	/**
	 * Namespace URI or wellknown registered alias (e.g. svg, xlink, xmlns)
	 */
	readonly ns: WasmStringPtr;
	/**
	 * ID attrib
	 */
	readonly id: WasmStringPtr;
	/**
	 * Element class attrib
	 */
	readonly class: WasmStringPtr;
	/**
	 * Element inner text body
	 */
	readonly text: WasmStringPtr;
	/**
	 * Element inner HTML body
	 */
	readonly html: WasmStringPtr;
	/**
	 * Parent element ID. If >=0 the new element will be attached to that parent
	 * element. Set to -1 to leave new element unattached (default unless nested)
	 * 
	 * @remarks
	 * Zig type: `i32`
	 */
	readonly parent: number;
	/**
	 * Insertion index for new element or -1 to append (default)
	 * 
	 * @remarks
	 * Zig type: `i32`
	 */
	readonly index: number;
	/**
	 * Optional slice of child element specs, which will be automatically attached
	 * as children to this element (their `parent` ID will be ignored)
	 */
	readonly children: CreateElementOpts[];
	/**
	 * Optional slice of attribute definitions for this element. Also see provided
	 * `Attrib` factory functions for convenience.
	 */
	readonly attribs: Attrib[];
}

// @ts-ignore possibly unused args
export const $CreateElementOpts = defType<CreateElementOpts>(4, 48, (mem, base) => {
	let $tag: WasmStringPtr, $ns: WasmStringPtr, $id: WasmStringPtr, $class: WasmStringPtr, $text: WasmStringPtr, $html: WasmStringPtr;
	return {
		get tag(): WasmStringPtr {
			return $tag || ($tag = __str(mem, base));
		},
		get ns(): WasmStringPtr {
			return $ns || ($ns = __str(mem, (base + 4)));
		},
		get id(): WasmStringPtr {
			return $id || ($id = __str(mem, (base + 8)));
		},
		get class(): WasmStringPtr {
			return $class || ($class = __str(mem, (base + 12)));
		},
		get text(): WasmStringPtr {
			return $text || ($text = __str(mem, (base + 16)));
		},
		get html(): WasmStringPtr {
			return $html || ($html = __str(mem, (base + 20)));
		},
		get parent(): number {
			return mem.i32[(base + 24) >>> 2];
		},
		get index(): number {
			return mem.i32[(base + 28) >>> 2];
		},
		get children(): CreateElementOpts[] {
			return __slice32(mem, $CreateElementOpts, (base + 32));
		},
		get attribs(): Attrib[] {
			return __slice32(mem, $Attrib, (base + 40));
		},
	};
});

/**
 * Data structure used for declarative creation of canvas elements (passed to
 * `createCanvas()`)
 */
export interface CreateCanvasOpts extends WasmTypeBase {
	/**
	 * Canvas width (in CSS pixels)
	 * 
	 * @remarks
	 * Zig type: `u16`
	 */
	readonly width: number;
	/**
	 * Canvas height (in CSS pixels)
	 * 
	 * @remarks
	 * Zig type: `u16`
	 */
	readonly height: number;
	/**
	 * Element ID attrib
	 */
	readonly id: WasmStringPtr;
	/**
	 * Element class attrib
	 */
	readonly class: WasmStringPtr;
	/**
	 * Same as CreateElementOpts.parent
	 * 
	 * @remarks
	 * Zig type: `i32`
	 */
	readonly parent: number;
	/**
	 * Same as CreateElementOpts.index
	 * 
	 * @remarks
	 * Zig type: `i32`
	 */
	readonly index: number;
	/**
	 * Device pixel ratio for computing physical pixel dimensions, see
	 * `getWindowInfo()`
	 * 
	 * @remarks
	 * Zig type: `u8`
	 */
	readonly dpr: number;
	/**
	 * Optional slice of attribute definitions for this element. Also see provided
	 * `Attrib` factory functions for convenience.
	 */
	readonly attribs: Attrib[];
}

// @ts-ignore possibly unused args
export const $CreateCanvasOpts = defType<CreateCanvasOpts>(4, 32, (mem, base) => {
	let $id: WasmStringPtr, $class: WasmStringPtr;
	return {
		get width(): number {
			return mem.u16[base >>> 1];
		},
		get height(): number {
			return mem.u16[(base + 2) >>> 1];
		},
		get id(): WasmStringPtr {
			return $id || ($id = __str(mem, (base + 4)));
		},
		get class(): WasmStringPtr {
			return $class || ($class = __str(mem, (base + 8)));
		},
		get parent(): number {
			return mem.i32[(base + 12) >>> 2];
		},
		get index(): number {
			return mem.i32[(base + 16) >>> 2];
		},
		get dpr(): number {
			return mem.u8[(base + 20)];
		},
		get attribs(): Attrib[] {
			return __slice32(mem, $Attrib, (base + 24));
		},
	};
});

/**
 * DOM element attribute definition given as part of `CreateElementOpts`
 */
export interface Attrib extends WasmTypeBase {
	readonly name: WasmStringPtr;
	readonly value: AttribValue;
	readonly kind: AttribType;
}

// @ts-ignore possibly unused args
export const $Attrib = defType<Attrib>(8, 24, (mem, base) => {
	let $name: WasmStringPtr;
	return {
		get name(): WasmStringPtr {
			return $name || ($name = __str(mem, base));
		},
		get value(): AttribValue {
			return $AttribValue(mem).instance((base + 8));
		},
		get kind(): AttribType {
			return mem.u8[(base + 16)];
		},
	};
});

export interface AttribValue extends WasmTypeBase {
	readonly event: EventListener;
	/**
	 * Zig type: `u8`
	 */
	readonly flag: number;
	/**
	 * Zig type: `f64`
	 */
	readonly num: number;
	readonly str: WasmStringPtr;
}

// @ts-ignore possibly unused args
export const $AttribValue = defType<AttribValue>(8, 8, (mem, base) => {
	let $str: WasmStringPtr;
	return {
		get event(): EventListener {
			return $EventListener(mem).instance(base);
		},
		get flag(): number {
			return mem.u8[base];
		},
		get num(): number {
			return mem.f64[base >>> 3];
		},
		get str(): WasmStringPtr {
			return $str || ($str = __str(mem, base));
		},
	};
});

export enum AttribType {
	EVENT,
	FLAG,
	NUM,
	STR,
}
