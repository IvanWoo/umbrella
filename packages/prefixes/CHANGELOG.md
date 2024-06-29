# Change Log

- **Last updated**: 2024-06-29T09:28:36Z
- **Generator**: [thi.ng/monopub](https://thi.ng/monopub)

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org/) for commit guidelines.

**Note:** Unlisted _patch_ versions only involve non-code or otherwise excluded changes
and/or version bumps of transitive dependencies.

## [2.3.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/prefixes@2.3.0) (2023-12-26)

#### 🚀 Features

- add Inkscape XML NS ([6b26d16](https://github.com/thi-ng/umbrella/commit/6b26d16))

### [2.2.3](https://github.com/thi-ng/umbrella/tree/@thi.ng/prefixes@2.2.3) (2023-11-09)

#### ♻️ Refactoring

- update all tests (packages A-S) ([e3085e4](https://github.com/thi-ng/umbrella/commit/e3085e4))

## [2.2.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/prefixes@2.2.0) (2023-08-28)

#### 🚀 Features

- add GPX & KML namespace URIs ([13dd8d3](https://github.com/thi-ng/umbrella/commit/13dd8d3))

## [2.1.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/prefixes@2.1.0) (2021-11-17)

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

### [2.0.1](https://github.com/thi-ng/umbrella/tree/@thi.ng/prefixes@2.0.1) (2021-10-13)

#### ♻️ Refactoring

- update imports in all pkgs ([5fa2b6f](https://github.com/thi-ng/umbrella/commit/5fa2b6f))
  - add .js suffix for all relative imports
- update imports in all tests/pkgs ([effd591](https://github.com/thi-ng/umbrella/commit/effd591))

# [2.0.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/prefixes@2.0.0) (2021-10-12)

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

## [0.1.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/prefixes@0.1.0) (2020-07-02)

#### 🚀 Features

- import as new pkg ([0fbab43](https://github.com/thi-ng/umbrella/commit/0fbab43))
- add/update prefixes ([9051342](https://github.com/thi-ng/umbrella/commit/9051342))

#### ♻️ Refactoring

- update all prefix names, add `XML_` prefix ([3715c7e](https://github.com/thi-ng/umbrella/commit/3715c7e))
  - make all RDF vocab prefixes lowercase
  - add `XML_` for all XML namespaces
