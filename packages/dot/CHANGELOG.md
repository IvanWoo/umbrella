# Change Log

- **Last updated**: 2024-10-05T12:12:32Z
- **Generator**: [thi.ng/monopub](https://thi.ng/monopub)

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org/) for commit guidelines.

**Note:** Unlisted _patch_ versions only involve non-code or otherwise excluded changes
and/or version bumps of transitive dependencies.

### [2.1.77](https://github.com/thi-ng/umbrella/tree/@thi.ng/dot@2.1.77) (2024-06-21)

#### ♻️ Refactoring

- enforce uniform naming convention of internal functions ([56992b2](https://github.com/thi-ng/umbrella/commit/56992b2))

### [2.1.69](https://github.com/thi-ng/umbrella/tree/@thi.ng/dot@2.1.69) (2024-03-18)

#### ♻️ Refactoring

- minor update regexp ([5429dd5](https://github.com/thi-ng/umbrella/commit/5429dd5))

### [2.1.45](https://github.com/thi-ng/umbrella/tree/@thi.ng/dot@2.1.45) (2023-11-09)

#### ♻️ Refactoring

- update all tests (packages A-S) ([e3085e4](https://github.com/thi-ng/umbrella/commit/e3085e4))

### [2.1.43](https://github.com/thi-ng/umbrella/tree/@thi.ng/dot@2.1.43) (2023-09-28)

#### 🩹 Bug fixes

- update GraphAttribs.rankDir ([a8d87b7](https://github.com/thi-ng/umbrella/commit/a8d87b7))

## [2.1.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/dot@2.1.0) (2021-11-17)

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

### [2.0.1](https://github.com/thi-ng/umbrella/tree/@thi.ng/dot@2.0.1) (2021-10-13)

#### ♻️ Refactoring

- update imports in all pkgs ([5fa2b6f](https://github.com/thi-ng/umbrella/commit/5fa2b6f))
  - add .js suffix for all relative imports
- update imports in all tests/pkgs ([effd591](https://github.com/thi-ng/umbrella/commit/effd591))

# [2.0.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/dot@2.0.0) (2021-10-12)

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
- update imports ([7c9d6c3](https://github.com/thi-ng/umbrella/commit/7c9d6c3))

### [1.2.21](https://github.com/thi-ng/umbrella/tree/@thi.ng/dot@1.2.21) (2020-12-07)

#### ♻️ Refactoring

- update type-only imports in various tests/pkgs ([3fd9c24](https://github.com/thi-ng/umbrella/commit/3fd9c24))

## [1.2.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/dot@1.2.0) (2020-04-03)

#### 🚀 Features

- support includes, update subgraph handling ([ed53c90](https://github.com/thi-ng/umbrella/commit/ed53c90))

### [1.1.10](https://github.com/thi-ng/umbrella/tree/@thi.ng/dot@1.1.10) (2020-02-25)

#### ♻️ Refactoring

- update imports ([700cb0d](https://github.com/thi-ng/umbrella/commit/700cb0d))

## [1.1.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/dot@1.1.0) (2019-07-07)

#### 🚀 Features

- enable TS strict compiler flags (refactor) ([29e0cb4](https://github.com/thi-ng/umbrella/commit/29e0cb4))

# [1.0.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/dot@1.0.0) (2019-01-21)

#### 🛑 Breaking changes

- update package build scripts & outputs, imports in ~50 packages ([b54b703](https://github.com/thi-ng/umbrella/commit/b54b703))
- BREAKING CHANGE: enabled multi-outputs (ES6 modules, CJS, UMD)
  - build scripts now first build ES6 modules in package root, then call
    `scripts/bundle-module` to build minified CJS & UMD bundles in `/lib`
  - all imports MUST be updated to only refer to package level
    (not individual files anymore). tree shaking in user land will get rid of
    all unused imported symbols.

## [0.1.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/dot@0.1.0) (2018-05-09)

#### 🚀 Features

- initial import [@thi.ng/dot](https://github.com/thi-ng/umbrella/tree/main/packages/dot) ([500dfa3](https://github.com/thi-ng/umbrella/commit/500dfa3))

#### ♻️ Refactoring

- replace NodeShape enum, minor other refactoring, add example ([23b6451](https://github.com/thi-ng/umbrella/commit/23b6451))
