import type { Fn, Fn0, FnO } from "@thi.ng/api";
import type { IWasmAPI, WasmBridge } from "@thi.ng/wasm-api";
import {
	ScheduleType,
	type WasmScheduleExports,
	type WasmScheduleImports,
} from "./api.js";

/** @internal */
interface ScheduledCall {
	id: number;
	timeout: any;
	kind: ScheduleType;
}

const START: Record<ScheduleType, FnO<Fn0<void>, any>> = {
	[ScheduleType.ONCE]: setTimeout,
	[ScheduleType.INTERVAL]: setInterval,
	[ScheduleType.IMMEDIATE]:
		typeof setImmediate !== "undefined"
			? setImmediate
			: (x) => setTimeout(x, 0),
	[ScheduleType.RAF]:
		typeof requestAnimationFrame !== "undefined"
			? requestAnimationFrame
			: (x) => setTimeout(x, 16),
};

const CANCEL: Record<ScheduleType, Fn<any, void>> = {
	[ScheduleType.ONCE]: clearTimeout,
	[ScheduleType.INTERVAL]: clearInterval,
	[ScheduleType.IMMEDIATE]:
		typeof clearImmediate !== "undefined" ? clearImmediate : clearTimeout,
	[ScheduleType.RAF]:
		typeof cancelAnimationFrame !== "undefined"
			? cancelAnimationFrame
			: clearTimeout,
};

export class WasmSchedule implements IWasmAPI<WasmScheduleExports> {
	static readonly id = "schedule";

	readonly id = WasmSchedule.id;

	parent!: WasmBridge<WasmScheduleExports>;
	listeners: Record<number, ScheduledCall> = {};

	async init(parent: WasmBridge<WasmScheduleExports>) {
		this.parent = parent;
		if (parent.exports._schedule_init) {
			parent.exports._schedule_init();
		} else {
			parent.logger.warn("schedule module unused, skipping auto-init...");
		}
		return true;
	}

	getImports(): WasmScheduleImports {
		return {
			_schedule: (kind, delay, listenerID) => {
				this.listeners[listenerID] = {
					id: listenerID,
					timeout: START[kind].call(
						null,
						() =>
							this.parent.exports._schedule_callback(
								listenerID,
								kind
							),
						delay
					),
					kind,
				};
			},

			_cancel: (listenerID) => {
				const listener = this.listeners[listenerID];
				if (listener) {
					CANCEL[listener.kind].call(null, listenerID);
					delete this.listeners[listenerID];
				}
			},

			now: () => performance.now(),
		};
	}
}
