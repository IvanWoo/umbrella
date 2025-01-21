// SPDX-License-Identifier: Apache-2.0
import { S2D, V2 } from "@thi.ng/shader-ast/api/types";
import { assign } from "@thi.ng/shader-ast/ast/assign";
import { defMain } from "@thi.ng/shader-ast/ast/function";
import { FLOAT0, FLOAT1, vec4 } from "@thi.ng/shader-ast/ast/lit";
import { $xy } from "@thi.ng/shader-ast/ast/swizzle";
import { texture } from "@thi.ng/shader-ast/builtin/texture";
import type { ShaderFn, ShaderSpec } from "../api/shader.js";

export const PASSTHROUGH_VS: ShaderFn = (gl, _, ins) => [
	defMain(() => [assign(gl.gl_Position, vec4(ins.position, FLOAT0, FLOAT1))]),
];

export const PASSTHROUGH_VS_UV: ShaderFn = (gl, _, ins, outs) => [
	defMain(() => [
		assign(outs.v_uv, ins.uv),
		assign(gl.gl_Position, vec4(ins.position, FLOAT0, FLOAT1)),
	]),
];

export const PASSTHROUGH_FS: ShaderFn = (gl, _, __, outs) => [
	defMain(() => [assign(outs.fragColor, $xy(gl.gl_FragCoord))]),
];

export const PASSTHROUGH_FS_UV: ShaderFn = (_, unis, ins, outs) => [
	defMain(() => [assign(outs.fragColor, texture(unis.tex, ins.v_uv))]),
];

export const FX_SHADER_SPEC: ShaderSpec = {
	vs: PASSTHROUGH_VS,
	fs: PASSTHROUGH_FS,
	attribs: { position: V2 },
	varying: {},
	uniforms: {},
	state: { depth: false },
	ext: {},
};

export const FX_SHADER_SPEC_UV: ShaderSpec = {
	vs: PASSTHROUGH_VS_UV,
	fs: PASSTHROUGH_FS_UV,
	attribs: { position: V2, uv: V2 },
	varying: { v_uv: V2 },
	uniforms: { tex: S2D },
	state: { depth: false },
	ext: {},
};
