# Change Log

- **Last updated**: 2024-10-05T12:12:32Z
- **Generator**: [thi.ng/monopub](https://thi.ng/monopub)

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org/) for commit guidelines.

**Note:** Unlisted _patch_ versions only involve non-code or otherwise excluded changes
and/or version bumps of transitive dependencies.

### [2.2.84](https://github.com/thi-ng/umbrella/tree/@thi.ng/transducers-fsm@2.2.84) (2024-04-20)

#### ♻️ Refactoring

- update type usage ([3a72b97](https://github.com/thi-ng/umbrella/commit/3a72b97))

### [2.2.82](https://github.com/thi-ng/umbrella/tree/@thi.ng/transducers-fsm@2.2.82) (2024-04-08)

#### ♻️ Refactoring

- update reducer handling due to updates in [@thi.ng/transducers](https://github.com/thi-ng/umbrella/tree/main/packages/transducers) pkg ([855bcba](https://github.com/thi-ng/umbrella/commit/855bcba))

### [2.2.45](https://github.com/thi-ng/umbrella/tree/@thi.ng/transducers-fsm@2.2.45) (2023-11-09)

#### ♻️ Refactoring

- update all tests (packages T-Z) ([020ef6c](https://github.com/thi-ng/umbrella/commit/020ef6c))

## [2.2.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/transducers-fsm@2.2.0) (2022-12-16)

#### 🚀 Features

- fix [#358](https://github.com/thi-ng/umbrella/issues/358) add "completed" project status, update pkgs/readmes ([d35fa52](https://github.com/thi-ng/umbrella/commit/d35fa52))

## [2.1.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/transducers-fsm@2.1.0) (2021-11-17)

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

### [2.0.1](https://github.com/thi-ng/umbrella/tree/@thi.ng/transducers-fsm@2.0.1) (2021-10-13)

#### ♻️ Refactoring

- update imports in all tests/pkgs ([effd591](https://github.com/thi-ng/umbrella/commit/effd591))

# [2.0.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/transducers-fsm@2.0.0) (2021-10-12)

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
- update imports ([924aa26](https://github.com/thi-ng/umbrella/commit/924aa26))

### [1.1.42](https://github.com/thi-ng/umbrella/tree/@thi.ng/transducers-fsm@1.1.42) (2020-12-07)

#### ♻️ Refactoring

- update type-only imports in various tests/pkgs ([3fd9c24](https://github.com/thi-ng/umbrella/commit/3fd9c24))

### [1.1.10](https://github.com/thi-ng/umbrella/tree/@thi.ng/transducers-fsm@1.1.10) (2020-02-25)

#### ♻️ Refactoring

- update imports ([b54bf0a](https://github.com/thi-ng/umbrella/commit/b54bf0a))

## [1.1.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/transducers-fsm@1.1.0) (2019-07-07)

#### 🚀 Features

- enable TS strict compiler flags (refactor) ([734103d](https://github.com/thi-ng/umbrella/commit/734103d))

### [1.0.9](https://github.com/thi-ng/umbrella/tree/@thi.ng/transducers-fsm@1.0.9) (2019-03-10)

#### ♻️ Refactoring

- re-use type aliases from [@thi.ng/api](https://github.com/thi-ng/umbrella/tree/main/packages/api) ([0d2fdff](https://github.com/thi-ng/umbrella/commit/0d2fdff))

# [1.0.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/transducers-fsm@1.0.0) (2019-01-21)

#### 🛑 Breaking changes

- update package build scripts & outputs, imports in ~50 packages ([b54b703](https://github.com/thi-ng/umbrella/commit/b54b703))
- BREAKING CHANGE: enabled multi-outputs (ES6 modules, CJS, UMD)
  - build scripts now first build ES6 modules in package root, then call
    `scripts/bundle-module` to build minified CJS & UMD bundles in `/lib`
  - all imports MUST be updated to only refer to package level
    (not individual files anymore). tree shaking in user land will get rid of
    all unused imported symbols.

#### ♻️ Refactoring

- use arrow fns ([e103d74](https://github.com/thi-ng/umbrella/commit/e103d74))

## [0.2.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/transducers-fsm@0.2.0) (2018-06-19)

#### 🚀 Features

- support multiple results, add tests, update readme ([a9ca135](https://github.com/thi-ng/umbrella/commit/a9ca135))

## [0.1.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/transducers-fsm@0.1.0) (2018-06-18)

#### 🚀 Features

- inital import ([7c3c290](https://github.com/thi-ng/umbrella/commit/7c3c290))
