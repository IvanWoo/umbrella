# Change Log

- **Last updated**: 2024-11-10T17:11:51Z
- **Generator**: [thi.ng/monopub](https://thi.ng/monopub)

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org/) for commit guidelines.

**Note:** Unlisted _patch_ versions only involve non-code or otherwise excluded changes
and/or version bumps of transitive dependencies.

## [3.6.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/bench@3.6.0) (2024-08-10)

#### 🚀 Features

- add poisson-image example ([87ec9e7](https://github.com/thi-ng/umbrella/commit/87ec9e7))
  - update readmes
  - cc @nkint :)

### [3.5.7](https://github.com/thi-ng/umbrella/tree/@thi.ng/bench@3.5.7) (2024-06-21)

#### ♻️ Refactoring

- enforce uniform naming convention of internal functions ([56992b2](https://github.com/thi-ng/umbrella/commit/56992b2))

### [3.5.1](https://github.com/thi-ng/umbrella/tree/@thi.ng/bench@3.5.1) (2024-03-27)

#### 🩹 Bug fixes

- fix optional arg type for timeDiff() ([29825ac](https://github.com/thi-ng/umbrella/commit/29825ac))

## [3.5.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/bench@3.5.0) (2024-03-13)

#### 🚀 Features

- add frequency stat (i.e. ops/sec) ([0e6576a](https://github.com/thi-ng/umbrella/commit/0e6576a))
  - add `BenchmarkOpts.extSize`
  - update `benchmark()`
  - update all formatters
  - add `setPrecision()` to adjust float formatter

### [3.4.28](https://github.com/thi-ng/umbrella/tree/@thi.ng/bench@3.4.28) (2024-02-22)

#### ♻️ Refactoring

- update object destructuring in all pkgs & examples ([f36aeb0](https://github.com/thi-ng/umbrella/commit/f36aeb0))

### [3.4.9](https://github.com/thi-ng/umbrella/tree/@thi.ng/bench@3.4.9) (2023-11-09)

#### ♻️ Refactoring

- update all tests (packages A-S) ([e3085e4](https://github.com/thi-ng/umbrella/commit/e3085e4))

## [3.4.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/bench@3.4.0) (2023-06-14)

#### 🚀 Features

- add Profiler.profile()/wrap(), minor fixes ([0f3b44b](https://github.com/thi-ng/umbrella/commit/0f3b44b))
  - update session total to be sum of all profiled calls,
    rather than wallclock time
  - fix field order in Profiler.asCSV()

## [3.3.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/bench@3.3.0) (2023-06-13)

#### 🚀 Features

- add profiler ([5fdd867](https://github.com/thi-ng/umbrella/commit/5fdd867))

### [3.2.3](https://github.com/thi-ng/umbrella/tree/@thi.ng/bench@3.2.3) (2023-02-17)

#### ♻️ Refactoring

- update timeDiff() ([37054e0](https://github.com/thi-ng/umbrella/commit/37054e0))
  - default 2nd arg to current timestamp

## [3.2.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/bench@3.2.0) (2023-02-05)

#### 🚀 Features

- add support for performance.now() ([f48cb35](https://github.com/thi-ng/umbrella/commit/f48cb35))
  - update now() to add perf.now as primary fallback option

## [3.1.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/bench@3.1.0) (2021-11-17)

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

### [3.0.8](https://github.com/thi-ng/umbrella/tree/@thi.ng/bench@3.0.8) (2021-11-10)

#### ♻️ Refactoring

- update all countdown loops ([a5f374b](https://github.com/thi-ng/umbrella/commit/a5f374b))

### [3.0.1](https://github.com/thi-ng/umbrella/tree/@thi.ng/bench@3.0.1) (2021-10-13)

#### ♻️ Refactoring

- update imports in all pkgs ([5fa2b6f](https://github.com/thi-ng/umbrella/commit/5fa2b6f))
  - add .js suffix for all relative imports
- update imports in all tests/pkgs ([effd591](https://github.com/thi-ng/umbrella/commit/effd591))

# [3.0.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/bench@3.0.0) (2021-10-12)

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

#### 🚀 Features

- add timeDiff, Timestamp type ([c612de0](https://github.com/thi-ng/umbrella/commit/c612de0))

#### ♻️ Refactoring

- update all tests in _all_ pkgs ([8b582bc](https://github.com/thi-ng/umbrella/commit/8b582bc))
  - update all to use [@thi.ng/testament](https://github.com/thi-ng/umbrella/tree/main/packages/testament)
- update all test stubs ([f2d6d53](https://github.com/thi-ng/umbrella/commit/f2d6d53))

## [2.1.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/bench@2.1.0) (2021-03-12)

#### 🚀 Features

- add suite & formatters, update benchmark() ([5ea02bd](https://github.com/thi-ng/umbrella/commit/5ea02bd))
  - add `suite()` benchmark runner
  - update `BenchmarkOpts` & `benchmark()`
    - add `size` option to configure calls per iteration
    - add `format` option to configure formatter
  - add `BenchmarkFormatter` interface
  - add `FORMAT_DEFAULT`, `FORMAT_CSV` & `FORMAT_MD` formatters

### [2.0.24](https://github.com/thi-ng/umbrella/tree/@thi.ng/bench@2.0.24) (2020-12-07)

#### ♻️ Refactoring

- update type-only imports ([e6c8d98](https://github.com/thi-ng/umbrella/commit/e6c8d98))

### [2.0.6](https://github.com/thi-ng/umbrella/tree/@thi.ng/bench@2.0.6) (2020-04-03)

#### 🩹 Bug fixes

- fallback handlingin now() ([6494851](https://github.com/thi-ng/umbrella/commit/6494851))
- update timedResult() to always downscale to ms ([fb2c632](https://github.com/thi-ng/umbrella/commit/fb2c632))

### [2.0.1](https://github.com/thi-ng/umbrella/tree/@thi.ng/bench@2.0.1) (2020-02-25)

#### ♻️ Refactoring

- update imports ([cfdcd3a](https://github.com/thi-ng/umbrella/commit/cfdcd3a))

# [2.0.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/bench@2.0.0) (2020-01-24)

#### 🛑 Breaking changes

- add types, benchmark(), bigint timestamps, restructure ([e0af94c](https://github.com/thi-ng/umbrella/commit/e0af94c))
  - split module into separate files
  - add BenchmarkOpts / BenchmarkResult types
  - add benchmark()
  - add now() timestamp fn (uses nanosec timer on Node)
- BREAKING CHANGE: Though no public API change, this library internally
  uses ES BigInt timestamps now (in Node via `process.hrtime.bigint()`).

#### 🩹 Bug fixes

- update now() to only OPTIONALLY use bigint timestamps ([7ac391b](https://github.com/thi-ng/umbrella/commit/7ac391b))

# [1.0.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/bench@1.0.0) (2019-01-21)

#### 🛑 Breaking changes

- update package build scripts & outputs, imports in ~50 packages ([b54b703](https://github.com/thi-ng/umbrella/commit/b54b703))
- BREAKING CHANGE: enabled multi-outputs (ES6 modules, CJS, UMD)
  - build scripts now first build ES6 modules in package root, then call
    `scripts/bundle-module` to build minified CJS & UMD bundles in `/lib`
  - all imports MUST be updated to only refer to package level
    (not individual files anymore). tree shaking in user land will get rid of
    all unused imported symbols.

## [0.3.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/bench@0.3.0) (2018-10-21)

#### 🚀 Features

- add timedResult() / benchResult() ([0cf708f](https://github.com/thi-ng/umbrella/commit/0cf708f))

## [0.2.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/bench@0.2.0) (2018-08-28)

#### 🚀 Features

- add opt prefix arg, update docs ([4a37367](https://github.com/thi-ng/umbrella/commit/4a37367))

## [0.1.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/bench@0.1.0) (2018-05-10)

#### 🚀 Features

- add new package [@thi.ng/bench](https://github.com/thi-ng/umbrella/tree/main/packages/bench) ([9466d4b](https://github.com/thi-ng/umbrella/commit/9466d4b))
