# Change Log

- **Last updated**: 2024-11-24T18:15:48Z
- **Generator**: [thi.ng/monopub](https://thi.ng/monopub)

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org/) for commit guidelines.

**Note:** Unlisted _patch_ versions only involve non-code or otherwise excluded changes
and/or version bumps of transitive dependencies.

## [3.3.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/ramp@3.3.0) (2024-09-05)

#### 🚀 Features

- add easing ramp implementations ([1e23b61](https://github.com/thi-ng/umbrella/commit/1e23b61))
  - add `easing()`
  - add `EASING_N` / `EASING_V`
  - update pkg exports

## [3.2.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/ramp@3.2.0) (2024-08-28)

#### 🚀 Features

- add IRamp.removeStopAtIndex() ([05c965f](https://github.com/thi-ng/umbrella/commit/05c965f))

### [3.1.24](https://github.com/thi-ng/umbrella/tree/@thi.ng/ramp@3.1.24) (2024-06-21)

#### ♻️ Refactoring

- dedupe samples() impls ([85515e1](https://github.com/thi-ng/umbrella/commit/85515e1))
  - extract common impl as internal helper
  - update Group.samples() & Ramp.samples()
- dedupe nested() min/max impls ([02e1479](https://github.com/thi-ng/umbrella/commit/02e1479))

## [3.1.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/ramp@3.1.0) (2024-02-19)

#### 🚀 Features

- add minimal API presets for vector interpolations ([6dcb4b6](https://github.com/thi-ng/umbrella/commit/6dcb4b6))
  - add VEC, VEC2/3/4 API presets
  - add VecAPI interface
  - update docs
  - update pkg exports

# [3.0.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/ramp@3.0.0) (2024-02-12)

#### 🛑 Breaking changes

- add support for arbitrary value types ([08e12c3](https://github.com/thi-ng/umbrella/commit/08e12c3))
- BREAKING CHANGE: add support for arbitrary value types, package restructure
  - add unified Ramp class, remove obsolete ARamp, LinearRamp, HermiteRamp
  - add interpolation presets to be used with generic Ramp
    - LINEAR_N, LINEAR_V (numeric/vector valued)
    - HERMITE_N, HERMITE_V
  - update `linear()` & `hermite()` factory fns
  - update Ramp ctor to ensure min. 2 keyframes/stops are provided
  - add new types
  - update/extend readme
  - update pkg meta
- add nested type support, simplify RampImpl ([0daa663](https://github.com/thi-ng/umbrella/commit/0daa663))
- BREAKING CHANGE: rename interpolatedPoints() => samples()
  - add nested() RampImpl
  - update IRamp interface
  - simplify RampImpl interface

#### 🚀 Features

- add time domain fns, grouped ramps, update API ([62c01d1](https://github.com/thi-ng/umbrella/commit/62c01d1))
  - add time domain functions
  - add group() ramp for nested, independent ramps
  - add RampOpts
  - extract IReadonlyRamp, update IRamp
  - update/fix IRamp.addStopAt() to .setStopAt()

### [2.1.83](https://github.com/thi-ng/umbrella/tree/@thi.ng/ramp@2.1.83) (2023-11-09)

#### ♻️ Refactoring

- update all tests (packages A-S) ([e3085e4](https://github.com/thi-ng/umbrella/commit/e3085e4))

### [2.1.10](https://github.com/thi-ng/umbrella/tree/@thi.ng/ramp@2.1.10) (2022-05-02)

#### 🩹 Bug fixes

- fix sort to be stable when time indexes are equal ([053107b](https://github.com/thi-ng/umbrella/commit/053107b))
  Fixes Issue [#343](https://github.com/thi-ng/umbrella/issues/343)

## [2.1.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/ramp@2.1.0) (2021-11-17)

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

### [2.0.9](https://github.com/thi-ng/umbrella/tree/@thi.ng/ramp@2.0.9) (2021-11-10)

#### ♻️ Refactoring

- update all countdown loops ([a5f374b](https://github.com/thi-ng/umbrella/commit/a5f374b))

### [2.0.1](https://github.com/thi-ng/umbrella/tree/@thi.ng/ramp@2.0.1) (2021-10-13)

#### ♻️ Refactoring

- update imports in all pkgs ([5fa2b6f](https://github.com/thi-ng/umbrella/commit/5fa2b6f))
  - add .js suffix for all relative imports
- update imports in all tests/pkgs ([effd591](https://github.com/thi-ng/umbrella/commit/effd591))

# [2.0.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/ramp@2.0.0) (2021-10-12)

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
- update all test stubs ([f2d6d53](https://github.com/thi-ng/umbrella/commit/f2d6d53))
- update imports ([138571a](https://github.com/thi-ng/umbrella/commit/138571a))
- update imports (transducers) ([6de47ec](https://github.com/thi-ng/umbrella/commit/6de47ec))

### [0.1.39](https://github.com/thi-ng/umbrella/tree/@thi.ng/ramp@0.1.39) (2020-12-07)

#### ♻️ Refactoring

- update type-only imports in various tests/pkgs ([3fd9c24](https://github.com/thi-ng/umbrella/commit/3fd9c24))
- update type-only imports ([97a4e43](https://github.com/thi-ng/umbrella/commit/97a4e43))

### [0.1.2](https://github.com/thi-ng/umbrella/tree/@thi.ng/ramp@0.1.2) (2020-02-25)

#### ♻️ Refactoring

- update imports ([9fac422](https://github.com/thi-ng/umbrella/commit/9fac422))

## [0.1.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/ramp@0.1.0) (2020-01-24)

#### 🚀 Features

- import as new pkg ([d58ba4e](https://github.com/thi-ng/umbrella/commit/d58ba4e))
- add ARamp.bounds(), factory fns, optimize timeIndex(), add benchmarks ([83d3670](https://github.com/thi-ng/umbrella/commit/83d3670))
  - add linear()/hermite() factory fns
  - add RampBounds & ARamp.bounds() to obtain min/max values
  - switch to binary search if num stops >= 256
  - update deps / readme
