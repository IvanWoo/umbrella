/**
 * Generated by @thi.ng/wasm-api-bindgen at 2024-11-10T14:30:06.407Z
 * DO NOT EDIT!
 */

// @ts-ignore possibly includes unused imports
import { defType, Pointer, WasmStringPtr, type IWasmMemoryAccess, type MemorySlice, type MemoryView, type WasmTypeBase } from "@thi.ng/wasm-api";
// @ts-ignore
import { __array, __instanceArray, __slice32, __primslice32 } from "@thi.ng/wasm-api/memory";

// @ts-ignore possibly unused
const __str = (mem: IWasmMemoryAccess, base: number, isConst = true) => new WasmStringPtr(mem, base, isConst);

export interface Task extends WasmTypeBase {
	state: TaskState;
	readonly body: WasmStringPtr;
	/**
	 * Zig type: `u32`
	 */
	dateCreated: number;
	/**
	 * Zig type: `u32`
	 */
	dateDone: number;
}

// @ts-ignore possibly unused args
export const $Task = defType<Task>(4, 16, (mem, base) => {
	let $body: WasmStringPtr;
	return {
		get state(): TaskState {
			return mem.i32[base >>> 2];
		},
		set state(x: TaskState) {
			mem.i32[base >>> 2] = x;
		},
		get body(): WasmStringPtr {
			return $body || ($body = __str(mem, (base + 4)));
		},
		get dateCreated(): number {
			return mem.u32[(base + 8) >>> 2];
		},
		set dateCreated(x: number) {
			mem.u32[(base + 8) >>> 2] = x;
		},
		get dateDone(): number {
			return mem.u32[(base + 12) >>> 2];
		},
		set dateDone(x: number) {
			mem.u32[(base + 12) >>> 2] = x;
		},
	};
});

export enum TaskState {
	OPEN,
	DONE,
}
