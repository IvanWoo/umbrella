# Change Log

- **Last updated**: 2024-08-10T15:03:07Z
- **Generator**: [thi.ng/monopub](https://thi.ng/monopub)

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org/) for commit guidelines.

**Note:** Unlisted _patch_ versions only involve non-code or otherwise excluded changes
and/or version bumps of transitive dependencies.

## [0.7.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/rdom-components@0.7.0) (2024-07-08)

#### 🚀 Features

- add verticalRuler() ([00e848f](https://github.com/thi-ng/umbrella/commit/00e848f))

### [0.6.59](https://github.com/thi-ng/umbrella/tree/@thi.ng/rdom-components@0.6.59) (2024-02-22)

#### ♻️ Refactoring

- update object destructuring in all pkgs & examples ([f36aeb0](https://github.com/thi-ng/umbrella/commit/f36aeb0))

### [0.6.33](https://github.com/thi-ng/umbrella/tree/@thi.ng/rdom-components@0.6.33) (2023-11-09)

#### ♻️ Refactoring

- update all tests (packages A-S) ([e3085e4](https://github.com/thi-ng/umbrella/commit/e3085e4))

### [0.6.6](https://github.com/thi-ng/umbrella/tree/@thi.ng/rdom-components@0.6.6) (2023-08-04)

#### ♻️ Refactoring

- update `identity` usage in various pkgs ([b6db053](https://github.com/thi-ng/umbrella/commit/b6db053))

## [0.6.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/rdom-components@0.6.0) (2023-04-08)

#### 🚀 Features

- add staticDropdownAlt(), add docs ([0f1b922](https://github.com/thi-ng/umbrella/commit/0f1b922))

#### 🩹 Bug fixes

- update dropdown args & attrib handling ([f2bd62b](https://github.com/thi-ng/umbrella/commit/f2bd62b))
  - update static/dynamicDropdown()
  - allow user attribs to supply onchange handler

## [0.5.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/rdom-components@0.5.0) (2022-07-12)

#### 🚀 Features

- update dropdown generics ([11809c7](https://github.com/thi-ng/umbrella/commit/11809c7))

## [0.4.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/rdom-components@0.4.0) (2021-11-17)

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

### [0.3.1](https://github.com/thi-ng/umbrella/tree/@thi.ng/rdom-components@0.3.1) (2021-10-13)

#### ♻️ Refactoring

- update imports in all pkgs ([5fa2b6f](https://github.com/thi-ng/umbrella/commit/5fa2b6f))
  - add .js suffix for all relative imports
- update imports in all tests/pkgs ([effd591](https://github.com/thi-ng/umbrella/commit/effd591))

## [0.3.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/rdom-components@0.3.0) (2021-10-12)

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
- update imports (transducers) ([2fd7619](https://github.com/thi-ng/umbrella/commit/2fd7619))

## [0.2.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/rdom-components@0.2.0) (2021-08-04)

#### 🚀 Features

- add input components ([fb390c1](https://github.com/thi-ng/umbrella/commit/fb390c1))
  - add inputNumeric()
  - add inputVector(), inputVectorCoord()
- add staticRadio() component ([ff3d1c4](https://github.com/thi-ng/umbrella/commit/ff3d1c4))

#### ♻️ Refactoring

- update arg types ([0633175](https://github.com/thi-ng/umbrella/commit/0633175))
  - switch to `ISubscription` for args
  - reuse $inputNum handler in inputNumeric
  - make $option `selected` attrib dynamic

### [0.1.18](https://github.com/thi-ng/umbrella/tree/@thi.ng/rdom-components@0.1.18) (2020-12-07)

#### ♻️ Refactoring

- update type-only imports ([2037326](https://github.com/thi-ng/umbrella/commit/2037326))

### [0.1.3](https://github.com/thi-ng/umbrella/tree/@thi.ng/rdom-components@0.1.3) (2020-07-17)

#### ♻️ Refactoring

- update attribs (tabs, iconbt) ([d8d478f](https://github.com/thi-ng/umbrella/commit/d8d478f))

### [0.1.2](https://github.com/thi-ng/umbrella/tree/@thi.ng/rdom-components@0.1.2) (2020-07-09)

#### 🩹 Bug fixes

- sub handling in accord/tabs ([6b51fd2](https://github.com/thi-ng/umbrella/commit/6b51fd2))
  - retain original `src` sub

## [0.1.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/rdom-components@0.1.0) (2020-07-08)

#### 🚀 Features

- import as new pkg (MBP2010 version) ([b7f72b6](https://github.com/thi-ng/umbrella/commit/b7f72b6))
