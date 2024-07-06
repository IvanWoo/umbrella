# Change Log

- **Last updated**: 2024-07-06T12:02:19Z
- **Generator**: [thi.ng/monopub](https://thi.ng/monopub)

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org/) for commit guidelines.

**Note:** Unlisted _patch_ versions only involve non-code or otherwise excluded changes
and/or version bumps of transitive dependencies.

### [3.0.24](https://github.com/thi-ng/umbrella/tree/@thi.ng/text-canvas@3.0.24) (2024-06-21)

#### ♻️ Refactoring

- enforce uniform naming convention of internal functions ([56992b2](https://github.com/thi-ng/umbrella/commit/56992b2))

### [3.0.3](https://github.com/thi-ng/umbrella/tree/@thi.ng/text-canvas@3.0.3) (2024-02-22)

#### ♻️ Refactoring

- update object destructuring in all pkgs & examples ([f36aeb0](https://github.com/thi-ng/umbrella/commit/f36aeb0))

# [3.0.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/text-canvas@3.0.0) (2024-02-19)

#### 🛑 Breaking changes

- add plotting, additive blending/blitting, refactor bar chart fns ([7cd6d41](https://github.com/thi-ng/umbrella/commit/7cd6d41))
- BREAKING CHANGE: swap naming of barChartH/V fns, update args for blit()/blitMask()
  - swap naming of barChartH/V fns:
    - barChartHLines/Str() <=> barChartVLines/Str()
  - add plotBarsV() multi-plot function
  - add blitBarsV() fn w/ support for custom blending fns
    - add blendBarsVAdd() additive blending fn
    - add BLEND_ADD lookup table for additive blending using ANSI16 colors
  - update arg order of blit()/blitMask() fns
  - add Canvas.empty(), Canvas.clear() fns

#### ♻️ Refactoring

- unify plotting function naming ([cb275ae](https://github.com/thi-ng/umbrella/commit/cb275ae))
  - plotBarsV() => plotBarChartV()
  - lineChart() => plotLineChart()
  - migrate line chart fns to plot.ts

### [2.6.17](https://github.com/thi-ng/umbrella/tree/@thi.ng/text-canvas@2.6.17) (2023-11-09)

#### ♻️ Refactoring

- update all tests (packages A-S) ([e3085e4](https://github.com/thi-ng/umbrella/commit/e3085e4))

## [2.6.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/text-canvas@2.6.0) (2023-08-24)

#### 🚀 Features

- add lineChart() & lineChartStr() ([097e00c](https://github.com/thi-ng/umbrella/commit/097e00c))

#### ♻️ Refactoring

- update bar chart min/max handling ([e45247d](https://github.com/thi-ng/umbrella/commit/e45247d))
  - auto-compute value range if not specified

## [2.5.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/text-canvas@2.5.0) (2023-08-14)

#### 🚀 Features

- add imageRawFmtOnly() ([1042a40](https://github.com/thi-ng/umbrella/commit/1042a40))

### [2.4.40](https://github.com/thi-ng/umbrella/tree/@thi.ng/text-canvas@2.4.40) (2023-03-27)

#### ♻️ Refactoring

- update remaining type imports (TS5.0) in various pkgs ([e0edf26](https://github.com/thi-ng/umbrella/commit/e0edf26))

## [2.4.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/text-canvas@2.4.0) (2022-07-08)

#### 🚀 Features

- add blitMask() & docs ([a6cf74a](https://github.com/thi-ng/umbrella/commit/a6cf74a))
- add clearFormat() ([83f04cc](https://github.com/thi-ng/umbrella/commit/83f04cc))
- add canvasFromText(), update Canvas ([e8baa0b](https://github.com/thi-ng/umbrella/commit/e8baa0b))
  - update deps
  - add canvasFromText() factory fn
  - add ICopy impl for Canvas

### [2.3.8](https://github.com/thi-ng/umbrella/tree/@thi.ng/text-canvas@2.3.8) (2022-06-28)

#### ♻️ Refactoring

- update/simplify formatCanvas() ([e2f3ab9](https://github.com/thi-ng/umbrella/commit/e2f3ab9))
  - re-use new single-line formatting fns from [@thi.ng/text-format](https://github.com/thi-ng/umbrella/tree/main/packages/text-format)

## [2.3.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/text-canvas@2.3.0) (2022-04-07)

#### 🚀 Features

- update Canvas.setAt() ([7df033f](https://github.com/thi-ng/umbrella/commit/7df033f))
  - allow pixel value to be number or string

## [2.2.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/text-canvas@2.2.0) (2021-11-17)

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

### [2.1.2](https://github.com/thi-ng/umbrella/tree/@thi.ng/text-canvas@2.1.2) (2021-11-10)

#### ♻️ Refactoring

- add IGrid2DMixin impl ([b20f99f](https://github.com/thi-ng/umbrella/commit/b20f99f))
- update all countdown loops ([a5f374b](https://github.com/thi-ng/umbrella/commit/a5f374b))

### [2.1.1](https://github.com/thi-ng/umbrella/tree/@thi.ng/text-canvas@2.1.1) (2021-11-04)

#### ♻️ Refactoring

- apply [@thi.ng/pixel](https://github.com/thi-ng/umbrella/tree/main/packages/pixel) changes ([abf29c1](https://github.com/thi-ng/umbrella/commit/abf29c1))

## [2.1.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/text-canvas@2.1.0) (2021-11-03)

#### 🚀 Features

- add IGrid2D impl, minor updates ([6e51c11](https://github.com/thi-ng/umbrella/commit/6e51c11))

### [2.0.1](https://github.com/thi-ng/umbrella/tree/@thi.ng/text-canvas@2.0.1) (2021-10-13)

#### ♻️ Refactoring

- update imports in all pkgs ([5fa2b6f](https://github.com/thi-ng/umbrella/commit/5fa2b6f))
  - add .js suffix for all relative imports
- update imports in all tests/pkgs ([effd591](https://github.com/thi-ng/umbrella/commit/effd591))

# [2.0.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/text-canvas@2.0.0) (2021-10-12)

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
- update to use [@thi.ng/text-format](https://github.com/thi-ng/umbrella/tree/main/packages/text-format) ([aa67a5a](https://github.com/thi-ng/umbrella/commit/aa67a5a))
- BREAKING CHANGE: migrate formatting consts/functions to new pkg
  - see [8c28655d1](https://github.com/thi-ng/umbrella/commit/8c28655d1) for details
  - rename `toString()` => `formatCanvas()`
  - update dependencies

#### ♻️ Refactoring

- update all tests in _all_ pkgs ([8b582bc](https://github.com/thi-ng/umbrella/commit/8b582bc))
  - update all to use [@thi.ng/testament](https://github.com/thi-ng/umbrella/tree/main/packages/testament)
- update all test stubs ([f2d6d53](https://github.com/thi-ng/umbrella/commit/f2d6d53))
- update imports ([138571a](https://github.com/thi-ng/umbrella/commit/138571a))
- update imports (transducers) ([a5a1b2d](https://github.com/thi-ng/umbrella/commit/a5a1b2d))
- update deps & imports in various pkgs ([e1cf29e](https://github.com/thi-ng/umbrella/commit/e1cf29e))
  - largely related to recent updates/restructuring of these packages:
    - api
    - defmulti
    - errors
    - logger
- minor pkg restructure ([7eb054a](https://github.com/thi-ng/umbrella/commit/7eb054a))

## [1.1.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/text-canvas@1.1.0) (2021-08-13)

#### 🚀 Features

- add image -> braille functions ([8201ad2](https://github.com/thi-ng/umbrella/commit/8201ad2))

### [0.7.14](https://github.com/thi-ng/umbrella/tree/@thi.ng/text-canvas@0.7.14) (2021-08-07)

#### 🩹 Bug fixes

- fix ImageOpts.chars type ([0ae7855](https://github.com/thi-ng/umbrella/commit/0ae7855))

### [0.7.4](https://github.com/thi-ng/umbrella/tree/@thi.ng/text-canvas@0.7.4) (2021-03-30)

#### 🩹 Bug fixes

- fix FMT_NONE suffix, export format preset types ([e7a9ff7](https://github.com/thi-ng/umbrella/commit/e7a9ff7))

## [0.7.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/text-canvas@0.7.0) (2021-03-26)

#### 🚀 Features

- update table cell wordwrap handling ([f19f925](https://github.com/thi-ng/umbrella/commit/f19f925))
  - add per-cell option to disable word wrapping
    (useful for when table cell contains a chart/image)

## [0.6.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/text-canvas@0.6.0) (2021-03-24)

#### 🚀 Features

- add FMT_ANSI565, update StringFormat ([3bf5b47](https://github.com/thi-ng/umbrella/commit/3bf5b47))
  - add `FMT_ANSI565` (16bit RGB565) string formatter and supporting functions
  - merge ansi.ts & html.ts => format.ts
  - add `StringFormat.zero` to indicate if a zero format ID should NOT
    be skipped during formatting
  - update/fix `toString()` to consider new `zero` setting
  - update `FMT_ANSI256`, `FMT_HTML565`
- add imageCanvas/String565() fns ([6e254eb](https://github.com/thi-ng/umbrella/commit/6e254eb))

#### 🩹 Bug fixes

- fix format start/end handling in toString() ([5100222](https://github.com/thi-ng/umbrella/commit/5100222))

### [0.5.1](https://github.com/thi-ng/umbrella/tree/@thi.ng/text-canvas@0.5.1) (2021-03-24)

#### ♻️ Refactoring

- add barChart[HV]Lines() fns ([44959ea](https://github.com/thi-ng/umbrella/commit/44959ea))
  - expose fns which return string[], useful as interim results

## [0.5.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/text-canvas@0.5.0) (2021-03-24)

#### 🚀 Features

- add hardwrapped text support ([4e171db](https://github.com/thi-ng/umbrella/commit/4e171db))
  - update table & textBox, textColumn, wordWrappedLines
  - update TableOpts, RawCell
- add FMT_NONE dummy formatter ([0b1f3bd](https://github.com/thi-ng/umbrella/commit/0b1f3bd))

#### ♻️ Refactoring

- replace word wrapping fns ([ce124de](https://github.com/thi-ng/umbrella/commit/ce124de))
  - remove recently added word wrapping fns again, favor re-using
    the new & improved fns from [@thi.ng/strings](https://github.com/thi-ng/umbrella/tree/main/packages/strings) pkg
  - simplify `textColumn()`

### [0.4.5](https://github.com/thi-ng/umbrella/tree/@thi.ng/text-canvas@0.4.5) (2021-02-20)

#### ♻️ Refactoring

- use clamp0() ([940d90b](https://github.com/thi-ng/umbrella/commit/940d90b))

### [0.4.1](https://github.com/thi-ng/umbrella/tree/@thi.ng/text-canvas@0.4.1) (2021-01-10)

#### 🩹 Bug fixes

- fix FMT_ANSI256 bg bitshift ([b50a0f9](https://github.com/thi-ng/umbrella/commit/b50a0f9))

## [0.4.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/text-canvas@0.4.0) (2021-01-05)

#### 🚀 Features

- add formatter fns/utils ([fb4470d](https://github.com/thi-ng/umbrella/commit/fb4470d))

## [0.3.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/text-canvas@0.3.0) (2021-01-02)

#### 🚀 Features

- add ANSI256 & HTML_565 formatters ([1f2d35b](https://github.com/thi-ng/umbrella/commit/1f2d35b))
- add imageRaw(), update image() ([34037ad](https://github.com/thi-ng/umbrella/commit/34037ad))
  - add imageRaw() for direct use of pixels as format data (e.g. for FMT_HTML_565)
  - update ImageOpts.format to allow functions
  - update Canvas ctor, initial clear value to include format

#### ♻️ Refactoring

- extract imgRect() helper ([ea59f57](https://github.com/thi-ng/umbrella/commit/ea59f57))

### [0.2.35](https://github.com/thi-ng/umbrella/tree/@thi.ng/text-canvas@0.2.35) (2020-12-07)

#### ♻️ Refactoring

- update type-only imports ([2ffdedf](https://github.com/thi-ng/umbrella/commit/2ffdedf))

### [0.2.30](https://github.com/thi-ng/umbrella/tree/@thi.ng/text-canvas@0.2.30) (2020-09-13)

#### ♻️ Refactoring

- update deps, imports, use new Fn types ([d311d5d](https://github.com/thi-ng/umbrella/commit/d311d5d))

### [0.2.3](https://github.com/thi-ng/umbrella/tree/@thi.ng/text-canvas@0.2.3) (2020-04-05)

#### ♻️ Refactoring

- switch to non-const enums ([a9a7bbc](https://github.com/thi-ng/umbrella/commit/a9a7bbc))

## [0.2.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/text-canvas@0.2.0) (2020-03-01)

#### 🚀 Features

- add tableCanvas() ([13ee370](https://github.com/thi-ng/umbrella/commit/13ee370))

## [0.1.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/text-canvas@0.1.0) (2020-02-25)

#### 🚀 Features

- initial import as new pkg ([fd084bf](https://github.com/thi-ng/umbrella/commit/fd084bf))
- add wrappedText(), update draw fns & clip rect handling ([ba66aee](https://github.com/thi-ng/umbrella/commit/ba66aee))
  - beginClip() forms intersection rect with curr clip rect
  - consider clip rect for all draw fns
  - extract _line() fn for hline/vline()
- update StrokeStyle ([d5bdcc8](https://github.com/thi-ng/umbrella/commit/d5bdcc8))
- add bresenham line & circle fns, force int coords ([0587a66](https://github.com/thi-ng/umbrella/commit/0587a66))
- major update/rewrite, format support ([57a7487](https://github.com/thi-ng/umbrella/commit/57a7487))
  - use Uint32Array as backing buffer
  - add support for arbitrary format IDs (highest 16bit)
  - add configurable string formatting
  - add ANSI & HTML format presets
  - add color & format constants
  - re-org source files
- add textBox, update format enums & handling ([c922e14](https://github.com/thi-ng/umbrella/commit/c922e14))
- add withClip/Format/Style() HOFs ([369909c](https://github.com/thi-ng/umbrella/commit/369909c))
- add textLines(), wordWrappedLines() ([0f13fe2](https://github.com/thi-ng/umbrella/commit/0f13fe2))
- add derived style fns (horizontalOnly, verticalOnly) ([dc1cb05](https://github.com/thi-ng/umbrella/commit/dc1cb05))
- add table support & options ([8983ad6](https://github.com/thi-ng/umbrella/commit/8983ad6))
- add support for table cell format overrides ([8909ce0](https://github.com/thi-ng/umbrella/commit/8909ce0))
- add bar chart & image fns ([3130fe4](https://github.com/thi-ng/umbrella/commit/3130fe4))
- add blit(), getAt(), fix table() arg type ([b5c9eb4](https://github.com/thi-ng/umbrella/commit/b5c9eb4))
- add more border consts ([05247a0](https://github.com/thi-ng/umbrella/commit/05247a0))
- add canvas() factory fn ([3baeb31](https://github.com/thi-ng/umbrella/commit/3baeb31))
- add opt cell height config support ([d162a1c](https://github.com/thi-ng/umbrella/commit/d162a1c))
- add ImageOpts, update image(), add resize(), extract() ([73f941a](https://github.com/thi-ng/umbrella/commit/73f941a))
- add/update/rename consts, toString() ([254f3d7](https://github.com/thi-ng/umbrella/commit/254f3d7))
  - merge toString()/toFormattedString(), remove latter
- add inverted image draw opt ([08cb56a](https://github.com/thi-ng/umbrella/commit/08cb56a))
- add scrollV() ([135258e](https://github.com/thi-ng/umbrella/commit/135258e))

#### ♻️ Refactoring

- update/add style presets ([8609e8c](https://github.com/thi-ng/umbrella/commit/8609e8c))
- update imports ([4f87d2c](https://github.com/thi-ng/umbrella/commit/4f87d2c))
