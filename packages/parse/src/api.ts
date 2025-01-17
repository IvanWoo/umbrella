import type { Fn, Fn0, IDeref, IObjectOf, Maybe, Nullable } from "@thi.ng/api";
import type { ParseContext, ParseScope, ParseState } from "./context.js";

export interface IReader<T> {
	/**
	 * Returns the char/value at the current read position. No bounds checking
	 * done, assumes reader is not yet {@link IReader.isDone}.
	 *
	 * @param state
	 */
	read(state: ParseState<T>): T;
	/**
	 * Returns the char/value at the previous read position (if any).
	 *
	 * @param state
	 */
	prev(state: ParseState<T>): Maybe<T>;
	/**
	 * Updates the reader's read position.
	 *
	 * @param state
	 */
	next(state: ParseState<T>): void;
	/**
	 * Returns true if the reader already consumed all chars/values.
	 *
	 * @param state
	 */
	isDone(state: ParseState<T>): boolean;
	/**
	 * Returns a string formatted version of the reader's position.
	 *
	 * @param state
	 */
	format(state: ParseState<T>): string;
}

export type Parser<T> = Fn<ParseContext<T>, boolean>;

export type LitParser<T> = Parser<T> & { __lit: true };

/**
 * A {@link Parser} wrapper, whose actual implementation can (and must!) be
 * defined dynamically via the exposed `.set()` function and which can be
 * retrieved via `.deref()`.
 */
export type DynamicParser<T> = Parser<T> &
	IDeref<Maybe<Parser<T>>> & {
		set: Fn<Parser<T>, void>;
	};

export type PassValue<T> = T | Fn0<T>;

export type CharSet = IObjectOf<boolean>;

export type ScopeTransform<T> = (
	scope: Nullable<ParseScope<T>>,
	ctx: ParseContext<T>,
	user?: any
) => Nullable<ParseScope<T>>;

export interface GrammarOpts {
	/**
	 * If true, prints AST and verbose compiler output.
	 *
	 * @defaultValue false
	 */
	debug: boolean;
	/**
	 * CURRENTLY UNUSED. If true will apply AST optimizations prior to
	 * compilation.
	 *
	 * @defaultValue true
	 */
	optimize: boolean;
}

export type Rules = IObjectOf<Parser<string>>;

export type RuleTransforms = IObjectOf<ScopeTransform<string>>;

export interface Language {
	grammar: ParseContext<string>;
	env: RuleTransforms;
	rules: Rules;
}

export interface ContextOpts {
	/**
	 * Max recursion depth failsafe. Parsing will terminate once this limit is
	 * reached.
	 *
	 * @defaultValue 64
	 */
	maxDepth: number;
	/**
	 * True to enable parser debug output. Will emit details of each
	 * parse scope.
	 *
	 * @defaultValue false
	 */
	debug: boolean;
	/**
	 * True to retain reader state for each AST node. State of root node
	 * is always available.
	 *
	 * @defaultValue false
	 */
	retain: boolean;
}
