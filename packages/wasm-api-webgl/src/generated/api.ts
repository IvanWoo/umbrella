/**
 * Generated by @thi.ng/wasm-api-bindgen at 2024-11-10T16:53:44.121Z
 * DO NOT EDIT!
 */

// @ts-ignore possibly includes unused imports
import { defType, Pointer, WasmStringPtr, type IWasmMemoryAccess, type MemorySlice, type MemoryView, type WasmTypeBase } from "@thi.ng/wasm-api";
// @ts-ignore
import { __array, __instanceArray, __slice32, __primslice32 } from "@thi.ng/wasm-api/memory";

// @ts-ignore possibly unused
const __str = (mem: IWasmMemoryAccess, base: number, isConst = true) => new WasmStringPtr(mem, base, isConst);

import type { GLType as ModelAttribType } from "@thi.ng/api";
// @ts-ignore possibly includes unused imports
import type { DrawMode, TextureFilter, TextureFormat, TextureRepeat, TextureTarget, TextureType } from "@thi.ng/webgl";

/**
 * WebGL rendering context options, used by `createCanvasContext()`
 */
export interface WebGLContextOpts extends WasmTypeBase {
	/**
	 * Zig type: `u8`
	 */
	readonly alpha: number;
	/**
	 * Zig type: `u8`
	 */
	readonly antialias: number;
	/**
	 * Zig type: `u8`
	 */
	readonly depth: number;
	/**
	 * Zig type: `u8`
	 */
	readonly desynchronized: number;
	/**
	 * Zig type: `u8`
	 */
	readonly failIfMajorPerformanceCaveat: number;
	readonly powerPreference: WebGLPowerPreference;
	/**
	 * Zig type: `u8`
	 */
	readonly premultipliedAlpha: number;
	/**
	 * Zig type: `u8`
	 */
	readonly preserveDrawingBuffer: number;
	/**
	 * Zig type: `u8`
	 */
	readonly stencil: number;
}

// @ts-ignore possibly unused args
export const $WebGLContextOpts = defType<WebGLContextOpts>(1, 9, (mem, base) => {
	return {
		get alpha(): number {
			return mem.u8[base];
		},
		get antialias(): number {
			return mem.u8[(base + 1)];
		},
		get depth(): number {
			return mem.u8[(base + 2)];
		},
		get desynchronized(): number {
			return mem.u8[(base + 3)];
		},
		get failIfMajorPerformanceCaveat(): number {
			return mem.u8[(base + 4)];
		},
		get powerPreference(): WebGLPowerPreference {
			return mem.u8[(base + 5)];
		},
		get premultipliedAlpha(): number {
			return mem.u8[(base + 6)];
		},
		get preserveDrawingBuffer(): number {
			return mem.u8[(base + 7)];
		},
		get stencil(): number {
			return mem.u8[(base + 8)];
		},
	};
});

export enum WebGLPowerPreference {
	default,
	high_performance,
	low_power,
}

export interface ShaderSpec extends WasmTypeBase {
	readonly vs: WasmStringPtr;
	readonly fs: WasmStringPtr;
	/**
	 * Slice of shader attribute specs
	 */
	readonly attribs: ShaderAttribSpec[];
	/**
	 * Slice of shader varying specs
	 */
	readonly varying: ShaderVaryingSpec[];
	/**
	 * Slice of shader uniform specs
	 */
	readonly uniforms: ShaderUniformSpec[];
}

// @ts-ignore possibly unused args
export const $ShaderSpec = defType<ShaderSpec>(4, 32, (mem, base) => {
	let $vs: WasmStringPtr, $fs: WasmStringPtr;
	return {
		get vs(): WasmStringPtr {
			return $vs || ($vs = __str(mem, base));
		},
		get fs(): WasmStringPtr {
			return $fs || ($fs = __str(mem, (base + 4)));
		},
		get attribs(): ShaderAttribSpec[] {
			return __slice32(mem, $ShaderAttribSpec, (base + 8));
		},
		get varying(): ShaderVaryingSpec[] {
			return __slice32(mem, $ShaderVaryingSpec, (base + 16));
		},
		get uniforms(): ShaderUniformSpec[] {
			return __slice32(mem, $ShaderUniformSpec, (base + 24));
		},
	};
});

