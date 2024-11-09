/**
 * Generated by @thi.ng/wasm-api-bindgen at 2024-11-09T16:15:11.637Z
 * DO NOT EDIT!
 */

// @ts-ignore possibly includes unused imports
import { Pointer, WasmStringPtr, type IWasmMemoryAccess, type MemorySlice, type MemoryView, type WasmType, type WasmTypeBase, type WasmTypeConstructor } from "@thi.ng/wasm-api";

export enum ScheduleType {
	/**
	 * One-off execution in the future
	 */
	ONCE,
	/**
	 * Recurring execution at fixed interval
	 */
	INTERVAL,
	/**
	 * As soon as possible execution
	 */
	IMMEDIATE,
	/**
	 * Same as `requestAnimationFrame()` (or equivalent if not available in JS env)
	 */
	RAF,
}
