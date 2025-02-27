// SPDX-License-Identifier: Apache-2.0
import type { Fn, IObjectOf, Path } from "@thi.ng/api";
import type { IView } from "@thi.ng/atom";
import type {
	EffectDef,
	EventBus,
	EventDef,
	InterceptorContext,
} from "@thi.ng/interceptors";
import type { QuerySpec, TripleStore } from "@thi.ng/rstream-query";

/**
 * Function signature for main app components.
 */
export type AppComponent = (ctx: AppContext, ...args: any[]) => any;

/**
 * Derived view configurations.
 */
export type ViewSpec = string | Path | [string | Path, Fn<any, any>];

/**
 * Structure of the overall application config object.
 * See `src/config.ts`.
 */
export interface AppConfig {
	events: IObjectOf<EventDef>;
	effects: IObjectOf<EffectDef>;
	domRoot: string | Element;
	initialState: any;
	rootComponent: AppComponent;
	ui: UIAttribs;
	views: Partial<Record<AppViewIDs, ViewSpec>>;
	data: {
		cities: string[][];
		countries: string[][];
		regions: string[];
		queries: IObjectOf<QuerySpec>;
	};
}

export type AppViewIDs =
	| "page"
	| "pagedTriples"
	| "cities"
	| "countries"
	| "sort";

/**
 * Base structure of derived views exposed by the base app.
 * Add more declarations here as needed.
 */
export interface AppViews extends Record<AppViewIDs, IView<any>> {
	page: IView<number>;
	pagedTriples: IView<any>;
	cities: IView<any>;
	countries: IView<any>;
	sort: IView<[number, boolean]>;
}

/**
 * Helper interface to pre-declare keys of shared UI attributes for
 * components and so enable autocomplete & type safety.
 *
 * See `AppConfig` above and its use in `src/config.ts` and various
 * component functions.
 */
export interface UIAttribs {
	button: any;
	buttonDisabled: any;
	buttongroup: any;
	link: any;
	root: any;
	table: { root: any; head: any; headlink: any; row: any; cell: any };
	pager: { root: any; prev: any; pages: any; next: any };
}

/**
 * Structure of the context object passed to all component functions
 */
export interface AppContext {
	bus: EventBus;
	views: AppViews;
	ui: UIAttribs;
	store: TripleStore;
}

export interface AppInterceptorContext extends InterceptorContext {
	store: TripleStore;
}
