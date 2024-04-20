<!-- include ../../assets/tpl/header.md -->

<!-- toc -->

## About

{{pkg.description}}

### From hdom to rdom: Reactive UIs without virtual DOMs

In many ways this package is the direct successor of
[@thi.ng/hdom](https://github.com/thi-ng/umbrella/tree/develop/packages/hdom),
which for several years was my preferred way of building UIs. _hdom_ eschewed
using a virtual DOM to represent and maintain a dynamic tree of (UI) components
and instead only required a previous and current component tree in
[@thi.ng/hiccup](https://github.com/thi-ng/umbrella/tree/develop/packages/hiccup)
format (aka nested, plain JS arrays w/ optional support for embedded other JS
data types, like ES6 iterables, [@thi.ng/api
interfaces](https://github.com/thi-ng/umbrella/tree/develop/packages/api), etc.)
to perform its UI updates. Yet, whilst hiccup trees are plain, simple, user
defined data structures, which can be very easily composed without any
libraries, _hdom_ itself was still heavily influenced by the general vDOM
approach and therefore a centralized update cycle and computing differences
between the trees were necessary ~~evils~~ core tasks. In short, _hdom_ allowed
the illusion of declarative components with reactive state updates, but had to
use a complex and recursive diff to realize those updates.

**In contrast, _@thi.ng/rdom_ directly supports embedding reactive
values/components in the hiccup tree and compiles them in such a way that their
value changes directly target underlying DOM nodes without having to resort to
any other intermediate processing (no diffing, vDOM updates etc.).
_@thi.ng/rdom_ is entirely vDOM-free. It supports declarative component
definitions via
[@thi.ng/hiccup](https://github.com/thi-ng/umbrella/tree/develop/packages/hiccup),
[@thi.ng/rstream](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream),
ES6 classes, direct DOM manipulation (incl. provided helpers) and/or any mixture
of these approaches.**

### Targetted, isolated updates

If a reactive value is used for an element attribute, a value change will
trigger an update of only that attribute (there's special handling for event
listeners, CSS classes, data attributes and `style` attribs). If a reactive
value is used as (text) body of an element (or an element/component itself),
only that body/subtree in the target DOM will be impacted/updated directly...

The package provides an interface
[`IComponent`](https://docs.thi.ng/umbrella/rdom/interfaces/IComponent.html)
(with a super simple life cycle API), a base component class
[`Component`](https://docs.thi.ng/umbrella/rdom/classes/Component.html) for
stubbing and a number of fundamental control constructs & component-wrappers for
composing more complex components and to reduce boilerplate for various
situations. Whilst targetting a standard JS DOM by default, each component can
decide for itself what kind of target data structure (apart from a browser DOM)
it manages. _rdom_ components themselves have **no mandatory** knowledge of a
browser DOM. As an example, similar to
[@thi.ng/hdom-canvas](https://github.com/thi-ng/umbrella/tree/develop/packages/hiccup-canvas),
the
[@thi.ng/rdom-canvas](https://github.com/thi-ng/umbrella/tree/develop/packages/rdom-canvas)
wrapper provides a component which subscribes to a stream of hiccup-based scene
descriptions (trees) and then translates each scene-value into HTML Canvas API
draw calls.

### Async updates & life cycle methods

Since there's no central coordination in _rdom_ (neither explicitly nor
implicitly), each component can (and does) update whenever its state value has
changed. Likewise, components are free to directly manipulate the DOM through
other means, as hinted at earlier.

The [`IComponent`](https://docs.thi.ng/umbrella/rdom/interfaces/icomponent.html)
interface is at the heart of _rdom_. It defines three lifecycle methods to:
`.mount()`, `.unmount()` and `.update()` a component. The first two are always
`async` to allow for more complex component initialization procedures (e.g.
preloaders, WASM init, other async ops...). Several of the higher-order
controller components/constructs too demand `async` functions for the same
reasons.

Because _rdom_ itself relies for most reactive features, stream composition and
reactive value transformations on other packages, i.e.
[@thi.ng/rstream](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream),
[@thi.ng/transducers-async](https://github.com/thi-ng/umbrella/tree/develop/packages/transducers-async)
and
[@thi.ng/transducers](https://github.com/thi-ng/umbrella/tree/develop/packages/transducers),
please consult the docs for these packages to learn more about the available
constructs and patterns. Most of _rdom_ only deals with either subscribing to
reactive values, async iterables and/or wrapping/transforming existing
subscriptions, either explicitly using the provided control components (e.g.
[`$async()`](https://docs.thi.ng/umbrella/rdom/functions/_async.html)),
[`$sub()`](https://docs.thi.ng/umbrella/rdom/functions/_sub.html), or using
[`$compile()`](https://docs.thi.ng/umbrella/rdom/functions/_compile.html) to
auto-wrap such values embedded in an hiccup tree.

### @thi.ng/atom integration

For the sake of deduplication of functionality and to keep the number of
dependencies to a minimum, direct
[@thi.ng/atom](https://github.com/thi-ng/umbrella/tree/develop/packages/atom)
integration has been removed in favor of using relevant
[@thi.ng/rstream](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream)
constructs, which can be used as lightweight adapters, i.e.:

- [`fromAtom()`](https://docs.thi.ng/umbrella/rstream/functions/fromAtom.html)
- [`fromObject()`](https://docs.thi.ng/umbrella/rstream/functions/fromObject.html)
- [`fromView()`](https://docs.thi.ng/umbrella/rstream/functions/fromView.html)

## DOM creation & mutation

The package provides many functions to simplify the creation of individual or
entire trees of DOM elements and to manipulate them at a later time. The single
most important function of the package is
[$compile](https://docs.thi.ng/umbrella/rdom/functions/_compile.html). It acts
as a facade for many of these other functions and creates an actual DOM from a
given hiccup component tree. It also automatically wraps any reactive values
contained therein.

**All of the following functions are also usable, even if you don't intend to
use any other package features!**

- [$addChild](https://docs.thi.ng/umbrella/rdom/functions/_addChild.html)
- [$attribs](https://docs.thi.ng/umbrella/rdom/functions/_attribs.html)
- [$clear](https://docs.thi.ng/umbrella/rdom/functions/_clear.html)
- [$comment](https://docs.thi.ng/umbrella/rdom/functions/_comment.html)
- [$el](https://docs.thi.ng/umbrella/rdom/functions/_el.html)
- [$html](https://docs.thi.ng/umbrella/rdom/functions/_html.html)
- [$moveTo](https://docs.thi.ng/umbrella/rdom/functions/_moveTo.html)
- [$remove](https://docs.thi.ng/umbrella/rdom/functions/_remove.html)
- [$style](https://docs.thi.ng/umbrella/rdom/functions/_style.html)
- [$text](https://docs.thi.ng/umbrella/rdom/functions/_text.html)
- [$tree](https://docs.thi.ng/umbrella/rdom/functions/_tree.html)

## Control structures

For more advanced usage, rdom provides a range of control structures (container
components) to simplify the handling of reactive states and reduce boilerplate
for the implementation of common UI structures (e.g. item lists of any kind).

The following links lead to the documentation of these wrappers, incl. small
code examples:

- [$async](https://docs.thi.ng/umbrella/rdom/functions/_async.html)
- [$klist](https://docs.thi.ng/umbrella/rdom/functions/_klist.html)
- [$list](https://docs.thi.ng/umbrella/rdom/functions/_list.html)
- [$lazy](https://docs.thi.ng/umbrella/rdom/functions/_lazy.html)
- [$object](https://docs.thi.ng/umbrella/rdom/functions/_object-1.html)
- [$promise](https://docs.thi.ng/umbrella/rdom/functions/_promise-1.html)
- [$refresh](https://docs.thi.ng/umbrella/rdom/functions/_refresh.html)
- [$replace](https://docs.thi.ng/umbrella/rdom/functions/_replace.html)
- [$sub](https://docs.thi.ng/umbrella/rdom/functions/_sub-1.html)
- [$subObject](https://docs.thi.ng/umbrella/rdom/functions/_subObject.html)
- [$switch](https://docs.thi.ng/umbrella/rdom/functions/_switch.html)
- [$wrapEl](https://docs.thi.ng/umbrella/rdom/functions/_wrapEl.html)
- [$wrapHtml](https://docs.thi.ng/umbrella/rdom/functions/_wrapHtml.html)
- [$wrapText](https://docs.thi.ng/umbrella/rdom/functions/_wrapText.html)

### Event handlers for reactive streams

Currently, reactive rdom components are based on
[@thi.ng/rstream](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream)
subscriptions. To create a feedback loop between those reactive state values and
their subscribed UI components, input event handlers need to feed any user
changes back to those reactive state(s). To reduce boilerplate for these tasks,
the following higher order input event handlers are provided:

- [$input](https://docs.thi.ng/umbrella/rdom/functions/_input.html)
- [$inputCheckbox](https://docs.thi.ng/umbrella/rdom/functions/_inputCheckbox.html)
- [$inputFile](https://docs.thi.ng/umbrella/rdom/functions/_inputFile.html)
- [$inputFiles](https://docs.thi.ng/umbrella/rdom/functions/_inputFiles.html)
- [$inputNum](https://docs.thi.ng/umbrella/rdom/functions/_inputNum.html)
- [$inputTrigger](https://docs.thi.ng/umbrella/rdom/functions/_inputTrigger.html)

```ts
import { $compile, $input } from "@thi.ng/rdom";
import { reactive, trace } from "@thi.ng/rstream";

// reactive value/state w/ transformation
const name = reactive("").map((x) => x.toUpperCase());

// reactive text field for `name`
$compile(["input", {
	type: "text",
	// any value changes are fed back into `name`, which in return
	// triggers an update of this (and any other) subscription
	oninput: $input(name),
	value: name
}]).mount(document.body);

// addtional subscription for debug console output
name.subscribe(trace("name:"));
```

Click counter using [thi.ng/rstream](https://github.com/thi-ng/umbrella/tree/develop/packages/rstream) and
[thi.ng/transducers](https://github.com/thi-ng/umbrella/tree/develop/packages/transducers):

```ts
import { $compile, $inputTrigger } from "@thi.ng/rdom";
import { reactive } from "@thi.ng/rstream";
import { count, scan } from "@thi.ng/transducers";

// reactive value/stream setup
const clicks = reactive(true);

// button component with reactive label showing click count
$compile([
	"button",
	// $inputTrigger merely emits `true` onto the given reactive stream
	{ onclick: $inputTrigger(clicks) },
	"clicks: ",
	// using transducers to transform click stream into a counter
	clicks.transform(scan(count(-1))),
]).mount(document.body);
```

### Embedding async iterables

Work is underway to better support [built-in
AsyncIterables](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_async_iterator_and_async_iterable_protocols)
(possibly entirely in-lieu of rstream constructs). Currently, they can only be directly used for simple text or attribute values (also see the [rdom-async example](https://github.com/thi-ng/umbrella/blob/develop/examples/rdom-async)):

```ts
import { $compile } from "@thi.ng/rdom";
import { range, source } from "@thi.ng/transducers-async";

// infinite 1Hz counter
const counter = range(1000);

// manually updated click counter (also an async iterable)
const clicks = source(0);

// event handler to update click count
const updateClicks = () => clicks.update((x)=> x + 1);

// compile DOM with embedded async iterables
$compile(
	["div", {},
		["div", {}, "counter: ", counter],
		["button", { onclick: updateClicks }, "clicks: ", clicks]
	]
).mount(document.body)
```

{{meta.status}}

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

TODO

Currently, documentation only exists in the form of small examples and various
doc strings (incomplete). I'm working to alleviate this situation ASAP... In
that respect, PRs are welcome as well!

### Basic usage

```ts
import { $compile } from "@thi.ng/rdom";
import { reactive } from "@thi.ng/rstream";
import { cycle, map } from "@thi.ng/transducers";

// reactive value
const bg = reactive("gray");

// color options (infinite iterable)
const colors = cycle(["magenta", "yellow", "cyan"]);

// event handler
const nextColor = () => bg.next(<string>colors.next().value);

// define component tree in hiccup syntax, compile & mount component.
// each time `bg` value changes, only subscribed bits will be updated
// i.e. title, the button's `style.background` and its label

// Note: instead of direct hiccup syntax, you could also use the
// element functions provided by https://thi.ng/hiccup-html
$compile([
    "div",
    {},
    // transformed color as title (aka derived view)
    ["h1", {}, bg.map((col) => `Hello, ${col}!`)],
    [
        // tag with Emmet-style ID & classes
        "button#foo.w4.pa3.bn",
        {
            // reactive CSS background property
            style: { background: bg },
            onclick: nextColor,
        },
        // reactive button label
        bg,
    ],
]).mount(document.body);
```

### Lists

See [`$list`](https://docs.thi.ng/umbrella/rdom/functions/_list.html) and
[`$klist`](https://docs.thi.ng/umbrella/rdom/functions/_klist.html) docs for
further information...

```ts
import { $klist } from "@thi.ng/rdom";
import { reactive } from "@thi.ng/rstream";

const items = reactive([
	{ id: "a", val: 1 },
	{ id: "b", val: 2 },
	{ id: "c", val: 3 },
]);

$klist(
	// reactive data source (any rstream subscribable)
	items,
	// outer list element & attribs
	"ul",
	{ class: "list red" },
	// list item component constructor
	(x) => ["li", {}, x.id, ` (${x.val})`],
	// key function (includes)
	(x) => `${x.id}-${x.val}`
).mount(document.body);

// update list:
// - item a will be removed
// - item b is unchanged
// - item d will be newly inserted
// - item c will be updated (due to new value)
setTimeout(
	() => {
		items.next([
			{ id: "b", val: 2 },
			{ id: "d", val: 4 },
			{ id: "c", val: 30 },
		]);
	},
	1000
);
```

<!-- include ../../assets/tpl/footer.md -->
