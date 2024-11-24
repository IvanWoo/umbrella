# Change Log

- **Last updated**: 2024-11-24T18:15:49Z
- **Generator**: [thi.ng/monopub](https://thi.ng/monopub)

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org/) for commit guidelines.

**Note:** Unlisted _patch_ versions only involve non-code or otherwise excluded changes
and/or version bumps of transitive dependencies.

### [1.0.41](https://github.com/thi-ng/umbrella/tree/@thi.ng/scenegraph@1.0.41) (2024-04-20)

#### ♻️ Refactoring

- update type usage ([6bf3ee1](https://github.com/thi-ng/umbrella/commit/6bf3ee1))

# [1.0.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/scenegraph@1.0.0) (2023-11-12)

#### 🛑 Breaking changes

- update ISceneNode, ANode ([a2a2694](https://github.com/thi-ng/umbrella/commit/a2a2694))
- BREAKING CHANGE: add child ops to ISceneNode interface
  - update ANode.deleteChild()
  - simplify Node2/3 impls

### [0.6.32](https://github.com/thi-ng/umbrella/tree/@thi.ng/scenegraph@0.6.32) (2023-11-09)

#### ♻️ Refactoring

- update all tests (packages A-S) ([e3085e4](https://github.com/thi-ng/umbrella/commit/e3085e4))

## [0.6.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/scenegraph@0.6.0) (2023-04-19)

#### 🚀 Features

- add ANode.mapLocalPointToGlobal(), update 2D/3D impls ([b1d30ef](https://github.com/thi-ng/umbrella/commit/b1d30ef))

## [0.5.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/scenegraph@0.5.0) (2021-11-17)

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

### [0.4.9](https://github.com/thi-ng/umbrella/tree/@thi.ng/scenegraph@0.4.9) (2021-11-10)

#### ♻️ Refactoring

- update all countdown loops ([a5f374b](https://github.com/thi-ng/umbrella/commit/a5f374b))

### [0.4.1](https://github.com/thi-ng/umbrella/tree/@thi.ng/scenegraph@0.4.1) (2021-10-13)

#### ♻️ Refactoring

- update imports in all pkgs ([5fa2b6f](https://github.com/thi-ng/umbrella/commit/5fa2b6f))
  - add .js suffix for all relative imports
- update imports in all tests/pkgs ([effd591](https://github.com/thi-ng/umbrella/commit/effd591))

## [0.4.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/scenegraph@0.4.0) (2021-10-12)

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
- update deps & imports in various pkgs ([e1cf29e](https://github.com/thi-ng/umbrella/commit/e1cf29e))
  - largely related to recent updates/restructuring of these packages:
    - api
    - defmulti
    - errors
    - logger

### [0.3.11](https://github.com/thi-ng/umbrella/tree/@thi.ng/scenegraph@0.3.11) (2020-12-07)

#### ♻️ Refactoring

- update type-only imports in various tests/pkgs ([3fd9c24](https://github.com/thi-ng/umbrella/commit/3fd9c24))
- update type-only imports ([3b2eb85](https://github.com/thi-ng/umbrella/commit/3b2eb85))

### [0.3.7](https://github.com/thi-ng/umbrella/tree/@thi.ng/scenegraph@0.3.7) (2020-09-22)

#### ♻️ Refactoring

- update toHiccup() impls ([1bdc0f1](https://github.com/thi-ng/umbrella/commit/1bdc0f1))

## [0.3.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/scenegraph@0.3.0) (2020-07-28)

#### 🚀 Features

- add ICopy impls for Node2/3 ([fd6ffdb](https://github.com/thi-ng/umbrella/commit/fd6ffdb))

## [0.2.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/scenegraph@0.2.0) (2020-07-17)

#### 🚀 Features

- update `.toHiccuo()` impls, update .scale type ([2f0a3cc](https://github.com/thi-ng/umbrella/commit/2f0a3cc))
  - add support for opt ctx arg
  - if body is fn, call fn w/ ctx
  - update `scale` type to `Vec | number` (to simplify uniform scaling)
  - add/update doc strings

### [0.1.3](https://github.com/thi-ng/umbrella/tree/@thi.ng/scenegraph@0.1.3) (2020-02-25)

#### ♻️ Refactoring

- update mapGlobal/LocalPoint return types ([0275af0](https://github.com/thi-ng/umbrella/commit/0275af0))
  - allow potentially `undefined` results (e.g. if uninvertible matrix)
- update imports ([0acdfc3](https://github.com/thi-ng/umbrella/commit/0acdfc3))
