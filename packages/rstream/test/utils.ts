// SPDX-License-Identifier: Apache-2.0
import { assert } from "@thi.ng/errors";
import { State, type ISubscription } from "../src/index.js";

export const assertState = (x: ISubscription<any, any>, state: State) =>
	assert(x.getState() === state, `${x.id} != ${State[state]}`);

export const assertIdle = (x: ISubscription<any, any>) =>
	assertState(x, State.IDLE);

export const assertActive = (x: ISubscription<any, any>) =>
	assertState(x, State.ACTIVE);

export const assertDone = (x: ISubscription<any, any>) =>
	assertState(x, State.DONE);

export const assertUnsub = (x: ISubscription<any, any>) =>
	assertState(x, State.UNSUBSCRIBED);

export const assertError = (x: ISubscription<any, any>) =>
	assertState(x, State.ERROR);
