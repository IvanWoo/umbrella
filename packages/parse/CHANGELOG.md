# Change Log

- **Last updated**: 2025-01-21T11:16:50Z
- **Generator**: [thi.ng/monopub](https://thi.ng/monopub)

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org/) for commit guidelines.

**Note:** Unlisted _patch_ versions only involve non-code or otherwise excluded changes
and/or version bumps of transitive dependencies.

## [2.6.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/parse@2.6.0) (2025-01-21)

#### 🚀 Features

- expose more built-in grammar presets ([6e5a057](https://github.com/thi-ng/umbrella/commit/6e5a057))
  - expose as new builtins:
    - `BINARY_UINT`
    - `HEX_UINT`
    - `SPACE`
    - `UINT`

#### ⏱ Performance improvements

- optimize char selection grammar compilation ([0476baa](https://github.com/thi-ng/umbrella/commit/0476baa))
  - check if char selection only contains characters (no ranges)
  - if so, compile using `oneOf()` instead of `alt()` (avoiding extra level of iteration)
- update grammar rule compilation ([8341af6](https://github.com/thi-ng/umbrella/commit/8341af6))
  - avoid `dynamic()` wrapper for grammar rules which don't require it (to avoid extraneous indirection)

## [2.5.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/parse@2.5.0) (2025-01-17)

#### 🚀 Features

- update `DynamicParser`, add `IDeref` support ([cf0d51c](https://github.com/thi-ng/umbrella/commit/cf0d51c))

#### ♻️ Refactoring

- remove `ParseState.last`, update `IReader` & impls ([20fc5cf](https://github.com/thi-ng/umbrella/commit/20fc5cf))
  - remove `ParseState.last` to lower RAM usage
  - add `IReader.prev()` to obtain previous char, add docs
  - update reader impls
  - update anchor parsers
  - update tests
- minor internal updates ([ef97aee](https://github.com/thi-ng/umbrella/commit/ef97aee))
  - update `ParseContext.start()`
  - update `check()` combinator impl

### [2.4.64](https://github.com/thi-ng/umbrella/tree/@thi.ng/parse@2.4.64) (2025-01-14)

#### ♻️ Refactoring

- various minor updates ([42ce3f6](https://github.com/thi-ng/umbrella/commit/42ce3f6))

### [2.4.52](https://github.com/thi-ng/umbrella/tree/@thi.ng/parse@2.4.52) (2024-08-29)

#### ⏱ Performance improvements

- update ParseState & ParseScope handling (result: 1.2-1.6x faster) ([c94b5cf](https://github.com/thi-ng/umbrella/commit/c94b5cf))
  - refactor ParseState/Scope as data classes (keep same structure)
  - minor update scope transforms
  - update tests

### [2.4.43](https://github.com/thi-ng/umbrella/tree/@thi.ng/parse@2.4.43) (2024-06-21)

#### ♻️ Refactoring

- rename various rest args to be more semantically meaningful ([8088a56](https://github.com/thi-ng/umbrella/commit/8088a56))
- enforce uniform naming convention of internal functions ([56992b2](https://github.com/thi-ng/umbrella/commit/56992b2))

### [2.4.5](https://github.com/thi-ng/umbrella/tree/@thi.ng/parse@2.4.5) (2023-11-09)

#### ♻️ Refactoring

- update all tests (packages A-S) ([e3085e4](https://github.com/thi-ng/umbrella/commit/e3085e4))

## [2.4.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/parse@2.4.0) (2023-09-19)

#### 🚀 Features

- add ParseContext.peakDepth, update recursion limit ([0a2b7db](https://github.com/thi-ng/umbrella/commit/0a2b7db))

## [2.3.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/parse@2.3.0) (2023-09-06)

#### 🚀 Features

- add altS() combinator ([52c76ca](https://github.com/thi-ng/umbrella/commit/52c76ca))

## [2.2.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/parse@2.2.0) (2022-06-15)

#### 🚀 Features

- add new transformers (json, numbers) ([2087131](https://github.com/thi-ng/umbrella/commit/2087131))
  - add xfJson(), json() transform
  - add int(), hexInt(), float() transform syntax sugar
  - add `json` as built-in tx for grammar

### [2.1.8](https://github.com/thi-ng/umbrella/tree/@thi.ng/parse@2.1.8) (2022-06-09)

#### ♻️ Refactoring

- various (minor) TS4.7 related updates/fixes ([9d9ecae](https://github.com/thi-ng/umbrella/commit/9d9ecae))

### [2.1.5](https://github.com/thi-ng/umbrella/tree/@thi.ng/parse@2.1.5) (2022-03-11)

#### ♻️ Refactoring

- add type hint (TS4.6) ([6cd42e8](https://github.com/thi-ng/umbrella/commit/6cd42e8))

## [2.1.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/parse@2.1.0) (2021-11-17)

#### 🚀 Features

- Using workspaces for local tools ([bf7a404](https://github.com/thi-ng/umbrella/commit/bf7a404))
  Improving the overall build ergonomics
  - introduced a tools workspaces
  - imported it in all needed packages/examples
  - inclusive project root

#### ♻️ Refactoring

- testrunner to binary ([4ebbbb2](https://github.com/thi-ng/umbrella/commit/4ebbbb2))
  this commit reverts (partly) changes made in:
  ef346d7a8753590dc9094108a3d861a8dbd5dd2c
  overall purpose is better testament ergonomics:
  instead of having to pass NODE_OPTIONS with every invocation
  having a binary to handle this for us.

### [2.0.1](https://github.com/thi-ng/umbrella/tree/@thi.ng/parse@2.0.1) (2021-10-13)

#### ♻️ Refactoring

- update imports in all pkgs ([5fa2b6f](https://github.com/thi-ng/umbrella/commit/5fa2b6f))
  - add .js suffix for all relative imports
- update imports in all tests/pkgs ([effd591](https://github.com/thi-ng/umbrella/commit/effd591))

# [2.0.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/parse@2.0.0) (2021-10-12)

#### 🛑 Breaking changes

- major update of ALL pkgs (export maps, ESM only) ([0d1d6ea](https://github.com/thi-ng/umbrella/commit/0d1d6ea))
- BREAKING CHANGE: discontinue CommonJS & UMD versions
  - only ESM modules will be published from now on
  - CJS obsolete due to ESM support in recent versions of node:
    - i.e. launch NodeJS via:
    - `node --experimental-specifier-resolution=node --experimental-repl-await`
    - in the node REPL use `await import(...)` instead of `require()`
  - UMD obsolete due to widespread browser support for ESM
  Also:
  - normalize/restructure/reorg all package.json files
  - cleanup all build scripts, remove obsolete
  - switch from mocha to [@thi.ng/testament](https://github.com/thi-ng/umbrella/tree/main/packages/testament) for all tests

#### ♻️ Refactoring

- update all tests in _all_ pkgs ([8b582bc](https://github.com/thi-ng/umbrella/commit/8b582bc))
  - update all to use [@thi.ng/testament](https://github.com/thi-ng/umbrella/tree/main/packages/testament)
- update imports ([138571a](https://github.com/thi-ng/umbrella/commit/138571a))
- update deps & imports in various pkgs ([e1cf29e](https://github.com/thi-ng/umbrella/commit/e1cf29e))
  - largely related to recent updates/restructuring of these packages:
    - api
    - defmulti
    - errors
    - logger
- update defmulti impls ([0303769](https://github.com/thi-ng/umbrella/commit/0303769))

### [0.9.7](https://github.com/thi-ng/umbrella/tree/@thi.ng/parse@0.9.7) (2020-12-07)

#### ♻️ Refactoring

- update type-only imports ([85874bc](https://github.com/thi-ng/umbrella/commit/85874bc))

### [0.9.4](https://github.com/thi-ng/umbrella/tree/@thi.ng/parse@0.9.4) (2020-09-22)

#### ♻️ Refactoring

- update ESC parse preset ([ec94064](https://github.com/thi-ng/umbrella/commit/ec94064))
  - re-use ESCAPES LUT from strings pkgs

### [0.9.3](https://github.com/thi-ng/umbrella/tree/@thi.ng/parse@0.9.3) (2020-09-13)

#### ♻️ Refactoring

- update imports ([b600b00](https://github.com/thi-ng/umbrella/commit/b600b00))

## [0.9.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/parse@0.9.0) (2020-08-17)

#### 🚀 Features

- add replace/xfReplace() xform ([7291181](https://github.com/thi-ng/umbrella/commit/7291181))
- enable replacement rule transforms ([ca22432](https://github.com/thi-ng/umbrella/commit/ca22432))
  - allow strings as rule transform in grammar

## [0.8.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/parse@0.8.0) (2020-07-19)

#### 🚀 Features

- add nest()/xfNest() transform ([af9c97b](https://github.com/thi-ng/umbrella/commit/af9c97b))
- update grammar (xform rule refs) ([22188a4](https://github.com/thi-ng/umbrella/commit/22188a4))
  - allow other parse rules as rule xform (via `xfNest()`)
  - add tests
- update repeat grammar ([7aae9ac](https://github.com/thi-ng/umbrella/commit/7aae9ac))
  - support specifying min repeat count only (max: infinity), e.g. `{3,}`

### [0.7.2](https://github.com/thi-ng/umbrella/tree/@thi.ng/parse@0.7.2) (2020-07-18)

#### 🩹 Bug fixes

- export ContextOpts, move to api.ts ([2dfc445](https://github.com/thi-ng/umbrella/commit/2dfc445))

### [0.7.1](https://github.com/thi-ng/umbrella/tree/@thi.ng/parse@0.7.1) (2020-07-17)

#### ⏱ Performance improvements

- update grammar, use discarding parsers where possible ([d269a8a](https://github.com/thi-ng/umbrella/commit/d269a8a))
  - update compile() impls w/ CompileFlags and use `D` versions if poss
  - refactor/add compileRD(), compileRDL() helpers
  - expose DNL preset rule in defGrammar()
  - add alwaysD()
  - add tests

## [0.7.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/parse@0.7.0) (2020-07-08)

#### 🚀 Features

- add lookahead() combinator, add tests ([ee35038](https://github.com/thi-ng/umbrella/commit/ee35038))
- update lookahead ([51a8dc5](https://github.com/thi-ng/umbrella/commit/51a8dc5))
  - add pass flag and only succeed if main parser passed at least once
- update grammar DSL ([accacf9](https://github.com/thi-ng/umbrella/commit/accacf9))
  - add `.` catch-all term
  - add `(?=...)` suffix form for lookahead
  - update TERM/TERM_BODY
- lookahead w/ configurable capture ([542c066](https://github.com/thi-ng/umbrella/commit/542c066))
- update/fix grammar DSL, add trim ([f82ba1f](https://github.com/thi-ng/umbrella/commit/f82ba1f))
  - update lookahead (cap, non-cap versions)
  - add lookahead for alt terms
  - update `compileLookahead()`
  - add line comment support
  - fix `{n}` repeat modifier handling
  - add `trim()`/`xfTrim()` xforms
- turn xfPrint() into HOF xform ([d86fa53](https://github.com/thi-ng/umbrella/commit/d86fa53))
  - add opt support for custom print fns (other than console)

## [0.6.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/parse@0.6.0) (2020-06-28)

#### 🚀 Features

- add `!` discard modifier to grammar ([456efdc](https://github.com/thi-ng/umbrella/commit/456efdc))
- add count/xfCount transform ([056ae08](https://github.com/thi-ng/umbrella/commit/056ae08))

## [0.5.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/parse@0.5.0) (2020-04-23)

#### 🚀 Features

- add built-ins, extract STRING, minor updates ([458f5b3](https://github.com/thi-ng/umbrella/commit/458f5b3))
  - add anchors to built-in grammar rules
  - extract STRING preset parser
  - add doc strings
  - add s-expr parser test
  - update imports
  - update readme

## [0.4.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/parse@0.4.0) (2020-04-21)

#### 🚀 Features

- update grammar DSL, hoist xforms ([861e7f3](https://github.com/thi-ng/umbrella/commit/861e7f3))
  - allow esc sequences in grammar string literals
  - expose various preset parser for re-use in grammar DSL
  - rename xfHoist => hoistResult
  - add new xfHoist to hoist entire child node
  - add doc strings

#### 🩹 Bug fixes

- update not() behavior, add passD() ([1d0f4c4](https://github.com/thi-ng/umbrella/commit/1d0f4c4))

#### ♻️ Refactoring

- update wrap() combinator ([a3dae6e](https://github.com/thi-ng/umbrella/commit/a3dae6e))

## [0.3.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/parse@0.3.0) (2020-04-20)

#### 🚀 Features

- add skipWhile(), more discarded wrappers ([832c0b7](https://github.com/thi-ng/umbrella/commit/832c0b7))
  - add skipWhile()
  - add dalt(), dseq() wrappers
  - add NL, DNL presets
  - add ParseContext .state setter
- add more whitespace presets ([1398e2b](https://github.com/thi-ng/umbrella/commit/1398e2b))
- add dynamic() & DynamicParser ([b914267](https://github.com/thi-ng/umbrella/commit/b914267))
- initial checkin grammar compiler ([38e9c66](https://github.com/thi-ng/umbrella/commit/38e9c66))
- add ParseContext.reset(), update addChild() ([d47c0a2](https://github.com/thi-ng/umbrella/commit/d47c0a2))
- add/update/rename parser primitives ([328103f](https://github.com/thi-ng/umbrella/commit/328103f))
  - add LitParser type to annotate single-char parsers
  - add satisfyD()
  - add stringOf() for predicated strings
  - add wordBoundary anchor
  - add/update/rename discarding parser prims:
    - litD(), stringD(), noneOfD(), oneOfD(), rangeD()
  - export predicate versions:
    - litP(), noneOfP(), oneOfP(), rangeP()
  - update skipWhile() behavior
- add/update combinators ([e4eab03](https://github.com/thi-ng/umbrella/commit/e4eab03))
  - add startsWith, endsWith, entireLine, entirely
  - add wrap()
  - rename dalt/dseq => altD/seqD
- add withID() xform, add doc strings ([e16426b](https://github.com/thi-ng/umbrella/commit/e16426b))
- add/update/rename parser presets ([12f2499](https://github.com/thi-ng/umbrella/commit/12f2499))
- update grammar parser & compiler ([822fcba](https://github.com/thi-ng/umbrella/commit/822fcba))
  - add GrammarOpts
  - update rules to enable repetition of all terms
  - add string term
  - make debug output optional
- add discarding combinators, move discard ([e09a2c4](https://github.com/thi-ng/umbrella/commit/e09a2c4))
  - add repeatD, oneOrMoreD, zeroOrMoreD
- update ESC & whitespace parsers ([069a6ef](https://github.com/thi-ng/umbrella/commit/069a6ef))
- add grammar default transforms, update/fix rules ([03ed965](https://github.com/thi-ng/umbrella/commit/03ed965))

#### ♻️ Refactoring

- update grammar & pkg re-exports ([3ba8973](https://github.com/thi-ng/umbrella/commit/3ba8973))

## [0.2.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/parse@0.2.0) (2020-04-17)

#### 🚀 Features

- add/rename/reorg parsers, xforms, ctx ([ee537f4](https://github.com/thi-ng/umbrella/commit/ee537f4))
  - add dlit(), dstring()
  - add fail()
  - rename lift() => pass(), Lift<T> => PassValue<T>
  - rename merge()/xfMerge() => join()/xfJoin()
  - add hoist()/xfHoist()
  - migrate xform syntax sugars to /xform
  - add indent() util for ParseContext & print()

#### ⏱ Performance improvements

- major speedup satisfy() (~1.6x faster) ([8ca5c7f](https://github.com/thi-ng/umbrella/commit/8ca5c7f))
  - update ParseContext.addChild() to optionally progress reader
  - update call sites in satisfy(), lift(), repeat()

## [0.1.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/parse@0.1.0) (2020-04-16)

#### 🚀 Features

- import as new package ([151e50c](https://github.com/thi-ng/umbrella/commit/151e50c))
- update repeat ops, reader, initial state ([c5cfabe](https://github.com/thi-ng/umbrella/commit/c5cfabe))
- add collect/xfCollect, update xfPrint ([43f3368](https://github.com/thi-ng/umbrella/commit/43f3368))
- update ParseContext, repeat & lift ([bef1d4f](https://github.com/thi-ng/umbrella/commit/bef1d4f))
  - add context debug option / tracing
  - add .addChild()
  - update repeat zero-match handling
  - simplify lift()
- add ctx getters, add presets, update maybe ([02597bf](https://github.com/thi-ng/umbrella/commit/02597bf))
- add ArrayReader, update pkg info ([3bec0db](https://github.com/thi-ng/umbrella/commit/3bec0db))
- make retained state info optional ([a89ee87](https://github.com/thi-ng/umbrella/commit/a89ee87))
- update defContext, add basic array test ([cd7363d](https://github.com/thi-ng/umbrella/commit/cd7363d))

#### ♻️ Refactoring

- update context, rename ops, remove arrays dep ([a913c96](https://github.com/thi-ng/umbrella/commit/a913c96))
- split presets into sep files ([43f62c5](https://github.com/thi-ng/umbrella/commit/43f62c5))
