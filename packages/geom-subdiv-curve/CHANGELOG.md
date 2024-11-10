# Change Log

- **Last updated**: 2024-11-10T17:11:51Z
- **Generator**: [thi.ng/monopub](https://thi.ng/monopub)

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org/) for commit guidelines.

**Note:** Unlisted _patch_ versions only involve non-code or otherwise excluded changes
and/or version bumps of transitive dependencies.

# [3.0.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/geom-subdiv-curve@3.0.0) (2024-06-21)

#### 🛑 Breaking changes

- migrate types from [@thi.ng/geom-api](https://github.com/thi-ng/umbrella/tree/main/packages/geom-api) ([c7564f2](https://github.com/thi-ng/umbrella/commit/c7564f2))
- BREAKING CHANGE: migrate/internalize types from [@thi.ng/geom-api](https://github.com/thi-ng/umbrella/tree/main/packages/geom-api)
  - add/migrate SubdivKernel
  - update imports
  - update deps
- update subdiv kernels ([cd69dd4](https://github.com/thi-ng/umbrella/commit/cd69dd4))
- BREAKING CHANGE: update SubdivKernel interface & impls
  - update `SubdivKernel` fns to support both open/closed versions
  - merge/rename open/closed kernels & remove obsolete
    - SUBDIV_MID
    - SUBDIV_THIRDS
    - SUBDIV_CHAIKIN
    - SUBDIV_CUBIC
  - add SUBDIV_DLG kernel
- update subdivide() signature ([25576ca](https://github.com/thi-ng/umbrella/commit/25576ca))
- BREAKING CHANGE: update subdivide() signature
  - only accept kernels as array
  - add `closed` arg/flag

#### 🚀 Features

- add SUBDIV_DISPLACE higher-order kernel ([7655e50](https://github.com/thi-ng/umbrella/commit/7655e50))
- add support for passing multiple kernels to subdivide() ([03c5e54](https://github.com/thi-ng/umbrella/commit/03c5e54))
  - update args to support multiple kernels as array
- update SUBDIV_DISPLACE ([a75f37c](https://github.com/thi-ng/umbrella/commit/a75f37c))
  - update displace config to allow specifying normalized split positions
  - add/update docs & example

#### ♻️ Refactoring

- update SUBDIV_DISPLACE, internal refactoring ([3e84ba8](https://github.com/thi-ng/umbrella/commit/3e84ba8))

### [2.1.86](https://github.com/thi-ng/umbrella/tree/@thi.ng/geom-subdiv-curve@2.1.86) (2023-11-09)

#### ♻️ Refactoring

- update all tests (packages A-S) ([e3085e4](https://github.com/thi-ng/umbrella/commit/e3085e4))

## [2.1.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/geom-subdiv-curve@2.1.0) (2021-11-17)

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

### [2.0.9](https://github.com/thi-ng/umbrella/tree/@thi.ng/geom-subdiv-curve@2.0.9) (2021-11-10)

#### ♻️ Refactoring

- update all countdown loops ([a5f374b](https://github.com/thi-ng/umbrella/commit/a5f374b))

### [2.0.1](https://github.com/thi-ng/umbrella/tree/@thi.ng/geom-subdiv-curve@2.0.1) (2021-10-13)

#### ♻️ Refactoring

- update imports in all pkgs ([5fa2b6f](https://github.com/thi-ng/umbrella/commit/5fa2b6f))
  - add .js suffix for all relative imports
- update imports in all tests/pkgs ([effd591](https://github.com/thi-ng/umbrella/commit/effd591))

# [2.0.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/geom-subdiv-curve@2.0.0) (2021-10-12)

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
- update imports ([a647d4d](https://github.com/thi-ng/umbrella/commit/a647d4d))
- update imports (transducers) ([25b674f](https://github.com/thi-ng/umbrella/commit/25b674f))

### [0.1.67](https://github.com/thi-ng/umbrella/tree/@thi.ng/geom-subdiv-curve@0.1.67) (2020-12-07)

#### ♻️ Refactoring

- update type-only imports in various tests/pkgs ([3fd9c24](https://github.com/thi-ng/umbrella/commit/3fd9c24))
- update type-only imports in remaining pkgs ([b22aa30](https://github.com/thi-ng/umbrella/commit/b22aa30))

### [0.1.63](https://github.com/thi-ng/umbrella/tree/@thi.ng/geom-subdiv-curve@0.1.63) (2020-09-22)

#### ♻️ Refactoring

- update MID_OPEN, THIRDS_OPEN ([933920d](https://github.com/thi-ng/umbrella/commit/933920d))
- update subdivide() ([be79f2e](https://github.com/thi-ng/umbrella/commit/be79f2e))
  - use mapcatIndexed() to simplify composed xform

### [0.1.30](https://github.com/thi-ng/umbrella/tree/@thi.ng/geom-subdiv-curve@0.1.30) (2020-02-25)

#### ♻️ Refactoring

- update imports ([ccc39e1](https://github.com/thi-ng/umbrella/commit/ccc39e1))

### [0.1.26](https://github.com/thi-ng/umbrella/tree/@thi.ng/geom-subdiv-curve@0.1.26) (2019-11-09)

#### ♻️ Refactoring

- update wrapSides/tween call sites in various pkgs ([ee8200c](https://github.com/thi-ng/umbrella/commit/ee8200c))