export interface ShaderAttribSpec extends WasmTypeBase {
	readonly name: WasmStringPtr;
	readonly type: ShaderAttribType;
}

// @ts-ignore possibly unused args
export const $ShaderAttribSpec = defType<ShaderAttribSpec>(4, 8, (mem, base) => {
	let $name: WasmStringPtr;
	return {
		get name(): WasmStringPtr {
			return $name || ($name = __str(mem, base));
		},
		get type(): ShaderAttribType {
			return mem.u8[(base + 4)];
		},
	};
});

export interface ShaderVaryingSpec extends WasmTypeBase {
	readonly name: WasmStringPtr;
	readonly type: ShaderAttribType;
}

// @ts-ignore possibly unused args
export const $ShaderVaryingSpec = defType<ShaderVaryingSpec>(4, 8, (mem, base) => {
	let $name: WasmStringPtr;
	return {
		get name(): WasmStringPtr {
			return $name || ($name = __str(mem, base));
		},
		get type(): ShaderAttribType {
			return mem.u8[(base + 4)];
		},
	};
});

export interface ShaderUniformSpec extends WasmTypeBase {
	readonly name: WasmStringPtr;
	readonly type: UniformType;
	readonly default: UniformValue;
}

// @ts-ignore possibly unused args
export const $ShaderUniformSpec = defType<ShaderUniformSpec>(16, 32, (mem, base) => {
	let $name: WasmStringPtr;
	return {
		get name(): WasmStringPtr {
			return $name || ($name = __str(mem, base));
		},
		get type(): UniformType {
			return mem.u8[(base + 4)];
		},
		get default(): UniformValue {
			return $UniformValue(mem).instance((base + 16));
		},
	};
});

export interface ModelSpec extends WasmTypeBase {
	/**
	 * Slice of model attribute specs
	 */
	readonly attribs: ModelAttribSpec[];
	/**
	 * Slice of instance attribute specs
	 */
	readonly instances: ModelAttribSpec[];
	/**
	 * Slice of model uniforms
	 */
	readonly uniforms: ModelUniform[];
	/**
	 * Zig type: `ConstI32Slice`
	 */
	readonly textures: Int32Array;
	/**
	 * Zig type: `i32`
	 */
	readonly shader: number;
	/**
	 * Zig type: `u32`
	 */
	readonly num: number;
	/**
	 * Zig type: `u32`
	 */
	readonly numInstances: number;
	readonly mode: DrawMode;
}

// @ts-ignore possibly unused args
export const $ModelSpec = defType<ModelSpec>(4, 48, (mem, base) => {
	return {
		get attribs(): ModelAttribSpec[] {
			return __slice32(mem, $ModelAttribSpec, base);
		},
		get instances(): ModelAttribSpec[] {
			return __slice32(mem, $ModelAttribSpec, (base + 8));
		},
		get uniforms(): ModelUniform[] {
			return __slice32(mem, $ModelUniform, (base + 16));
		},
		get textures(): Int32Array {
			return __primslice32(mem, mem.i32, (base + 24), 2);
		},
		get shader(): number {
			return mem.i32[(base + 32) >>> 2];
		},
		get num(): number {
			return mem.u32[(base + 36) >>> 2];
		},
		get numInstances(): number {
			return mem.u32[(base + 40) >>> 2];
		},
		get mode(): DrawMode {
			return mem.u8[(base + 44)];
		},
	};
});

export interface ModelAttribSpec extends WasmTypeBase {
	readonly name: WasmStringPtr;
	readonly data: ModelAttribData;
	readonly type: ModelAttribType;
	/**
	 * Zig type: `u32`
	 */
	readonly offset: number;
	/**
	 * Zig type: `u32`
	 */
	readonly stride: number;
	/**
	 * Zig type: `u32`
	 */
	readonly size: number;
}

