// SPDX-License-Identifier: Apache-2.0
import { isString } from "@thi.ng/checks/is-string";
import type { LogEntry, LogLevel } from "@thi.ng/logger";
import type { Transducer } from "@thi.ng/transducers";
import { filter } from "@thi.ng/transducers/filter";

export const onlyLevel = (level: LogLevel): Transducer<LogEntry, LogEntry> =>
	filter((l) => l[0] === level);

export const minLevel = (level: LogLevel): Transducer<LogEntry, LogEntry> =>
	filter((l) => l[0] >= level);

export const maxLevel = (level: LogLevel): Transducer<LogEntry, LogEntry> =>
	filter((l) => l[0] <= level);

export const matchID = (id: string | RegExp): Transducer<LogEntry, LogEntry> =>
	filter(isString(id) ? (l) => l[1] === id : (l) => id.test(l[1]));
