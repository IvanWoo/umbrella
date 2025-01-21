// SPDX-License-Identifier: Apache-2.0
//! Generated by @thi.ng/wasm-api-bindgen at 2022-11-30T17:23:52.162Z
//! DO NOT EDIT!

const std = @import("std");
const bindgen = @import("wasm-api-bindgen");

pub const Task = extern struct {
    state: TaskState = .open,
    body: bindgen.ConstStringPtr,
    dateCreated: u32,
    dateDone: u32 = 0,
};

pub const TaskState = enum(i32) {
    open,
    done,
};