// @ts-ignore possibly unused args
export const $ModelAttribSpec = defType<ModelAttribSpec>(4, 28, (mem, base) => {
	let $name: WasmStringPtr;
	return {
		get name(): WasmStringPtr {
			return $name || ($name = __str(mem, base));
		},
		get data(): ModelAttribData {
			return $ModelAttribData(mem).instance((base + 4));
		},
		get type(): ModelAttribType {
			return mem.u16[(base + 12) >>> 1];
		},
		get offset(): number {
			return mem.u32[(base + 16) >>> 2];
		},
		get stride(): number {
			return mem.u32[(base + 20) >>> 2];
		},
		get size(): number {
			return mem.u32[(base + 24) >>> 2];
		},
	};
});

export interface ModelAttribData extends WasmTypeBase {
	/**
	 * Zig type: `ConstI8Slice`
	 */
	readonly u8: Int8Array;
	/**
	 * Zig type: `ConstU8Slice`
	 */
	readonly i8: Uint8Array;
	/**
	 * Zig type: `ConstI16Slice`
	 */
	readonly i16: Int16Array;
	/**
	 * Zig type: `ConstU16Slice`
	 */
	readonly u16: Uint16Array;
	/**
	 * Zig type: `ConstI32Slice`
	 */
	readonly u32: Int32Array;
	/**
	 * Zig type: `ConstU32Slice`
	 */
	readonly i32: Uint32Array;
	/**
	 * Zig type: `ConstF32Slice`
	 */
	readonly f32: Float32Array;
}

// @ts-ignore possibly unused args
export const $ModelAttribData = defType<ModelAttribData>(4, 8, (mem, base) => {
	return {
		get u8(): Int8Array {
			return __primslice32(mem, mem.i8, base, 0);
		},
		get i8(): Uint8Array {
			return __primslice32(mem, mem.u8, base, 0);
		},
		get i16(): Int16Array {
			return __primslice32(mem, mem.i16, base, 1);
		},
		get u16(): Uint16Array {
			return __primslice32(mem, mem.u16, base, 1);
		},
		get u32(): Int32Array {
			return __primslice32(mem, mem.i32, base, 2);
		},
		get i32(): Uint32Array {
			return __primslice32(mem, mem.u32, base, 2);
		},
		get f32(): Float32Array {
			return __primslice32(mem, mem.f32, base, 2);
		},
	};
});

export interface AttribUpdateSpec extends WasmTypeBase {
	readonly data: ModelAttribData;
	readonly type: ModelAttribType;
	/**
	 * Start byte offset in WebGL buffer
	 * 
	 * @remarks
	 * Zig type: `u32`
	 */
	readonly offset: number;
}

// @ts-ignore possibly unused args
export const $AttribUpdateSpec = defType<AttribUpdateSpec>(4, 16, (mem, base) => {
	return {
		get data(): ModelAttribData {
			return $ModelAttribData(mem).instance(base);
		},
		get type(): ModelAttribType {
			return mem.u16[(base + 8) >>> 1];
		},
		get offset(): number {
			return mem.u32[(base + 12) >>> 2];
		},
	};
});

export interface ModelUniform extends WasmTypeBase {
	readonly name: WasmStringPtr;
	readonly type: UniformType;
	readonly value: UniformValue;
}

// @ts-ignore possibly unused args
export const $ModelUniform = defType<ModelUniform>(16, 32, (mem, base) => {
	let $name: WasmStringPtr;
	return {
		get name(): WasmStringPtr {
			return $name || ($name = __str(mem, base));
		},
		get type(): UniformType {
			return mem.u8[(base + 4)];
		},
		get value(): UniformValue {
			return $UniformValue(mem).instance((base + 16));
		},
	};
});

export interface UniformValue extends WasmTypeBase {
	/**
	 * Zig type: `f32`
	 */
	readonly float: number;
	/**
	 * Zig type: `@Vector(2, f32)`
	 */
	readonly vec2: Float32Array;
	/**
	 * Zig type: `@Vector(3, f32)`
	 */
	readonly vec3: Float32Array;
	/**
	 * Zig type: `@Vector(4, f32)`
	 */
	readonly vec4: Float32Array;
}

