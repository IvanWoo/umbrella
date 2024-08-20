<!-- include ../../assets/tpl/header.md -->

<!-- toc -->

## About

{{pkg.description}}

This library provides & uses three key building blocks for reactive programming:

- **Stream sources**: event targets, iterables, timers, promises,watches,
  workers, manual-push...
- **Subscriptions**: chained stream processors, each subscribable (one-tmany)
  itself
- **Transducers**: stream transformers, either as individual subscription or to
  transform incoming values for a single subscription. See packages/transducers)
  for 100+ composable operators.
- **Recursive teardown**: Whenever possible, and depending on configuration,
  unsubscriptions initiate cleanup and propagate to parent(s).
- **Workers**: highly configurable, web worker integration for concurrent /
  parallel stream processing (fork-join, tunneled stream processing, etc.)

## Conceptual differences to RxJS

(No value judgments implied - there's room for both approaches!)

- Streams are not the same as Observables: I.e. stream sources are NOT (often
  just cannot) re-run for each new sub added. Only the first sub is guaranteed
  to receive **all** values. Subs added at a later time MIGHT not receive
  earlier emitted values, but only the most recent emitted and any future values
- Every subscription supports any number of subscribers, which can be
  added/removed at any time
- Depending on configuration options, every unsubscription recursively triggers
  upstream unsubscriptions (provided a parent has no other active child
  subscriptions)
- Every subscription can have its own transducer transforming incoming values
  (possibly into multiple new ones)
- Transducers can create streams themselves (only for `merge()` /`sync()`)
- Transducers can cause early stream termination and subsequent unwinding for
  its parent and downstream subscriptions.
- Values can be manually injected into the stream pipeline / graph at any point
- Unhandled errors in a subscription will move the subscription into an error
  state and cause unsubscription from parent (if any). Unhandled errors in
  stream sources will cancel the stream.
- _Much_ smaller API surface, since most common & custom operations can be
  solved via available transducers. Therefore there's less of a need to provide
  specialized functions (map / filter etc.) and gain more flexibility in terms
  of composing new operations.
- IMHO less confusing naming / terminology (only streams (producers) &
  subscriptions (consumers))

{{meta.status}}

### New features & breaking changes in 9.0.0

The `CloseMode` enum has been replaced with a more compact & simple string union
type, see [docs](https://docs.thi.ng/umbrella/rstream/types/CloseMode.html) and
[usage](#common-configuration-options).

### New features & breaking changes in 6.0.0

Completely revised & improved [error handling](#error-handling), stronger
distinction between `.subscribe()` and `.transform()` methods & internal
simplification of their implementations.

1. All error handlers now MUST return a boolean to indicate if the error was
   recoverable from or should put the subscription into the error state. See
   [error handling](#error-handling) for details.

2. The options given to `.transform()` and `.map()` can now include an `error`
   handler:

```ts
// transform stream with given transducer(s)
// and forward any errors to `handleError` (user defined fn)
src.transform(xf1, xf2,..., { error: (e) => { ... } });

// or, also new, provide everything as single options object
// (for this version, see note (1) below)
src.transform({ xform: map(...), error: handleError });
```

3. The `.subscribe(sub, xform, opts)` signature has been removed and the `xform`
   (transducer) must now be given as part of the options object:

```ts
import { reactive, trace } from "@thi.ng/rstream";
import { filter } from "@thi.ng/transducers";

const src = reactive(1);

// old
src.subscribe(trace("foo"), filter((x) => x < 10), { id: "child-sub" });

// new, see note (1) below
src.subscribe(trace("foo"), { xform: filter((x) => x < 10), id: "child-sub" });
```

4. Added generics for [PubSub](#topic-based-splitting) topics, added
   `.transformTopic()` and updated signatures for `.subscribeTopic()`, both in
   similarity to above.

```ts
import { pubsub } from "@thi.ng/rstream";
import { map } from "@thi.ng/transducers";

type Event = { id: string; value: any; };

const src = pubsub<Event>({ topic: (e) => e.id });

// transform topic stream with given transducer (see note (1) below)
// and forward any errors to `handleError` (user defined fn)
src.transformTopic("foo", map((e) => e.value), { error: handleError })
```

**Notes:**

- (1): If using multiple transducers, they must be pre-composed with
  [`comp()`](https://docs.thi.ng/umbrella/transducers/functions/comp.html).
  Other signatures of `.transform()` method support up to 4 transducers and
  composes them automatically.

{{repo.supportPackages}}

{{repo.relatedPackages}}

{{meta.blogPosts}}

## Installation

{{pkg.install}}

{{pkg.size}}

## Dependencies

{{pkg.deps}}

{{repo.examples}}

## API

{{pkg.docs}}

### Common configuration options

Since version 3.0.0 all stream and subscription factory functions take an
optional object of [common configuration
options](https://docs.thi.ng/umbrella/rstream/interfaces/CommonOpts.html) with
**at least** these keys (each optional):

```ts
interface CommonOpts {
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
```

### Stream creation

#### Stream

Docs: [stream()](https://docs.thi.ng/umbrella/rstream/functions/stream-1.html)

Creates a new `Stream` instance, optionally with given `StreamSource` function
and / or ID. If a `src` function is provided, the function will be only called
(with the `Stream` instance as single argument) once the first subscriber has
attached to the stream. If the function returns another function, it will be
used for cleanup purposes if the stream is cancelled, e.g. if the last
subscriber has unsubscribed. Streams are intended as (primarily async) data
sources in a dataflow graph and are the primary construct for the various
`from*()` functions provided by the package. However, streams can also be
triggered manually (from outside the stream), in which case the user should call
`stream.next()` to cause value propagation.

```ts
import { stream, trace } from "@thi.ng/rstream";

a = stream<number>((s) => {
    s.next(1);
    s.next(2);
    s.done();
});
a.subscribe(trace("a"));
// a 1
// a 2
// a done

// as reactive value mechanism
b = stream<number>();
// or alternatively
// b = subscription();

b.subscribe(trace("b1"));
b.subscribe(trace("b2"));

// external trigger
b.next(42);
// b1 42
// b2 42
```

### IDeref support

`Stream` (like all other types of `Subscription`) implements the [@thi.ng/api
`IDeref`](https://docs.thi.ng/umbrella/api/interfaces/IDeref.html) interface
which provides read access to a stream's last received value. This is useful for
various purposes, e.g. in combination with @thi.ng/hdom, which supports direct
embedding of streams (i.e. their values) into UI components (and will be deref'd
automatically). If the stream has not yet emitted a value or if the stream is
already done, it will deref to `undefined`.

Furthermore, all subscription types can be configured (via the `cache` option)
to NOT retain their last emitted value, in which case `.deref()` will always
return `undefined`.

#### Subscription

Docs: [subscription()](https://docs.thi.ng/umbrella/rstream/functions/subscription-1.html)

Creates a new `Subscription` instance, the fundamental datatype & building block
provided by this package (`Stream`s are `Subscription`s too). Subscriptions can
be:

- linked into directed graphs (if async, not necessarily DAGs)
- transformed using transducers (incl. early termination)
- can have any number of subscribers (optionally each w/ their own transducer)
- recursively unsubscribe themselves from parent after their last subscriber
  unsubscribed
- will go into a non-recoverable error state if NONE of the subscribers has an
  error handler itself
- implement the @thi.ng/api `IDeref` interface

```ts
import { subscription, trace } from "@thi.ng/rstream";
import { filter } from "@thi.ng/transducers";

// as reactive value mechanism (same as with stream() above)
s = subscription<any, any>();
s.subscribe(trace("s1"));
s.subscribe(trace("s2"), filter((x) => x > 25));

// external trigger
s.next(23);
// s1 23
// (s2 doesn't receive value here due to its filter)

s.next(42);
// s2 42
// s1 42
```

#### Other stream creation helpers

- [reactive()](https://docs.thi.ng/umbrella/rstream/functions/reactive.html) - syntax sugar for `stream()` with initial value
- [fromAtom()](https://docs.thi.ng/umbrella/rstream/functions/fromAtom.html) - streams from value changes in atoms/cursors
- [fromChannel()](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream-csp) - CSP channel to stream conversion
- [fromEvent()](https://docs.thi.ng/umbrella/rstream/functions/fromEvent.html) - events
- [fromDOMEvent()](https://docs.thi.ng/umbrella/rstream/functions/fromDOMEvent.html) - DOM events
- [fromInterval()](https://docs.thi.ng/umbrella/rstream/functions/fromInterval.html) - interval based counters
- [fromIterable()](https://docs.thi.ng/umbrella/rstream/functions/fromIterable.html) - arrays, iterators / generators (async & sync)
- [fromNodeJS()](https://docs.thi.ng/umbrella/rstream/functions/fromNodeJS.html) - NodeJS stream adapter
- [linesFromNodeJS()](https://docs.thi.ng/umbrella/rstream/functions/linesFromNodeJS.html) - NodeJS stream adapter
- [fromObject()](https://docs.thi.ng/umbrella/rstream/functions/fromObject.html) - object property streams
- [fromPromise()](https://docs.thi.ng/umbrella/rstream/functions/fromPromise.html) - single value stream from promise
- [fromPromises()](https://docs.thi.ng/umbrella/rstream/functions/fromPromises.html) - results from multiple promise
- [fromRAF()](https://docs.thi.ng/umbrella/rstream/functions/fromRAF.html) - requestAnimationFrame() counter (w/ node fallback)
- [fromView()](https://docs.thi.ng/umbrella/rstream/functions/fromView.html) - derived view value changes (see [@thi.ng/atom](https://github.com/thi-ng/umbrella/tree/develop/packages/atom))
- [fromWorker()](https://docs.thi.ng/umbrella/rstream/functions/fromWorker.html) - messages received from worker
- [toggle()](https://docs.thi.ng/umbrella/rstream/functions/toggle.html) - on/off switch-like stream
- [trigger()](https://docs.thi.ng/umbrella/rstream/functions/trigger.html) - one-off events

### Meta streams

Docs: [metaStream()](https://docs.thi.ng/umbrella/rstream/functions/metaStream-1.html)

`MetaStream`s are streams of streams. A `MetaStream` is a subscription type
which transforms each incoming value into a new stream, subscribes to it (via an
hidden / internal subscription) and then only passes values from that stream to
its own subscribers. If a new value is received, the meta stream first
unsubscribes from the possibly still active stream created from the previous
input, before creating and subscribing to the new stream. Hence this stream type
is useful for cases where streams need to be dynamically and invisibly created &
inserted into an existing dataflow topology without changing it, and with the
guarantee that never more than one of these is active at the same time. Similar
behavior (without the restriction in number) can be achieved using `merge()`
(see further below).

The user supplied `factory` function will be called for each incoming value and
is responsible for creating the new stream instances. If the function returns
`null` / `undefined`, no further action will be taken (acts like a `filter`
transducer, i.e. the incoming value is simply ignored).

```ts
import { metastream, fromIterable, trace } from "@thi.ng/rstream";
import { repeat } from "@thi.ng/transducers";

// transform each received odd number into a stream
// producing 3 copies of that number in the metastream
// even numbers are ignored
a = metastream<number, string>(
  (x) => (x & 1)
    ? fromIterable(repeat("odd: " + x, 3), { delay: 100 })
    : null
);

a.subscribe(trace())

a.next(23)
// odd: 23
// odd: 23
// odd: 23

a.next(42) // not odd, ignored by meta factory fn

a.next(43)
// odd: 43
// odd: 43
// odd: 43
```

The factory function does NOT need to create new streams, but too can merely
return other existing streams, and so making the meta stream act like a switch /
stream selector.

If the meta stream is the only subscriber to these input streams, you'll need to
use the `closeOut: "never"` option when creating the inputs. This keeps them
alive and allows for dynamic switching between them.

```ts
import { metastream, fromIterable, trace } from "@thi.ng/rstream";
import { repeat } from "@thi.ng/transducers";

// infinite inputs
a = fromIterable(
  repeat("a"),
  { delay: 1000, closeOut: "never" }
);

b = fromIterable(
  repeat("b"),
  { delay: 1000, closeOut: "never" }
);

// stream selector / switch
m = metaStream((x) => x ? a : b);
m.subscribe(trace("meta from: "));

m.next(true);
// meta from: a

m.next(false);
// meta from: b

m.next(true);
// meta from: a
```

### Stream merging

#### Unordered merge from multiple inputs (dynamic add/remove)

Docs: [merge()](https://docs.thi.ng/umbrella/rstream/functions/merge.html)

![diagram](https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/rstream/rstream-merge.png)

Returns a new `StreamMerge` instance, a subscription type consuming inputs from
multiple inputs and passing received values on to any subscribers. Input streams
can be added and removed dynamically. By default, `StreamMerge` calls `done()`
when the last active input is done, but this behavior can be overridden via the
[`closeIn`
option](https://docs.thi.ng/umbrella/rstream/interfaces/StreamMergeOpts.html#closeIn).

```ts
import { merge, fromIterable, trace } from "@thi.ng/rstream";

merge({
    // input streams w/ different frequencies
    src: [
        fromIterable([1, 2, 3], { delay: 10 }),
        fromIterable([10, 20, 30], { delay: 21 }),
        fromIterable([100, 200, 300], { delay: 7 })
    ]
}).subscribe(trace());
// 100
// 1
// 200
// 10
// 2
// 300
// 3
// 20
// 30
```

Use the [`labeled()`
transducer](https://docs.thi.ng/umbrella/transducers/functions/labeled.html) for
each input to create a stream of labeled values and track their provenance:

```ts
import { merge, fromIterable, trace } from "@thi.ng/rstream";
import { labeled } from "@thi.ng/transducers";

merge({
    src: [
        fromIterable([1, 2, 3]).transform(labeled("a")),
        fromIterable([10, 20, 30]).transform(labeled("b")),
    ]
}).subscribe(trace());
// ["a", 1]
// ["b", 10]
// ["a", 2]
// ["b", 20]
// ["a", 3]
// ["b", 30]
```

See
[StreamMergeOpts](https://docs.thi.ng/umbrella/rstream/interfaces/StreamMergeOpts.html)
for further reference of the various behavior options.

##### Adding inputs automatically

If the `StreamMerge` receives a `Subscription`-like value from any of its
inputs, it will not be processed as usual, but instead will be added as new
input to the merge and then automatically remove once that stream is exhausted.

```ts
import { merge, stream, fromIterable, trace } from "@thi.ng/rstream";
import { repeat } from "@thi.ng/transducers";

// stream source w/ transducer mapping values to new streams
a = stream().map((x) => fromIterable(repeat(x, 3)));
// simple 1Hz counter
b = fromInterval(1000).map((x) => "b" + x);

merge({ src: [a, b] }).subscribe(trace());
// 0
// 1
// 2

// sent "a" will be transformed into stream via above transducer
// and then auto-added as new input to the StreamMerge
a.next("abc");
// abc
// abc
// abc
// 3
// 4
```

#### Synchronized merge and labeled tuple objects

Docs: [sync()](https://docs.thi.ng/umbrella/rstream/functions/sync.html)

![diagram](https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/rstream/rstream-sync.png)

Similar to `StreamMerge` above, but with extra synchronization of inputs. Before
emitting any new values, `StreamSync` collects values until at least one has
been received from _all_ inputs. Once that's the case, the collected values are
sent as labeled tuple object to downstream subscribers. Each value in the
emitted tuple objects is stored under their input stream's ID. Only the last
value received from each input is passed on. After the initial tuple has been
emitted, you can choose from two possible behaviors:

1. Any future change in any input will produce a new result tuple. These tuples
   will retain the most recently read values from other inputs. This behavior is
   the default and illustrated in the above schematic.
2. If the `reset` option is `true`, every input will have to provide at least
   one new value again until another result tuple is produced.

Any done inputs are automatically removed. By default, `StreamSync` calls
`done()` when the last active input is done, but this behavior can be overridden
via the [`closeIn`
option](https://docs.thi.ng/umbrella/rstream/interfaces/StreamMergeOpts.html#closeIn).

```ts
import { sync, stream, trace } from "@thi.ng/rstream";

const a = stream();
const b = stream();
s = sync<any,any>({ src: { a, b } }).subscribe(trace("result: "));
a.next(1);
b.next(2);
// result: { a: 1, b: 2 }
```

Input streams can be added and removed dynamically and the emitted tuple size
adjusts to the current number of inputs (the next time a value is received from
any input).

If the `reset` option is enabled, the last emitted tuple is allowed to be
incomplete, by default. To only allow complete tuples, also set the `all` option
to `false`.

The synchronization is done via the
[`partitionSync()`](https://docs.thi.ng/umbrella/transducers/functions/partitionSync-1.html)
transducer from the
[@thi.ng/transducers](https://github.com/thi-ng/umbrella/tree/develop/packages/transducers)
package. See this function's docs for further details.

See
[StreamSyncOpts](https://docs.thi.ng/umbrella/rstream/interfaces/StreamSyncOpts.html)
for further reference of the various behavior options.

### Stream splitting

#### Topic based splitting

Docs: [pubsub()](https://docs.thi.ng/umbrella/rstream/functions/pubsub-1.html)

![diagram](https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/rstream/rstream-pubsub.png)

Topic based stream splitter. Applies `topic` function to each received value and
only forwards it to child subscriptions for returned topic. The actual topic
(return value from `topic` fn) can be of any type, apart from `undefined`.
Complex topics (e.g objects / arrays) are allowed and they're matched with
registered topics using @thi.ng/equiv by default (but customizable via `equiv`
option). Each topic can have any number of subscribers.

If a transducer is specified for the `PubSub`, it is always applied prior to
passing the input to the topic function. I.e. in this case the topic function
will receive the transformed inputs.

PubSub supports dynamic topic subscriptions and unsubscriptions via
`subscribeTopic()` and `unsubscribeTopic()`. However, **the standard
`subscribe()` / `unsubscribe()` methods are NOT supported** (since meaningless
here) and will throw an error! `unsubscribe()` can only be called WITHOUT
argument to unsubscribe the entire `PubSub` instance (incl. all topic
subscriptions) from the parent stream.

#### Splitting via predicate

Docs: [bisect()](https://docs.thi.ng/umbrella/rstream/functions/bisect.html)

Returns a new `PubSub` instance using given predicate `pred` as boolean topic
function and `a` & `b` as subscribers for truthy (`a`) and falsy `b` values.

```ts
import { bisect, fromIterable, trace } from "@thi.ng/rstream";

fromIterable([1, 2, 3, 4]).subscribe(
    bisect((x) => !!(x & 1), trace("odd"), trace("even"))
);
// odd 1
// even 2
// odd 3
// even 4
// odd done
// even done
```

If `a` or `b` need to be subscribed to directly, then `a` / `b` MUST be first
created as `Subscription` (if not already) and a reference kept prior to calling
`bisect()`.

```ts
import { bisect, fromIterable, subscription, trace } from "@thi.ng/rstream";

const odd = subscription();
const even = subscription();
odd.subscribe(trace("odd"));
odd.subscribe(trace("odd x10"), tx.map((x) => x * 10));
even.subscribe(trace("even"));

fromIterable([1, 2, 3, 4]).subscribe(bisect((x) => !!(x & 1), odd, even));
// odd x10 10
// odd 1
// even 2
// odd x10 30
// odd 3
// even 4
// odd done
// odd x10 done
// even done
```

### Side-chaining

#### Input chunking / buffering, controlled by sidechain

Docs: [sidechainPartition()](https://docs.thi.ng/umbrella/rstream/functions/sidechainPartition-1.html)

![diagram](https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/rstream/rstream-sidechain-partition.png)

Buffers values from `src` until side chain fires, then emits buffer (unless
empty) and repeats process until either input is done. By default, the value
read from the side chain is ignored, however the optional predicate can be used
to only trigger for specific values / conditions.

```ts
import {
	merge, fromEvent, fromRAF,
	sidechainPartition, trace
} from "@thi.ng/rstream";

// queue event processing to only execute during the
// requestAnimationFrame cycle (RAF)
sidechainPartition(
    // merge various event streams
    merge([
        fromEvent(document, "mousemove"),
        fromEvent(document, "mousedown"),
        fromEvent(document, "mouseup")
    ]),
    // sidechain control stream
    fromRAF()
).subscribe(trace());
```

Since v8.0.0 there's
[`syncRAF()`](https://docs.thi.ng/umbrella/rstream/functions/syncRAF-1.html),
which allows the above to be simplified to:

```ts
import { merge, fromEvent, syncRAF, trace } from "@thi.ng/rstream";

syncRAF(
    merge([
        fromEvent(document, "mousemove"),
        fromEvent(document, "mousedown"),
        fromEvent(document, "mouseup")
    ])
).subscribe(trace());
```

#### Input toggling, controlled by sidechain

Docs: [sidechainToggle()](https://docs.thi.ng/umbrella/rstream/functions/sidechainToggle-1.html)

![diagram](https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/rstream/rstream-sidechain-toggle.png)

Filters values from input based on values received from side chain. By default,
the value read from the side chain is ignored, however the optional predicate
can be used to only trigger for specific values/conditions. Every time the
predicate fn returns true, the filter will be toggled on/off. Whilst switched
off, no input values will be forwarded.

```ts
import { sidechainToggle, fromInterval, trace } from "@thi.ng/rstream";

// use slower interval stream to toggle faster main stream on/off
sidechainToggle(fromInterval(500), fromInterval(1000)).subscribe(trace());
// 0
// 3
// 4
// 7
// 8
...
```

#### Input passthrough, controlled by sidechain

Docs: [sidechainTrigger()](https://docs.thi.ng/umbrella/rstream/functions/sidechainTrigger-1.html)

Buffers the most recent value received and only forwards it downstream whenever
a new control value is received from the sidechain.

```ts
import { sidechainTrigger, reactive, stream, trace } from "@thi.ng/rstream";

const src = reactive("payload");

const side = stream();

sidechainTrigger(src, side).subscribe(trace("data:"));

side.next(1);
// data: payload

// every time sidechain triggers
side.next(1);
// data: payload

// only newest value will be buffered
src.next("update #1");
src.next("update #2");

// ...until side chain triggers again
side.next(1);
// data: update #2
```

### Worker support

#### Parallel stream processing via workers

Docs: [forkJoin()](https://docs.thi.ng/umbrella/rstream/functions/forkJoin.html)

![diagram](https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/rstream/rstream-forkjoin.png)

##### worker.ts

```ts
const $self: Worker = <any>self;
self.addEventListener("message", (e) => {
    const { buf, factor } = e.data;
    $self.postMessage(buf.map((x) => x * factor));
});
```

##### main.ts

```ts
import { forkJoin, trace } from "@thi.ng/rstream";

const src = stream<number[]>();

// fork worker jobs & re-join results
forkJoin({
    src: src,
    // worker job preparation
    // this function is called for each worker ID and the results
    // of that function are the messages sent to the workers...
    fork: (id, numWorkers, buf) => {
        const size = (buf.length / numWorkers) | 0;
        return {
            buf: id < numWorkers - 1
                    ? buf.slice(id * size, (id + 1) * size)
                    : buf.slice(id * size),
            factor: id * 10
        };
    },
    // re-join worker results
    join: (parts) => <number[]>Array.prototype.concat.apply([], parts),
    // worker script
    worker: "./worker.js",
    // default: navigator.hardwareConcurrency
    numWorkers: 4
}).subscribe(trace("results"));

src.next(new Array(16).fill(1));

// result: [0, 0, 0, 0, 10, 10, 10, 10, 20, 20, 20, 20, 30, 30, 30, 30]
```

#### Stream processing via workers

Docs: [tunnel()](https://docs.thi.ng/umbrella/rstream/functions/tunnel-1.html)

Delegate stream value processing to workers and pass on their responses to
downstream subscriptions. Supports multiple worker instances and worker
termination / restart for each new stream value received.

Docs: [postWorker()](https://docs.thi.ng/umbrella/rstream/functions/postWorker.html)

Send values to workers (incl. optional (inline) worker instantiation)

Docs: [fromWorker()](https://docs.thi.ng/umbrella/rstream/functions/fromWorker.html)

Create value stream from worker messages.

### Other subscription ops

- [debounce](https://docs.thi.ng/umbrella/rstream/functions/debounce.html): ignore high frequency interim values
- [resolve](https://docs.thi.ng/umbrella/rstream/functions/resolve.html): resolve on-stream promises
- [trace](https://docs.thi.ng/umbrella/rstream/functions/trace.html): debug helper
- [transduce](https://docs.thi.ng/umbrella/rstream/functions/transduce.html): transduce or just reduce an entire stream into a promise
- [tween](https://docs.thi.ng/umbrella/rstream/functions/tween.html): stream interpolation

### Error handling

**Detailed information, discussion & diagrams about the new error handling can
be found in [this issue](https://github.com/thi-ng/umbrella/issues/281)**

The `ISubscriber` interface supports optional error handlers which will be
called if code in the `next()` or `done()` handlers throws an error. If no error
handler is defined for a subscriber, the wrapping `Subscription`'s own error
handler will be called, which _might_ put this subscription into an error state
and stop it from receiving new values.

```ts
import { subscription, State } from "@thi.ng/rstream";

src = subscription({ next(x) { throw x; } });

// triggers error, caught by subscription wrapper
src.next(1);
// sub-0 unhandled error: 1

src.getState() === State.ERROR
// true

// no error, but also inputs won't be received/processed either
src.next(2)

// another sub with error handler & indicating error could be handled
src = subscription({
  next(x) { throw x; },
  error(x) { console.warn("eeek", x);  return true; }
});

// error caught by given handler
src.next(1)
// eeek 1

// sub still usable, no error
src.getState() !== State.ERROR
// true

// further inputs still accepted
src.next(2)
// eeek 2
```

<!-- include ../../assets/tpl/footer.md -->
