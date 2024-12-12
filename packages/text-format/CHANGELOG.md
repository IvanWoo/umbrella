# Change Log

- **Last updated**: 2024-12-12T10:11:58Z
- **Generator**: [thi.ng/monopub](https://thi.ng/monopub)

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org/) for commit guidelines.

**Note:** Unlisted _patch_ versions only involve non-code or otherwise excluded changes
and/or version bumps of transitive dependencies.

### [2.2.6](https://github.com/thi-ng/umbrella/tree/@thi.ng/text-format@2.2.6) (2024-06-21)

#### ♻️ Refactoring

- enforce uniform naming convention of internal functions ([56992b2](https://github.com/thi-ng/umbrella/commit/56992b2))

## [2.2.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/text-format@2.2.0) (2024-03-27)

#### 🚀 Features

- add FMT_HTML_MCSS, update memoizations ([55e85f0](https://github.com/thi-ng/umbrella/commit/55e85f0))
- add FMT_HTML_CSS_VARS() formatter ([277155e](https://github.com/thi-ng/umbrella/commit/277155e))

## [2.1.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/text-format@2.1.0) (2024-02-19)

#### 🚀 Features

- add common ANSI escape seqs ([11231de](https://github.com/thi-ng/umbrella/commit/11231de))

# [2.0.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/text-format@2.0.0) (2023-12-18)

#### 🛑 Breaking changes

- update StringFormat interface ([c04c723](https://github.com/thi-ng/umbrella/commit/c04c723))
- BREAKING CHANGE: add StringFormat.format()
  - update all existing StringFormat impls
  - add FormatPresets.format to expose ref to underlying StringFormat

### [1.4.16](https://github.com/thi-ng/umbrella/tree/@thi.ng/text-format@1.4.16) (2023-11-09)

#### ♻️ Refactoring

- update all tests (packages A-S) ([e3085e4](https://github.com/thi-ng/umbrella/commit/e3085e4))

## [1.4.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/text-format@1.4.0) (2023-03-17)

#### 🚀 Features

- add PRESET_NONE ([28e4db4](https://github.com/thi-ng/umbrella/commit/28e4db4))

## [1.3.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/text-format@1.3.0) (2023-03-16)

#### 🚀 Features

- add PRESET_ANSI16, update PRESETS_TPL ([33a69cc](https://github.com/thi-ng/umbrella/commit/33a69cc))
  - add bg colors to PRESETS_TPL (and therefore `defFormatPresets()`)
  - add PRESET_ANSI16 to reduce boilerplate

## [1.2.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/text-format@1.2.0) (2022-06-28)

#### 🚀 Features

- add format() / formatNone() ([41aac17](https://github.com/thi-ng/umbrella/commit/41aac17))

## [1.1.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/text-format@1.1.0) (2021-11-17)

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

### [1.0.1](https://github.com/thi-ng/umbrella/tree/@thi.ng/text-format@1.0.1) (2021-10-13)

#### ♻️ Refactoring

- update imports in all pkgs ([5fa2b6f](https://github.com/thi-ng/umbrella/commit/5fa2b6f))
  - add .js suffix for all relative imports
- update imports in all tests/pkgs ([effd591](https://github.com/thi-ng/umbrella/commit/effd591))

## [0.1.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/text-format@0.1.0) (2021-10-12)

#### 🚀 Features

- extract as new pkg ([8c28655](https://github.com/thi-ng/umbrella/commit/8c28655))
  - extract formatting consts & functions from [@thi.ng/text-canvas](https://github.com/thi-ng/umbrella/tree/main/packages/text-canvas)