// @ts-ignore possibly unused args
export const $UniformValue = defType<UniformValue>(16, 16, (mem, base) => {
	return {
		get float(): number {
			return mem.f32[base >>> 2];
		},
		get vec2(): Float32Array {
			const addr = base >>> 2;
			return mem.f32.subarray(addr, addr + 2);
		},
		get vec3(): Float32Array {
			const addr = base >>> 2;
			return mem.f32.subarray(addr, addr + 3);
		},
		get vec4(): Float32Array {
			const addr = base >>> 2;
			return mem.f32.subarray(addr, addr + 4);
		},
	};
});

export interface TextureSpec extends WasmTypeBase {
	readonly img: ImageData;
	/**
	 * Zig type: `u16`
	 */
	readonly width: number;
	/**
	 * Zig type: `u16`
	 */
	readonly height: number;
	/**
	 * Zig type: `u16`
	 */
	readonly depth: number;
	readonly format: TextureFormat;
	readonly target: TextureTarget;
	readonly type: TextureType;
	readonly filter: TextureFilter;
	readonly wrap: TextureRepeat;
	readonly imgType: ImageType;
}

// @ts-ignore possibly unused args
export const $TextureSpec = defType<TextureSpec>(4, 28, (mem, base) => {
	return {
		get img(): ImageData {
			return $ImageData(mem).instance(base);
		},
		get width(): number {
			return mem.u16[(base + 8) >>> 1];
		},
		get height(): number {
			return mem.u16[(base + 10) >>> 1];
		},
		get depth(): number {
			return mem.u16[(base + 12) >>> 1];
		},
		get format(): TextureFormat {
			return mem.u16[(base + 14) >>> 1];
		},
		get target(): TextureTarget {
			return mem.u16[(base + 16) >>> 1];
		},
		get type(): TextureType {
			return mem.u16[(base + 18) >>> 1];
		},
		get filter(): TextureFilter {
			return mem.u16[(base + 20) >>> 1];
		},
		get wrap(): TextureRepeat {
			return mem.u16[(base + 22) >>> 1];
		},
		get imgType(): ImageType {
			return mem.u8[(base + 24)];
		},
	};
});

export interface ImageData extends WasmTypeBase {
	/**
	 * Zig type: `u32`
	 */
	readonly none: number;
	/**
	 * Zig type: `ConstU8Slice`
	 */
	readonly u8: Uint8Array;
	/**
	 * Zig type: `ConstU16Slice`
	 */
	readonly u16: Uint16Array;
	/**
	 * Zig type: `ConstU32Slice`
	 */
	readonly u32: Uint32Array;
	/**
	 * Zig type: `ConstF32Slice`
	 */
	readonly f32: Float32Array;
}

// @ts-ignore possibly unused args
export const $ImageData = defType<ImageData>(4, 8, (mem, base) => {
	return {
		get none(): number {
			return mem.u32[base >>> 2];
		},
		get u8(): Uint8Array {
			return __primslice32(mem, mem.u8, base, 0);
		},
		get u16(): Uint16Array {
			return __primslice32(mem, mem.u16, base, 1);
		},
		get u32(): Uint32Array {
			return __primslice32(mem, mem.u32, base, 2);
		},
		get f32(): Float32Array {
			return __primslice32(mem, mem.f32, base, 2);
		},
	};
});

export enum ImageType {
	none,
	u8,
	u16,
	u32,
	f32,
}

export enum ShaderAttribType {
	float,
	int,
	uint,
	vec2,
	vec3,
	vec4,
	mat22,
	mat33,
	mat44,
}

export enum UniformType {
	float,
	int,
	uint,
	vec2,
	vec3,
	vec4,
	mat22,
	mat33,
	mat44,
	sampler2D,
	sampler3D,
	samplerCube,
}
