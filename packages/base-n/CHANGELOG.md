# Change Log

- **Last updated**: 2024-11-10T17:11:51Z
- **Generator**: [thi.ng/monopub](https://thi.ng/monopub)

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org/) for commit guidelines.

**Note:** Unlisted _patch_ versions only involve non-code or otherwise excluded changes
and/or version bumps of transitive dependencies.

## [2.7.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/base-n@2.7.0) (2024-02-06)

#### 🚀 Features

- pkg restructure,separate decoder/encoder, add bases ([47e37bc](https://github.com/thi-ng/umbrella/commit/47e37bc))
  - extract BaseNDecoder/Encoder classes
  - add IBaseDecode/IBaseEncode interfaces
  - migrate chatsets to own files to help w/ treeshaking
  - add base10/26

## [2.6.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/base-n@2.6.0) (2024-01-26)

#### 🚀 Features

- add base83 chars & preset ([5e09baf](https://github.com/thi-ng/umbrella/commit/5e09baf))
  - add `B83_CHARS` and `BASE83`

#### ⏱ Performance improvements

- memoize value padding (encoding w/ size) ([62ccf80](https://github.com/thi-ng/umbrella/commit/62ccf80))
  - migrate padding into BaseN class
  - add BaseN.clear() for clearing memoization cache

### [2.5.11](https://github.com/thi-ng/umbrella/tree/@thi.ng/base-n@2.5.11) (2023-08-14)

#### ⏱ Performance improvements

- minor internal updates .encodeBigInt() ([43e9a7f](https://github.com/thi-ng/umbrella/commit/43e9a7f))

### [2.5.10](https://github.com/thi-ng/umbrella/tree/@thi.ng/base-n@2.5.10) (2023-08-12)

#### ♻️ Refactoring

- remove deps, minor internal updates ([c675cba](https://github.com/thi-ng/umbrella/commit/c675cba))

## [2.5.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/base-n@2.5.0) (2023-03-17)

#### 🚀 Features

- add BASE16/32/58 aliases for default impls ([7a8ae1f](https://github.com/thi-ng/umbrella/commit/7a8ae1f))

## [2.4.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/base-n@2.4.0) (2023-02-10)

#### 🚀 Features

- add optional zero-padding for .encode() ([51ce75b](https://github.com/thi-ng/umbrella/commit/51ce75b))
  - update IBase encode method signatures
  - update BaseN encode impls
  - add tests

## [2.3.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/base-n@2.3.0) (2022-05-22)

#### 🚀 Features

- add BASE58_LC alt version ([755a2a7](https://github.com/thi-ng/umbrella/commit/755a2a7))

## [2.2.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/base-n@2.2.0) (2022-03-11)

#### 🚀 Features

- add octal support, export char strings ([0c0dac6](https://github.com/thi-ng/umbrella/commit/0c0dac6))

## [2.1.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/base-n@2.1.0) (2021-11-17)

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

### [2.0.7](https://github.com/thi-ng/umbrella/tree/@thi.ng/base-n@2.0.7) (2021-11-10)

#### ♻️ Refactoring

- update all countdown loops ([a5f374b](https://github.com/thi-ng/umbrella/commit/a5f374b))

### [2.0.1](https://github.com/thi-ng/umbrella/tree/@thi.ng/base-n@2.0.1) (2021-10-13)

#### ♻️ Refactoring

- update imports in all pkgs ([5fa2b6f](https://github.com/thi-ng/umbrella/commit/5fa2b6f))
  - add .js suffix for all relative imports
- update imports in all tests/pkgs ([effd591](https://github.com/thi-ng/umbrella/commit/effd591))

# [2.0.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/base-n@2.0.0) (2021-10-12)

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

### [1.0.5](https://github.com/thi-ng/umbrella/tree/@thi.ng/base-n@1.0.5) (2021-08-24)

#### 🩹 Bug fixes

- fix [#308](https://github.com/thi-ng/umbrella/issues/308), remove unintentional int cast ([27a0d7e](https://github.com/thi-ng/umbrella/commit/27a0d7e))
  - use Math.floor() in BaseN.encode() to avoid casting intermediate
    values to 32 bit int range

## [0.2.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/base-n@0.2.0) (2021-08-07)

#### 🚀 Features

- add BASE32_CROCKFORD preset ([7d1cad9](https://github.com/thi-ng/umbrella/commit/7d1cad9))

## [0.1.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/base-n@0.1.0) (2021-01-13)

#### 🚀 Features

- import as new pkg (MBP2010) ([f5763b3](https://github.com/thi-ng/umbrella/commit/f5763b3))
- add en/decodeBytes(), add BASE16_XX ([d6205d7](https://github.com/thi-ng/umbrella/commit/d6205d7))
