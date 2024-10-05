# Change Log

- **Last updated**: 2024-10-05T12:12:32Z
- **Generator**: [thi.ng/monopub](https://thi.ng/monopub)

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org/) for commit guidelines.

**Note:** Unlisted _patch_ versions only involve non-code or otherwise excluded changes
and/or version bumps of transitive dependencies.

### [2.1.98](https://github.com/thi-ng/umbrella/tree/@thi.ng/hdom-mock@2.1.98) (2024-04-20)

#### ♻️ Refactoring

- update type usage ([63782c5](https://github.com/thi-ng/umbrella/commit/63782c5))

### [2.1.62](https://github.com/thi-ng/umbrella/tree/@thi.ng/hdom-mock@2.1.62) (2023-11-09)

#### ♻️ Refactoring

- update all tests (packages A-S) ([e3085e4](https://github.com/thi-ng/umbrella/commit/e3085e4))

### [2.1.6](https://github.com/thi-ng/umbrella/tree/@thi.ng/hdom-mock@2.1.6) (2022-04-07)

#### ♻️ Refactoring

- replace deprecated .substr() w/ .substring() ([0710509](https://github.com/thi-ng/umbrella/commit/0710509))

## [2.1.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/hdom-mock@2.1.0) (2021-11-17)

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

### [2.0.8](https://github.com/thi-ng/umbrella/tree/@thi.ng/hdom-mock@2.0.8) (2021-11-10)

#### ♻️ Refactoring

- update all countdown loops ([a5f374b](https://github.com/thi-ng/umbrella/commit/a5f374b))

### [2.0.1](https://github.com/thi-ng/umbrella/tree/@thi.ng/hdom-mock@2.0.1) (2021-10-13)

#### ♻️ Refactoring

- update imports in all tests/pkgs ([effd591](https://github.com/thi-ng/umbrella/commit/effd591))

# [2.0.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/hdom-mock@2.0.0) (2021-10-12)

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

### [1.1.45](https://github.com/thi-ng/umbrella/tree/@thi.ng/hdom-mock@1.1.45) (2020-12-07)

#### ♻️ Refactoring

- update type-only imports in various tests/pkgs ([3fd9c24](https://github.com/thi-ng/umbrella/commit/3fd9c24))

### [1.1.11](https://github.com/thi-ng/umbrella/tree/@thi.ng/hdom-mock@1.1.11) (2020-02-25)

#### ♻️ Refactoring

- update imports ([77fb116](https://github.com/thi-ng/umbrella/commit/77fb116))

## [1.1.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/hdom-mock@1.1.0) (2019-07-07)

#### 🚀 Features

- enable TS strict compiler flags (refactor) ([787e2d4](https://github.com/thi-ng/umbrella/commit/787e2d4))

#### ♻️ Refactoring

- address TS strictNullChecks flag ([be15162](https://github.com/thi-ng/umbrella/commit/be15162))

# [1.0.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/hdom-mock@1.0.0) (2019-01-21)

#### 🛑 Breaking changes

- update package scripts, outputs, imports in remaining packages ([f912a84](https://github.com/thi-ng/umbrella/commit/f912a84))
- BREAKING CHANGE: enable multi-outputs (ES6 modules, CJS, UMD)
  - build scripts now first build ES6 modules in package root, then call
    `scripts/bundle-module` to build minified CJS & UMD bundles in `/lib`
  - all imports MUST be updated to only refer to package level
    (not individual files anymore). tree shaking in user land will get rid of
    all unused imported symbols

## [0.1.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/hdom-mock@0.1.0) (2018-12-13)

#### 🚀 Features

- add hdom-mock package and implementation, add initial tests ([5609d24](https://github.com/thi-ng/umbrella/commit/5609d24))

#### ♻️ Refactoring

- update text node handling, tests, add readme ([c1fecc4](https://github.com/thi-ng/umbrella/commit/c1fecc4))
