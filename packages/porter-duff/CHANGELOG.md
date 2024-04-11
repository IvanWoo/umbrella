# Change Log

- **Last updated**: 2024-04-11T12:32:44Z
- **Generator**: [thi.ng/monopub](https://thi.ng/monopub)

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org/) for commit guidelines.

**Note:** Unlisted _patch_ versions only involve non-code or otherwise excluded changes
and/or version bumps of transitive dependencies.

### [2.1.47](https://github.com/thi-ng/umbrella/tree/@thi.ng/porter-duff@2.1.47) (2023-11-09)

#### ♻️ Refactoring

- update all tests (packages A-S) ([e3085e4](https://github.com/thi-ng/umbrella/commit/e3085e4))

### [2.1.23](https://github.com/thi-ng/umbrella/tree/@thi.ng/porter-duff@2.1.23) (2023-01-10)

#### ⏱ Performance improvements

- return optimized blend fns ([1c408c7](https://github.com/thi-ng/umbrella/commit/1c408c7))
  - add PD coefficient checks in porterDuff()/porterDuffInt()
  - return optimized blend fns if one or both coeffs are zero

### [2.1.13](https://github.com/thi-ng/umbrella/tree/@thi.ng/porter-duff@2.1.13) (2022-09-27)

#### ♻️ Refactoring

- add BlendFn types ([a8ff0aa](https://github.com/thi-ng/umbrella/commit/a8ff0aa))

## [2.1.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/porter-duff@2.1.0) (2021-11-17)

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

### [2.0.1](https://github.com/thi-ng/umbrella/tree/@thi.ng/porter-duff@2.0.1) (2021-10-13)

#### ♻️ Refactoring

- update imports in all pkgs ([5fa2b6f](https://github.com/thi-ng/umbrella/commit/5fa2b6f))
  - add .js suffix for all relative imports
- update imports in all tests/pkgs ([effd591](https://github.com/thi-ng/umbrella/commit/effd591))

# [2.0.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/porter-duff@2.0.0) (2021-10-12)

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
- minor pkg restructure (various) ([47f88d2](https://github.com/thi-ng/umbrella/commit/47f88d2))

### [0.1.34](https://github.com/thi-ng/umbrella/tree/@thi.ng/porter-duff@0.1.34) (2020-12-07)

#### ♻️ Refactoring

- update type-only imports in various tests/pkgs ([3fd9c24](https://github.com/thi-ng/umbrella/commit/3fd9c24))

### [0.1.30](https://github.com/thi-ng/umbrella/tree/@thi.ng/porter-duff@0.1.30) (2020-09-13)

#### ♻️ Refactoring

- update deps, imports, use new Fn types ([174de7a](https://github.com/thi-ng/umbrella/commit/174de7a))

### [0.1.8](https://github.com/thi-ng/umbrella/tree/@thi.ng/porter-duff@0.1.8) (2020-02-25)

#### ♻️ Refactoring

- update imports ([b7e811c](https://github.com/thi-ng/umbrella/commit/b7e811c))

## [0.1.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/porter-duff@0.1.0) (2019-07-31)

#### 🚀 Features

- extract as new package ([47eef2a](https://github.com/thi-ng/umbrella/commit/47eef2a))
- simplify main op impl, add PLUS op, update readme ([6df117a](https://github.com/thi-ng/umbrella/commit/6df117a))
- add isPremultiplied checks ([f473761](https://github.com/thi-ng/umbrella/commit/f473761))
- add darken/dissolve/opacity, optimize int ops, update readme ([c42b795](https://github.com/thi-ng/umbrella/commit/c42b795))

#### 🩹 Bug fixes

- use int version for PLUS_I ([ccb29dc](https://github.com/thi-ng/umbrella/commit/ccb29dc))
- re-add missing channel blend factor (porterDuffInt) ([cf94597](https://github.com/thi-ng/umbrella/commit/cf94597))
