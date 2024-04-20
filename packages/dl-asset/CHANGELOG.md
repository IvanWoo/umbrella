# Change Log

- **Last updated**: 2024-04-20T14:42:45Z
- **Generator**: [thi.ng/monopub](https://thi.ng/monopub)

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org/) for commit guidelines.

**Note:** Unlisted _patch_ versions only involve non-code or otherwise excluded changes
and/or version bumps of transitive dependencies.

### [2.3.47](https://github.com/thi-ng/umbrella/tree/@thi.ng/dl-asset@2.3.47) (2023-11-09)

#### ♻️ Refactoring

- update all tests (packages A-S) ([e3085e4](https://github.com/thi-ng/umbrella/commit/e3085e4))

## [2.3.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/dl-asset@2.3.0) (2021-12-13)

#### 🚀 Features

- add canvasVideoRecorder() ([6736463](https://github.com/thi-ng/umbrella/commit/6736463))

## [2.2.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/dl-asset@2.2.0) (2021-11-17)

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

## [2.1.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/dl-asset@2.1.0) (2021-11-10)

#### 🚀 Features

- add downloadCanvas() ([ca657d4](https://github.com/thi-ng/umbrella/commit/ca657d4))

### [2.0.1](https://github.com/thi-ng/umbrella/tree/@thi.ng/dl-asset@2.0.1) (2021-10-13)

#### ♻️ Refactoring

- update imports in all pkgs ([5fa2b6f](https://github.com/thi-ng/umbrella/commit/5fa2b6f))
  - add .js suffix for all relative imports
- update imports in all tests/pkgs ([effd591](https://github.com/thi-ng/umbrella/commit/effd591))

# [2.0.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/dl-asset@2.0.0) (2021-10-12)

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
- update imports ([29a7681](https://github.com/thi-ng/umbrella/commit/29a7681))

## [0.4.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/dl-asset@0.4.0) (2020-07-08)

#### 🚀 Features

- split src, extract `downloadWithMime()` ([d749819](https://github.com/thi-ng/umbrella/commit/d749819))
  - new fn improves tree shaking and can avoid inclusion of [@thi.ng/mime](https://github.com/thi-ng/umbrella/tree/main/packages/mime)
    if mime type is explicitly provided by user

## [0.3.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/dl-asset@0.3.0) (2020-02-26)

#### 🚀 Features

- yet another npm forced pkg rename ([2cae33c](https://github.com/thi-ng/umbrella/commit/2cae33c))
  - https://twitter.com/thing_umbrella/status/1232461386917257217
