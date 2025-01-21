# Change Log

- **Last updated**: 2025-01-21T15:46:52Z
- **Generator**: [thi.ng/monopub](https://thi.ng/monopub)

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org/) for commit guidelines.

**Note:** Unlisted _patch_ versions only involve non-code or otherwise excluded changes
and/or version bumps of transitive dependencies.

### [1.0.87](https://github.com/thi-ng/umbrella/tree/@thi.ng/colored-noise@1.0.87) (2024-12-24)

#### 🩹 Bug fixes

- update imports ([5f8f8df](https://github.com/thi-ng/umbrella/commit/5f8f8df))

### [1.0.66](https://github.com/thi-ng/umbrella/tree/@thi.ng/colored-noise@1.0.66) (2024-04-08)

#### ♻️ Refactoring

- update reducer handling ([5b445a7](https://github.com/thi-ng/umbrella/commit/5b445a7))

### [1.0.56](https://github.com/thi-ng/umbrella/tree/@thi.ng/colored-noise@1.0.56) (2024-02-22)

#### ♻️ Refactoring

- update object destructuring in all pkgs & examples ([f36aeb0](https://github.com/thi-ng/umbrella/commit/f36aeb0))

### [1.0.35](https://github.com/thi-ng/umbrella/tree/@thi.ng/colored-noise@1.0.35) (2023-11-09)

#### ♻️ Refactoring

- update all tests (packages A-S) ([e3085e4](https://github.com/thi-ng/umbrella/commit/e3085e4))

# [1.0.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/colored-noise@1.0.0) (2022-11-23)

#### 🛑 Breaking changes

- [#363](https://github.com/thi-ng/umbrella/issues/363) add ColoredNoiseOpts ([b2d1d13](https://github.com/thi-ng/umbrella/commit/b2d1d13))
- BREAKING CHANGE: replace generator args with uniform options object
  - add `ColoredNoiseOpts` config interface
  - update all generators
  - update tools/examples
  - update readme

## [0.3.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/colored-noise@0.3.0) (2021-11-17)

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

### [0.2.1](https://github.com/thi-ng/umbrella/tree/@thi.ng/colored-noise@0.2.1) (2021-10-13)

#### ♻️ Refactoring

- update imports in all pkgs ([5fa2b6f](https://github.com/thi-ng/umbrella/commit/5fa2b6f))
  - add .js suffix for all relative imports
- update imports in all tests/pkgs ([effd591](https://github.com/thi-ng/umbrella/commit/effd591))

## [0.2.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/colored-noise@0.2.0) (2021-10-12)

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
- update imports ([c0d9e17](https://github.com/thi-ng/umbrella/commit/c0d9e17))
- minor pkg restructure (various) ([47f88d2](https://github.com/thi-ng/umbrella/commit/47f88d2))

### [0.1.1](https://github.com/thi-ng/umbrella/tree/@thi.ng/colored-noise@0.1.1) (2020-09-13)

#### ♻️ Refactoring

- update imports, use new Fn types in various pkgs ([ced1e5d](https://github.com/thi-ng/umbrella/commit/ced1e5d))

## [0.1.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/colored-noise@0.1.0) (2020-08-28)

#### 🚀 Features

- import as new pkg (MBP2010) ([6459256](https://github.com/thi-ng/umbrella/commit/6459256))
