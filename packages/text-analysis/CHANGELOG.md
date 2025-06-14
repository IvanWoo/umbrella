# Change Log

- **Last updated**: 2025-06-14T20:56:27Z
- **Generator**: [thi.ng/monopub](https://thi.ng/monopub)

All notable changes to this project will be documented in this file.
Only versions published since **2022-01-01** are listed here.
Please consult the Git history for older version information.
See [Conventional Commits](https://conventionalcommits.org/) for commit guidelines.

**Note:** Unlisted _patch_ versions only involve non-code or otherwise excluded changes
and/or version bumps of transitive dependencies.

## [0.2.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/text-analysis@0.2.0) (2025-06-14)

#### 🚀 Features

- add/migrate refactored tf-idf functions ([d311acc](https://github.com/thi-ng/umbrella/commit/d311acc))
- add/update vocab & vector encoding helpers, restructure ([9e4f60c](https://github.com/thi-ng/umbrella/commit/9e4f60c))
- add filterDocsIDF() ([f682b58](https://github.com/thi-ng/umbrella/commit/f682b58))
- add k-mean clustering fns ([3533843](https://github.com/thi-ng/umbrella/commit/3533843))

#### ♻️ Refactoring

- update imports/exports ([a44be87](https://github.com/thi-ng/umbrella/commit/a44be87))

## [0.1.0](https://github.com/thi-ng/umbrella/tree/@thi.ng/text-analysis@0.1.0) (2025-06-09)

#### 🚀 Features

- import as new pkg ([89fe9bb](https://github.com/thi-ng/umbrella/commit/89fe9bb))
  - add re-exports from transducers/vectors pkgs
  - add porter stemmer, contractions & stop words from old [@thi.ng/notes](https://github.com/thi-ng/umbrella/tree/main/packages/notes) repo
    - add porter fixtures
  - update defVocab() to use [@thi.ng/bidir-index](https://github.com/thi-ng/umbrella/tree/main/packages/bidir-index)
  - add sparse vector support
  - add/port cosine/jaccard similarities from vectors/sparse pkgs
  - add doc strings & examples
