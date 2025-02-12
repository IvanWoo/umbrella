// SPDX-License-Identifier: Apache-2.0
import type { Fn, Fn0, IDeref, IID, Maybe } from "@thi.ng/api";
import type { Transducer } from "@thi.ng/transducers";
import type { Stream } from "./stream.js";

export enum State {
	IDLE,
	ACTIVE,
	DONE,
	UNSUBSCRIBED,
	ERROR,
}

/**
 * Closing behaviors:
 *
 * - Close when first input/output is done / removed
 * - Close when last input/output is done / removed
 * - Never close, even if no more inputs/outputs
 */
export type CloseMode = "first" | "last" | "never";

/**
 * Common base options for all stream / subscription types.
 */
export interface CommonOpts {
	/**
	 * Internal ID associated with this stream. If omitted, an autogenerated ID
	 * will be used.
	 */
	id: string;
	/**
	 * If false or `"never"`, the stream stays active even if all inputs are
	 * done. If true (default) or `"last"`, the stream closes when the last
	 * input is done. If `"first"`, the instance closes when the first input is
	 * done.
	 *
	 * @defaultValue "last"
	 */
	closeIn: CloseMode;
	/**
	 * If false or `"never"`, the stream stays active once there are no more
	 * subscribers. If true (default) or `"last"`, the stream closes when the
	 * last subscriber has unsubscribed. If `"first"`, the instance closes when
	 * the first subscriber disconnects.
	 *
	 * @defaultValue "last"
	 */
	closeOut: CloseMode;
	/**
	 * If true (default), stream caches last received value and pushes it to new
	 * subscriberswhen they subscribe. If false, calling `.deref()` on this
	 * stream will always return `undefined`.
	 *
	 * @defaultValue true
	 */
	cache: boolean;
}

export interface WithTransform<A, B> {
	/**
	 * Transducer to transform incoming stream values. If given, all child
	 * subscriptions will only receive the transformed result values.
	 */
	xform: Transducer<A, B>;
}

export interface TransformableOpts<A, B>
	extends CommonOpts,
		WithTransform<A, B> {}

export type ErrorHandler = Fn<any, boolean>;

export interface WithErrorHandler {
	/**
	 * Optional error handler to use for this stream/subscription
	 */
	error: ErrorHandler;
}

export interface WithErrorHandlerOpts extends CommonOpts, WithErrorHandler {}

export interface SubscriptionOpts<A, B> extends TransformableOpts<A, B> {
	/**
	 * Parent stream / subscription.
	 */
	parent: ISubscription<any, A>;
}

export interface ISubscriber<T> {
	/**
	 * Receives new input value `x` and executes any side effect.
	 */
	next: Fn<T, void>;
	/**
	 * Error handler, which will be called to handle any uncaught errors while
	 * executing {@link ISubscriber.next} or a transducer function attached to
	 * the {@link Subscription} wrapping this subscriber. The error handler must
	 * return true to indicate the error could be successfully handled/recovered
	 * from. If false, the subscription will go into {@link State.ERROR} and
	 * stops processing any further values (plus might trigger recursive
	 * teardown of the upstream dataflow topology).
	 */
	error?: ErrorHandler;
	/**
	 * Life cycle handler, usually invoked automatically when a finite stream
	 * source is finished.
	 *
	 * @remarks
	 * If the wrapping subscription has an associated transducer, any
	 * potentially internally buffered values will still be delivered to
	 * `.next()` first and the `.done()` handler only executed after.
	 *
	 * `.done()` handlers are called depth-first (in terms of
	 * dataflow/subscription topology) and the wrapping subscription instance
	 * usually then triggers a teardown in reverse (topological) order, by
	 * calling {@link ISubscribable.unsubscribe} on itself.
	 *
	 * If an error occurs during the execution of this handler, the subscription
	 * will still be potentially placed into the ERROR state, depending on
	 * presence and outcome of an error handler.
	 */
	done?: Fn0<void>;
	/**
	 * Internal use only. Do not use.
	 */
	__owner?: ISubscription<any, any>;
	[id: string]: any;
}

export interface ISubscribable<A> extends IDeref<Maybe<A>>, IID<string> {
	/**
	 * Adds given `sub` as child subscription.
	 *
	 * @param sub -
	 */
	subscribe<B>(sub: ISubscription<A, B>): ISubscription<A, B>;
	/**
	 * Wraps given partial `sub` in a {@link Subscription} and attaches it as
	 * child subscription.
	 *
	 * @param sub -
	 * @param opts -
	 */
	subscribe(
		sub: Partial<ISubscriber<A>>,
		opts?: Partial<CommonOpts>
	): ISubscription<A, A>;
	/**
	 * Wraps given partial `sub` in a {@link Subscription} and attaches it as
	 * child subscription. If `opts` defines a transducer (via `xform` key),
	 * input values will be transformed first before reaching the child sub's
	 * {@link ISubscriber.next} handler. Any further downstream subscriptions
	 * attached to the returned wrapped sub will also only receive those
	 * transformed values.
	 *
	 * See {@link ITransformable}
	 *
	 * @param sub -
	 * @param opts -
	 */
	subscribe<B>(
		sub: Partial<ISubscriber<B>>,
		opts?: Partial<TransformableOpts<A, B>>
	): ISubscription<A, B>;
	/**
	 * Removes given child sub, or if `sub` is omitted, detaches this
	 * subscription itself from its upstream parent (possibly triggering a
	 * cascade of further unsubscriptions, depending on
	 * {@link CommonOpts.closeOut} settings of parent(s)).
	 *
	 * @param sub -
	 */
	unsubscribe(sub?: ISubscription<A, any>): boolean;
}

export interface ITransformable<B> {
	transform<C>(
		a: Transducer<B, C>,
		opts?: Partial<WithErrorHandlerOpts>
	): ISubscription<B, C>;
	transform<C, D>(
		a: Transducer<B, C>,
		b: Transducer<C, D>,
		opts?: Partial<WithErrorHandlerOpts>
	): ISubscription<B, D>;
	transform<C, D, E>(
		a: Transducer<B, C>,
		b: Transducer<C, D>,
		c: Transducer<D, E>,
		opts?: Partial<WithErrorHandlerOpts>
	): ISubscription<B, E>;
	transform<C, D, E, F>(
		a: Transducer<B, C>,
		b: Transducer<C, D>,
		c: Transducer<D, E>,
		d: Transducer<E, F>,
		opts?: Partial<WithErrorHandlerOpts>
	): ISubscription<B, F>;
	transform<C>(
		opts: WithTransform<B, C> & Partial<WithErrorHandlerOpts>
	): ISubscription<B, C>;
	map<C>(
		fn: Fn<B, C>,
		opts?: Partial<WithErrorHandlerOpts>
	): ISubscription<B, C>;
}

export interface ISubscription<A, B>
	extends IDeref<Maybe<B>>,
		ISubscriber<A>,
		ISubscribable<B>,
		ITransformable<B> {
	parent?: ISubscription<any, A>;

	getState(): State;
}

export interface IStream<T> extends ISubscriber<T> {
	cancel: StreamCancel;
}

export type StreamCancel = () => void;
export type StreamSource<T> = (sub: Stream<T>) => StreamCancel | void;

export type WorkerSource = Worker | Blob | Fn0<Worker> | string;
