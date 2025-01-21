// SPDX-License-Identifier: Apache-2.0
/**
 * Generated by @thi.ng/wasm-api-bindgen at 2024-11-10T14:29:04.823Z
 * DO NOT EDIT!
 */

// @ts-ignore possibly includes unused imports
import { defType, Pointer, WasmStringPtr, type IWasmMemoryAccess, type MemorySlice, type MemoryView, type WasmTypeBase } from "@thi.ng/wasm-api";

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
