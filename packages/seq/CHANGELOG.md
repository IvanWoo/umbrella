# Change Log

- **Last updated**: 2024-08-10T15:03:07Z
- **Generator**: [thi.ng/monopub](https://thi.ng/monopub)

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org/) for commit guidelines.

**Note:** Unlisted _patch_ versions only involve non-code or otherwise excluded changes
and/or version bumps of transitive dependencies.

### [0.4.72](https://github.com/thi-ng/umbrella/tree/@thi.ng/seq@0.4.72) (2024-04-20)

#### ♻️ Refactoring

- update type usage ([76645c7](https://github.com/thi-ng/umbrella/commit/76645c7))

### [0.4.44](https://github.com/thi-ng/umbrella/tree/@thi.ng/seq@0.4.44) (2023-11-09)

#### ♻️ Refactoring

- update all tests (packages A-S) ([e3085e4](https://github.com/thi-ng/umbrella/commit/e3085e4))

## [0.4.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/seq@0.4.0) (2021-11-17)

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

### [0.3.1](https://github.com/thi-ng/umbrella/tree/@thi.ng/seq@0.3.1) (2021-10-13)

#### ♻️ Refactoring

- update imports in all pkgs ([5fa2b6f](https://github.com/thi-ng/umbrella/commit/5fa2b6f))
  - add .js suffix for all relative imports
- update imports in all tests/pkgs ([effd591](https://github.com/thi-ng/umbrella/commit/effd591))

## [0.3.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/seq@0.3.0) (2021-10-12)

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

### [0.2.23](https://github.com/thi-ng/umbrella/tree/@thi.ng/seq@0.2.23) (2020-09-13)

#### ♻️ Refactoring

- update imports ([306cfe5](https://github.com/thi-ng/umbrella/commit/306cfe5))

### [0.2.2](https://github.com/thi-ng/umbrella/tree/@thi.ng/seq@0.2.2) (2020-02-25)

#### ♻️ Refactoring

- update imports ([007ea5f](https://github.com/thi-ng/umbrella/commit/007ea5f))

## [0.2.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/seq@0.2.0) (2020-01-24)

#### 🚀 Features

- add lazyseq() & cons(), tests, update readme ([d25584e](https://github.com/thi-ng/umbrella/commit/d25584e))

## [0.1.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/seq@0.1.0) (2019-11-30)

#### 🚀 Features

- import as new pkg ([25ebbb0](https://github.com/thi-ng/umbrella/commit/25ebbb0))

#### ⏱ Performance improvements

- update most functions, add docs/tests, update readme ([552ed64](https://github.com/thi-ng/umbrella/commit/552ed64))
  - optimize aseq/rseq()
  - optimize concat/concatA()
  - add ISequable support for iterator()
