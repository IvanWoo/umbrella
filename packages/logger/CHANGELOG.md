# Change Log

- **Last updated**: 2025-01-21T15:46:53Z
- **Generator**: [thi.ng/monopub](https://thi.ng/monopub)

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org/) for commit guidelines.

**Note:** Unlisted _patch_ versions only involve non-code or otherwise excluded changes
and/or version bumps of transitive dependencies.

### [3.0.27](https://github.com/thi-ng/umbrella/tree/@thi.ng/logger@3.0.27) (2025-01-14)

#### ♻️ Refactoring

- use optional chaining & nullish coalescing ([c5a0a13](https://github.com/thi-ng/umbrella/commit/c5a0a13))

# [3.0.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/logger@3.0.0) (2024-02-16)

#### 🛑 Breaking changes

- update/extend ILogger interface ([887e839](https://github.com/thi-ng/umbrella/commit/887e839))
- BREAKING CHANGE: update/extend ILogger interface to support
  hierarchies of loggers
  - update ALogger impl, update ctor
  - update ConsoleLogger, MemoryLogger, StreamLogger classes
  - update NULL_LOGGER
  - add ROOT logger and ProxyLogger class
  - add/update docs
  - update tests
  - update pkg exports

## [2.1.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/logger@2.1.0) (2023-12-18)

#### 🚀 Features

- add StreamLogger (for Node/Bun) ([d4c8fe2](https://github.com/thi-ng/umbrella/commit/d4c8fe2))

# [2.0.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/logger@2.0.0) (2023-11-24)

#### 🛑 Breaking changes

- add ILogger.enabled() predicate, update impls ([d768486](https://github.com/thi-ng/umbrella/commit/d768486))
- BREAKING CHANGE: add ILogger.enabled() predicate

### [1.4.23](https://github.com/thi-ng/umbrella/tree/@thi.ng/logger@1.4.23) (2023-11-09)

#### ♻️ Refactoring

- update all tests (packages A-S) ([e3085e4](https://github.com/thi-ng/umbrella/commit/e3085e4))

## [1.4.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/logger@1.4.0) (2022-10-04)

#### 🚀 Features

- add lazy arg evaluation ([21ead9c](https://github.com/thi-ng/umbrella/commit/21ead9c))
  - add internal expandArgs() helper to expand any fn message args
  - update ConsoleLogger & MemoryLogger

## [1.3.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/logger@1.3.0) (2022-09-21)

#### 🚀 Features

- update MemoryLogger ([03616b5](https://github.com/thi-ng/umbrella/commit/03616b5))
  - add .clear() & .messages() methods
  - update pkg meta

## [1.2.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/logger@1.2.0) (2022-08-04)

#### 🚀 Features

- add MemoryLogger, ALogger ([b2cd409](https://github.com/thi-ng/umbrella/commit/b2cd409))
  - extract abstract ALogger
  - add MemoryLogger
  - refactor ConsoleLogger
  - add LogEntry tuple type (migrated from [@thi.ng/rstream-log](https://github.com/thi-ng/umbrella/tree/main/packages/rstream-log))
  - add tests

## [1.1.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/logger@1.1.0) (2021-11-17)

#### 🚀 Features

- Using workspaces for local tools ([bf7a404](https://github.com/thi-ng/umbrella/commit/bf7a404))
  Improving the overall build ergonomics
  - introduced a tools workspaces
  - imported it in all needed packages/examples
  - inclusive project root

### [1.0.1](https://github.com/thi-ng/umbrella/tree/@thi.ng/logger@1.0.1) (2021-10-13)

#### ♻️ Refactoring

- update imports in all pkgs ([5fa2b6f](https://github.com/thi-ng/umbrella/commit/5fa2b6f))
  - add .js suffix for all relative imports

## [0.1.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/logger@0.1.0) (2021-10-12)

#### 🚀 Features

- extract as new pkg ([e0399a8](https://github.com/thi-ng/umbrella/commit/e0399a8))
  - migrate logging related types & classes from [@thi.ng/api](https://github.com/thi-ng/umbrella/tree/main/packages/api)
