import type { Fn0, IObjectOf } from "@thi.ng/api";
import type { Reducer, Transducer } from "@thi.ng/transducers";
import { compR } from "@thi.ng/transducers/compr";
import { ensureReduced, isReduced } from "@thi.ng/transducers/reduced";

export interface FSMState {
	state: PropertyKey;
}

export type FSMStateMap<T extends FSMState, A, B> = IObjectOf<
	FSMHandler<T, A, B>
>;
export type FSMHandler<T extends FSMState, A, B> = (
	state: T,
	input: A
) => B | null | void;

export interface FSMOpts<T extends FSMState, A, B> {
	states: FSMStateMap<T, A, B>;
	terminate: PropertyKey;
	init: Fn0<T>;
}

/**
 * Finite State Machine transducer. Takes an FSM configuration object and
 * returns a transducer, which processes inputs using the provided state handler
 * functions, which in turn can return any number of outputs per consumed input.
 *
 * Before processing the first input, the FSM state is initialized by calling
 * the user provided `init()` function, which MUST return a state object with at
 * least a `state` key, whose value is used for dynamic (i.e. stateful) dispatch
 * during input processing. This state object is passed with each input value to
 * the current state handler, which is expected to mutate this object, e.g. to
 * cause state changes based on given inputs.
 *
 * If a state handler needs to "emit" results for downstream processing, it can
 * return an array of values. Any such values are passed on (individually, not
 * as array) to the next reducer in the chain. If a state handler returns `null`
 * or `undefined`, further downstream processing of the current input is
 * skipped.
 *
 * Regardless of return value, if a state handler has caused a state change to
 * the configured `terminal` state, processing is terminated (by calling
 * [`ensureReduced()`](https://docs.thi.ng/umbrella/transducers/functions/ensureReduced.html))
 * and no further inputs will be consumed.
 *
 * @example
 * ```ts
 * import { fsm } from "@thi.ng/transducers-fsm";
 * import { comp, iterator, map, range, takeNth } from "@thi.ng/transducers";
 *
 * const testFSM = {
 *     states: {
 *         skip: (state, x) => {
 *             if (x < 20) {
 *                 if (++state.count > 5) {
 *                     state.state = "take";
 *                     state.count = 1;
 *                     return [x];
 *                 }
 *             } else {
 *                 state.state = "done";
 *             }
 *         },
 *         take: (state, x) => {
 *             if (x < 20) {
 *                 if (++state.count > 5) {
 *                     state.state = "skip";
 *                     state.count = 1;
 *                 } else {
 *                     return [x];
 *                 }
 *             } else {
 *                 state.state = "done";
 *             }
 *         },
 *         done: () => { },
 *     },
 *     terminate: "done",
 *     init: () => ({ state: "skip", count: 0 })
 * }
 *
 * [...iterator(fsm(testFSM), range(100))]
 * // [ 5, 6, 7, 8, 9, 15, 16, 17, 18, 19 ]
 *
 * // as part of composed transducers...
 * [...iterator(comp(takeNth(2), fsm(testFSM)), range(100))]
 * // [ 10, 12, 14, 16, 18 ]
 *
 * [...iterator(comp(fsm(testFSM), map((x) => x * 10)), range(100))]
 * // [ 50, 60, 70, 80, 90, 150, 160, 170, 180, 190 ]
 * ```
 *
 * @param opts -
 */
export const fsm =
	<T extends FSMState, A, B>(opts: FSMOpts<T, A, B[]>): Transducer<A, B> =>
	(rfn: Reducer<B, any>) => {
		const states = opts.states;
		const state = opts.init();
		const r = rfn[2];
		return compR(rfn, (acc, x) => {
			const res: any = states[<any>state.state](state, x);
			if (res != null) {
				for (let i = 0, n = (<B[]>res).length; i < n; i++) {
					acc = r(acc, res[i]);
					if (isReduced(acc)) {
						break;
					}
				}
			}
			if (state.state === opts.terminate) {
				return ensureReduced(acc);
			}
			return acc;
		});
	};
