<!-- include ../../assets/tpl/header.md -->

<!-- toc -->

## About

{{pkg.description}}

Likely the most comprehensive vector library for TypeScript / JavaScript
currently available.

This package provides **over 875(!) largely code generated functions** and
supporting types to perform vector operations on fixed and arbitrary-length
vectors, both packed and strided (i.e. where individual vector components are
not successive array elements, for example in [SOA memory
layouts](https://en.wikipedia.org/wiki/AoS_and_SoA)).

Includes componentwise logic operations for boolean vectors, componentwise
comparisons for numeric vectors and componentwise binary ops for signed &
unsigned integer vectors.

### Features

- Small & fast: The vast majority of functions are code generated with
  fixed-sized versions not using any loops. Minified + gzipped, the entire
  package is ~11.8KB (though you'll hardly ever use all functions).
- Unified API: Any `ArrayLike` type can be used as vector containers (e.g. JS
  arrays, typed arrays, custom impls). Most functions are implemented as
  multi-methods, dispatching to any potentially optimized versions based on
  given vector arguments.
- Highly modular: Each function is defined in its own submodule / file. In
  addition to each generic multi-method base function, all fixed-length
  optimized versions are exported too. E.g. If
  [`add`](https://github.com/thi-ng/umbrella/tree/develop/packages/vectors/src/add.ts)
  performs vector addition on arbitrary-length vectors, `add2`, `add3`, `add4`
  are the optimized version for fixed-length vectors...
- Pluggable interface: The [`VecAPI`
  interface](https://docs.thi.ng/umbrella/vectors/interfaces/VecAPI.html)
  defines objects of the ~70 most common vector operations implemented for
  specific vector sizes. Using this interface simplifies performance-critical
  use cases & algorithms which target different dimensions (e.g. 2d/3d),
  but should use the avaiable size-optimized vector ops. See
  [`VEC2`](https://github.com/thi-ng/umbrella/tree/develop/packages/vectors/src/vec2-api.ts),
  [`VEC3`](https://github.com/thi-ng/umbrella/tree/develop/packages/vectors/src/vec3-api.ts)
  and
  [`VEC4`](https://github.com/thi-ng/umbrella/tree/develop/packages/vectors/src/vec4-api.ts)
- Extensible: Custom vector ops can be defined in a similar manner using the
  provided code generation helpers (see
  [vop.ts](https://github.com/thi-ng/umbrella/tree/develop/packages/vectors/src/vop.ts)
  and
  [emit.ts](https://github.com/thi-ng/umbrella/tree/develop/packages/vectors/src/compile/emit.ts)
  for details).
- Immutable by default: Each operation producing a vector result takes an output
  vector as first argument. If `null`, the vector given as 2nd argument will
  (usually) be used as output (i.e. for mutation).
- Strided vector support is handled via the lightweight
  [`Vec2/3/4`](https://github.com/thi-ng/umbrella/tree/develop/packages/vectors/src/vec2.ts)
  class wrappers and the
  [`gvec()`](https://github.com/thi-ng/umbrella/tree/develop/packages/vectors/src/gvec.ts)
  proxy (for generic, arbitrary-length vectors). These types behave like normal
  arrays (for read/write operations) and are also iterable. A subset of
  functions (suffixed with `S`, e.g.
  [`addS`](https://github.com/thi-ng/umbrella/tree/develop/packages/vectors/src/adds.ts)
  vs. `add`) also support striding without the need for extra class wrappers.
  This is handled via additional index and stride arguments for each
  input/output vector. These functions are only available for sizes 2 / 3 / 4,
  though.
- Random vector functions support the `IRandom` interface defined by
  [@thi.ng/random](https://github.com/thi-ng/umbrella/tree/develop/packages/random)
  to work with custom (P)RNGs. If omitted, the built-in `Math.random()` will be
  used.

Partially ported from [thi.ng/geom-clj](http://thi.ng/geom-clj) (Clojure) and
[c.thi.ng](http://c.thi.ng) (C11).

{{meta.status}}

### Breaking changes in v6.0.0

The introduction of seveveral standard [libc math
functions](https://www.cplusplus.com/reference/cmath/) to the
[@thi.ng/math](https://github.com/thi-ng/umbrella/tree/develop/packages/math)
package caused a behavior change of existing `fmod()` function. For symmetry
reasons the same changes have been applied to this package...

- swap `fmod()` ⇄ `mod()`, to align the latter with its GLSL counterpart
- the new `fmod()` has standard libc behavior (same as JS `%` operator)
- add `remainder()` with standard libc behavior

### Breaking changes in v3.0.0

- to avoid confusion, the arg order of `madd` and `maddN` functions have
  been updated to be compatible with the OpenCL `mad` function and to
  generally follow the expanded name, i.e. multiply-add:
  - `madd([], a, b, c)`: before `a + b * c`, now: `a * b + c`
  - `maddN([], a, b, n)` => `maddN([], a, n, b)` (i.e. `a * n + b`)
- rename `perpendicularLeft2` => `perpendicularCCW`
- rename `perpendicularRight2` => `perpendicularCW`
- rename `normalLeft2`/ `normalRight2` => `normalCCW` / `normalCW`

{{repo.supportPackages}}

{{repo.relatedPackages}}

{{meta.blogPosts}}

## Installation

{{pkg.install}}

{{pkg.size}}

## Dependencies

{{pkg.deps}}

{{repo.examples}}

## API

{{pkg.docs}}

### Basic usage

```ts
import * as v from "@thi.ng/vectors";

// immutable vector addition (1st arg is result)
v.add([], [1, 2, 3, 4], [10, 20, 30, 40]);
// [11, 22, 33, 44]

// mutable addition
// (if first arg (output) is null writes result to 2nd arg)
a = [1, 2, 3];
v.add(null, a, a);
// [2, 4, 6]

// multiply-add (o = a * b + c)
v.madd([], [10, 20], [0.5, 0.25], [1, 2]);
// [6, 7]

// multiply-add w/ scalar (o = a * n + b)
v.maddN([], [10, 20], 0.5, [1, 2]);
// [6, 12]

// scalar addition w/ arbitrary length & strided vector
v.addN([], gvec([0, 1, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0], 3, 1, 4), 10);
// [11, 12, 13]

// or operate on raw arrays directly...
// here the last 4 args define:
// out index, src index, out stride, src stride
v.addNS3(null, [0, 1, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0], 10, 1, 1, 4, 4)
// [0, 11, 0, 0, 0, 12, 0, 0, 0, 13, 0, 0, 0]

v.dist([1, 2], [100, 200]);
// 221.37072977247917

v.distManhattan([1, 2], [100, 200]);
// 297

v.distChebyshev([1, 2], [100, 200]);
// 198

v.mixN([], [1, 2], [10, 20], 0.5);
// [5.5, 11]

v.fromHomogeneous([], [100, 200, 0.5]);
// [200, 400]

v.swizzle4([], [1, 2], 1, 1, 0, 0);
// [ 2, 2, 1, 1 ]

v.hash([1, 2, 3])
// 2383338936
```

Using the
[`VecAPI`](https://docs.thi.ng/umbrella/vectors/interfaces/VecAPI.html)
implementation objects to use size-optimized vector ops in a pluggable manner
(this is in addition/alternative to using the standard set of polymorphic
functions for similar results).

```ts
import { VEC2, VEC3, type Vec, type VecAPI } from "@thi.ng/vectors";

interface Particle {
	pos: Vec;
	dir: Vec;
	targetDir: Vec;
	speed: number;
	turnSpeed: number;
}

const updateParticle = (p: Particle, { maddN, mixN, normalize }: VecAPI) => {
	// interpolate current direction toward target dir
	mixN(null, p.dir, p.targetDir, p.turnSpeed);
	// normalize direction
	normalize(null, p.dir);
	// add scaled direction to position (and store as new position)
	return maddN(p.pos, p.dir, p.speed, p.pos);
};

// 2d version
let p2d: Particle = {
	pos: [10, 20], dir: [0, 1], targetDir: [1, 0], speed: 5, turnSpeed: 0.1,
};

updateParticle(p2d, VEC2);
// [ 10.552, 24.969 ]

// 3d version
let p3d: Particle = {
	pos: [10, 20, 30], dir: [0, 1, 0], targetDir: [0, 0, 1], speed: 5, turnSpeed: 0.1,
};

updateParticle(p3d, VEC3);
// [ 10, 24.969, 30.552 ]
```

### Naming conventions

Wherever possible, each operation comes in different variations. All fixed size
versions use optimized, loop-free implementations.

| Suffix          | Description                            |
|-----------------|----------------------------------------|
| none            | arbitrary length vector arg(s)         |
| 2               | 2d vector arg(s)                       |
| 3               | 3d vector arg(s)                       |
| 4               | 4d vector arg(s)                       |
| N2              | 2d vector(s) & scalar                  |
| N3              | 3d vector(s) & scalar                  |
| N4              | 4d vector(s) & scalar                  |
| I               | arbitrary len, signed int vec          |
| U               | arbitrary len, unsigned int vec        |
| I2 / I3 / I4    | fixed size signed int vec              |
| U2 / U3 / U4    | fixed size signed int vec              |
| NI / NU         | arbitrary len, signed int vec & scalar |
| NI2 / NI3 / NI4 | fixed size signed int vec & scalar     |
| NU2 / NU3 / NU4 | fixed size unsigned int vec & scalar   |
| S2 / S3 / S4    | fixed size strided vec                 |
| NS2 / NS3 / NS4 | fixed size strided vec & scalar        |
| C               | arbitrary len vec, component wise args |
| C2 / C3 / C4    | fixed size vec, component wise args    |
| CS2 / CS3 / CS4 | fixed size strided vec, component args |

### Constants

-   `MAX2` / `MAX3` / `MAX4` - each component `+Infinity`
-   `MIN2` / `MIN3` / `MIN4` - each component `-Infinity`
-   `ONE2` / `ONE3` / `ONE4` - each component `1`
-   `ZERO2` / `ZERO3` / `ZERO4` - each component `0`
-   `X2` / `X3` / `X4` - positive X axis
-   `Y2` / `Y3` / `Y4` - positive Y axis
-   `Z3` / `Z4` - positive Z axis
-   `W4` - positive W axis

### Component setters & copying

-   `set` / `set2` / `set3` / `set4`
-   `setC` / `setC2` / `setC3` / `setC4` / `setC6`
-   `setN` / `setN2` / `setN3` / `setN4`
-   `setS` / `setS2` / `setS3` / `setS4`
-   `setCS2` / `setCS3` / `setCS4`
-   `setNS2` / `setNS3` / `setNS4`
-   `copy`
-   `empty`
-   `one`
-   `zero`

### Component swizzling

-   `swizzle2` / `swizzle3` / `swizzle4`
-   `setSwizzle1` / `setSwizzle2` / `setSwizzle3` / `setSwizzle4`
-   `swapXY` / `swapXZ` / `swapYZ`

### Vector creation

Functions to create wrapped (strided) vector instances:

-   `vec2` / `vec2n`
-   `vec3` / `vec3n`
-   `vec4` / `vec4n`
-   `gvec`

Wrap existing vanilla vectors:

-   `asVec2` / `asVec3` / `asVec4`

Vanilla vector (array) factories:

-   `ones`
-   `zeroes`
-   `vecOf`
-   `setVN3` / `setVN4`
-   `setVV4` / `setVV6` / `setVV9` / `setVV16`

### Basic vector math

#### Vector / vector

Component wise op with 2 input vectors:

| Function    | Generic | Fixed | Strided | Int          | Comments        |
|-------------|---------|-------|---------|--------------|-----------------|
| `add`       | ✓       | 2-4   | S2-S4   | I2-I4, U2-U4 |                 |
| `div`       | ✓       | 2-4   | S2-S4   | I2-I4, U2-U4 |                 |
| `mul`       | ✓       | 2-4   | S2-S4   | I2-I4, U2-U4 |                 |
| `sub`       | ✓       | 2-4   | S2-S4   | I2-I4, U2-U4 |                 |
| `fmod`      | ✓       | 2-4   |         |              | (C/JS behavior) |
| `mod`       | ✓       | 2-4   |         |              | (GLSL behavior) |
| `pow`       | ✓       | 2-4   |         |              |                 |
| `remainder` | ✓       | 2-4   |         |              | (C behavior)    |

```ts
import { add, add2, addU2, addS2 } from "@thi.ng/vectors";

// generic
add([], [1, 2, 3, 4, 5], [10, 20, 30, 40, 50]);
// [11, 22, 33, 44, 55]

// fixed size & packed
add2([], [1, 2], [10, 20])
// [11, 22]

// unsigned int
addU2([], [1, -2], [-10, 20])
// [4294967287, 18]

// strided
addS2([], [1,0,2,0], [0,10,0,0,0,20], 0, 0, 1, 1, 2, 4)
// [11, 22]
```

#### Vector / scalar

Component wise op with one input vector and single scalar:

| Function     | Generic | Fixed | Strided | Int          | Comments                   |
|--------------|---------|-------|---------|--------------|----------------------------|
| `addN`       | ✓       | 2-4   | S2-S4   | I2-I4, U2-U4 |                            |
| `divN`       | ✓       | 2-4   | S2-S4   | I2-I4, U2-U4 |                            |
| `mulN`       | ✓       | 2-4   | S2-S4   | I2-I4, U2-U4 |                            |
| `subN`       | ✓       | 2-4   | S2-S4   | I2-I4, U2-U4 |                            |
| `neg`        | ✓       |       |         |              | same as `mulN(out, v, -1)` |
| `fmodN`      | ✓       | 2-4   |         |              | (C/JS behavior)            |
| `modN`       | ✓       | 2-4   |         |              | (GLSL behavior)            |
| `powN`       | ✓       | 2-4   |         |              |                            |
| `remainderN` | ✓       | 2-4   |         |              | (C behavior)               |
| `roundN`     | ✓       | 2-4   |         |              |                            |

### Combined operations

| Function | Generic | Fixed | Strided | Int | Comments    |
|----------|---------|-------|---------|-----|-------------|
| `addm`   | ✓       | 2-4   | S2-S4   |     | (a + b) * c |
| `addmN`  | ✓       | 2-4   | S2-S4   |     | (a + b) * n |
| `madd`   | ✓       | 2-4   | S2-S4   |     | a * n + c   |
| `maddN`  | ✓       | 2-4   | S2-S4   |     | a * n + b   |
| `msub`   | ✓       | 2-4   | S2-S4   |     | a * n - c   |
| `msubN`  | ✓       | 2-4   | S2-S4   |     | a * n - b   |
| `subm`   | ✓       | 2-4   | S2-S4   |     | (a - b) * c |
| `submN`  | ✓       | 2-4   | S2-S4   |     | (a - b) * n |

### Constraints

| Function  | Generic | Fixed   | Strided | Int | Comments             |
|-----------|---------|---------|---------|-----|----------------------|
| `clamp`   | ✓       | 2-4     |         |     | `min(max(a, b), c)`  |
| `clampN`  | ✓       | 2-4     |         |     | `min(max(a, n), m)`  |
| `clamp01` | ✓       | _2 - _4 |         |     | `min(max(a, 0), 1)`  |
| `clamp11` | ✓       | _2 - _4 |         |     | `min(max(a, -1), 1)` |
| `max`     | ✓       | 2-4     |         |     | `max(a, b)`          |
| `min`     | ✓       | 2-4     |         |     | `min(a, b)`          |

### Cross product

| Function      | Generic | Fixed | Strided | Int | Comments                  |
|---------------|---------|-------|---------|-----|---------------------------|
| `cross`       |         | 2, 3  | S2, S3  |     | 2D version returns scalar |
| `orthoNormal` |         | 3     |         |     |                           |
| `signedArea`  |         | 2     |         |     |                           |

### Dot product

| Function | Generic | Fixed | Strided | Cwise      | Comments |
|----------|---------|-------|---------|------------|----------|
| `dot`    | ✓       | 2-4   | S2-S4   | C4, C6, C8 |          |

### Interpolation

| Function       | Generic | Fixed   | Strided | Int | Comments |
|----------------|---------|---------|---------|-----|----------|
| `fit`          | ✓       | 2-4     |         |     |          |
| `fit01`        | ✓       | _2 - _4 |         |     |          |
| `fit11`        | ✓       | _2 - _4 |         |     |          |
| `mix`          | ✓       | 2-4     | S2 - S4 |     |          |
| `mixN`         | ✓       | 2-4     | S2 - S4 |     |          |
| `mixBilinear`  | ✓       | 2-4     |         |     |          |
| `mixCubic`     | ✓       |         |         |     |          |
| `mixQuadratic` | ✓       |         |         |     |          |
| `smoothStep`   | ✓       | 2-4     |         |     |          |
| `step`         | ✓       | 2-4     |         |     |          |

### Normalization / magnitude

| Function    | Generic | Fixed | Strided | Int | Comments             |
|-------------|---------|-------|---------|-----|----------------------|
| `limit`     | ✓       |       |         |     |                      |
| `mag`       | ✓       |       | S2-S4   |     |                      |
| `magSq`     | ✓       | 2-4   | S2-S4   |     |                      |
| `normalize` | ✓       |       | S2-S4   |     | w/ opt target length |

### Distances

| Function              | Generic | Fixed | Strided | Int | Comments            |
|-----------------------|---------|-------|---------|-----|---------------------|
| `dist`                | ✓       |       |         |     |                     |
| `distSq`              | ✓       | 2-4   |         |     |                     |
| `distBrayCurtis`      | ✓       |       |         |     |                     |
| `distCanberra`        | ✓       |       |         |     |                     |
| `distChebyshev`       | ✓       | 2-4   |         |     |                     |
| `distCosine`          | ✓       |       |         |     |                     |
| `distHamming`         | ✓       |       |         |     |                     |
| `distHaversineLatLon` |         | 2     |         |     | lat/lon coordinates |
| `distHaversineLonLat` |         | 2     |         |     | lon/lat coordinates |
| `distJaccard`         | ✓       |       |         |     |                     |
| `distManhattan`       | ✓       | 2-4   |         |     |                     |
| `distMinkowski`       | ✓       |       |         |     |                     |
| `distSorensenDice`    | ✓       |       |         |     |                     |
| `distWeighted`        | ✓       |       |         |     |                     |
| `pointOnRay`          | ✓       | 2-3   |         |     | point at distance   |

### Orientation

| Function           | Generic | Fixed | Strided | Int | Comments                 |
|--------------------|---------|-------|---------|-----|--------------------------|
| `angleBetween`     |         | 2, 3  |         |     |                          |
| `angleRatio`       | ✓       |       |         |     |                          |
| `atan_2`           | ✓       | 2-4   |         |     | `Math.atan2(y, x)`       |
| `bisect`           |         | 2     |         |     |                          |
| `cornerBisector`   | ✓       |       |         |     |                          |
| `degrees`          | ✓       | 2-4   |         |     |                          |
| `direction`        | ✓       |       |         |     | normalize(b - a)         |
| `faceForward`      | ✓       |       |         |     |                          |
| `heading`          | ✓       |       |         |     | alias `headingXY`        |
| `headingXY`        | ✓       |       |         |     |                          |
| `headingXZ`        | ✓       |       |         |     |                          |
| `headingYZ`        | ✓       |       |         |     |                          |
| `headingSegment`   | ✓       |       |         |     | alias `headingSegmentXY` |
| `headingSegmentXY` | ✓       |       |         |     |                          |
| `headingSegmentXZ` | ✓       |       |         |     |                          |
| `headingSegmentYZ` | ✓       |       |         |     |                          |
| `normalCCW`        |         |       |         |     | 2D only                  |
| `normalCW`         |         |       |         |     | 2D only                  |
| `perpendicularCCW` |         |       |         |     | 2D only                  |
| `perpendicularCW`  |         |       |         |     | 2D only                  |
| `project`          | ✓       |       |         |     |                          |
| `radians`          | ✓       | 2-4   |         |     |                          |
| `reflect`          | ✓       |       |         |     |                          |
| `refract`          | ✓       |       |         |     |                          |

### Rotations

(Also see rotation matrices provided by
[@thi.ng/matrices](https://github.com/thi-ng/umbrella/tree/develop/packages/matrices))

| Function              | Generic | Fixed | Strided | Int | Comments            |
|-----------------------|---------|-------|---------|-----|---------------------|
| `rotationAroundAxis`  |         | 3     |         |     |                     |
| `rotationAroundPoint` |         | 2     |         |     |                     |
| `rotate`              |         |       | S2      |     | alias for `rotateZ` |
| `rotateX`             |         |       | S3      |     |                     |
| `rotateY`             |         |       | S3      |     |                     |
| `rotateZ`             |         |       | S3      |     |                     |

### Polar / cartesian conversion

| Function    | Generic | Fixed | Strided | Int | Comments   |
|-------------|---------|-------|---------|-----|------------|
| `cartesian` | ✓       | 2, 3  |         |     | 2D/3D only |
| `polar`     | ✓       | 2, 3  |         |     | 2D/3D only |

### Randomness

All ops support custom PRNG impls based on the
[@thi.ng/random](https://github.com/thi-ng/umbrella/tree/develop/packages/random)
`IRandom` interface and use `Math.random` by default:

| Function          | Generic | Fixed | Strided | Int | Comments |
|-------------------|---------|-------|---------|-----|----------|
| `jitter`          | ✓       |       |         |     |          |
| `randMinMax`      | ✓       | 2-4   | S2-S4   |     |          |
| `randNorm`        | ✓       | 2-4   | S2-S4   |     |          |
| `randNormDistrib` | ✓       | 2-4   | S2-S4   |     |          |
| `random`          | ✓       | 2-4   | S2-S4   |     |          |
| `randomDistrib`   | ✓       | 2-4   | S2-S4   |     |          |

### Unary vector math ops

| Function          | Generic | Fixed | Strided | Int | Comments           |
|-------------------|---------|-------|---------|-----|--------------------|
| `abs`             | ✓       | 2-4   |         |     |                    |
| `acos`            | ✓       | 2-4   |         |     |                    |
| `asin`            | ✓       | 2-4   |         |     |                    |
| `atan`            | ✓       | 2-4   |         |     | `Math.atan(y / x)` |
| `ceil`            | ✓       | 2-4   |         |     |                    |
| `cos`             | ✓       | 2-4   |         |     |                    |
| `cosh`            | ✓       | 2-4   |         |     |                    |
| `exp`             | ✓       | 2-4   |         |     |                    |
| `floor`           | ✓       | 2-4   |         |     |                    |
| `fract`           | ✓       | 2-4   |         |     |                    |
| `fromHomogeneous` | ✓       | 3, 4  |         |     | 3D/4D only         |
| `invert`          | ✓       | 2-4   |         |     |                    |
| `invSqrt`         | ✓       | 2-4   |         |     |                    |
| `isInf`           | ✓       | 2-4   |         |     |                    |
| `isNaN`           | ✓       | 2-4   |         |     |                    |
| `log`             | ✓       | 2-4   |         |     |                    |
| `major`           | ✓       | 2-4   |         |     |                    |
| `minor`           | ✓       | 2-4   |         |     |                    |
| `round`           | ✓       | 2-4   |         |     |                    |
| `sign`            | ✓       | 2-4   |         |     |                    |
| `sin`             | ✓       | 2-4   |         |     |                    |
| `sinh`            | ✓       | 2-4   |         |     |                    |
| `sqrt`            | ✓       | 2-4   |         |     |                    |
| `sum`             | ✓       | 2-4   |         |     |                    |
| `tan`             | ✓       | 2-4   |         |     |                    |
| `trunc`           | ✓       | 2-4   |         |     |                    |
| `wrap`            | ✓       | 2-4   |         |     |                    |

### Vector array batch processing

Functions to transform flat / strided buffers w/ vector operations:

-   `mapV` / `mapVN` / `mapVV` / `mapVVN` / `mapVVV`
-   `mean` / `median`
-   `minBounds` / `maxBounds`

### Comparison / equality

-   `comparator2` / `comparator3` / `comparator4`
-   `equals` / `equals2` / `equals3` / `equals4`
-   `eqDelta` / `eqDelta2` / `eqDelta3` / `eqDelta4`
-   `eqDeltaS`
-   `eqDeltaArray`

### Bitwise operations (int / uint vec)

Arguments are assumed to be signed / unsigned ints. Results will be
forced accordingly.

| Function  | Generic | Fixed | Strided | Int          | Comments |
|-----------|---------|-------|---------|--------------|----------|
| `bitAnd`  | ✓       |       |         | I2-I4, U2-U4 |          |
| `bitAndN` | ✓       |       |         | I2-I4, U2-U4 |          |
| `bitNot`  | ✓       |       |         | I2-I4, U2-U4 |          |
| `bitOr`   | ✓       |       |         | I2-I4, U2-U4 |          |
| `bitOrN`  | ✓       |       |         | I2-I4, U2-U4 |          |
| `bitXor`  | ✓       |       |         | I2-I4, U2-U4 |          |
| `bitXorN` | ✓       |       |         | I2-I4, U2-U4 |          |
| `lshift`  | ✓       |       |         | I2-I4, U2-U4 |          |
| `rshift`  | ✓       |       |         | I2-I4, U2-U4 |          |
| `lshiftN` | ✓       |       |         | I2-I4, U2-U4 |          |
| `rshiftN` | ✓       |       |         | I2-I4, U2-U4 |          |

### Vector conversions / coercions

- `asIVec` (2-4) -  signed int vector
- `asUVec` (2-4) -  unsigned int vector
- `asBVec` (2-4) -  boolean vector
- `fromBVec` (2-4) -  coerces each component to 0/1

### Boolean vector logic

| Function    | Generic | Fixed | Strided | Int | Comments          |
|-------------|---------|-------|---------|-----|-------------------|
| `logicAnd`  | ✓       | 2-4   |         |     |                   |
| `logicAndN` | ✓       | 2-4   |         |     |                   |
| `logicOr`   | ✓       | 2-4   |         |     |                   |
| `logicOrN`  | ✓       | 2-4   |         |     |                   |
| `logicNot`  | ✓       | 2-4   |         |     |                   |
| `every`     | ✓       | 2-4   |         |     | returns `boolean` |
| `some`      | ✓       | 2-4   |         |     | returns `boolean` |
| `not`       | ✓       | 2-4   |         |     |                   |

### Componentwise comparisons

All resulting in boolean vectors:

| Function | Generic | Fixed | Strided | Int | Comments |
|----------|---------|-------|---------|-----|----------|
| `eq`     | ✓       | 2-4   |         |     |          |
| `lt`     | ✓       | 2-4   |         |     |          |
| `lte`    | ✓       | 2-4   |         |     |          |
| `gt`     | ✓       | 2-4   |         |     |          |
| `gte`    | ✓       | 2-4   |         |     |          |
| `neq`    | ✓       | 2-4   |         |     |          |

### Hashing

- `hash`

### Code generator

- `compile` / `compileG` / `compileGHOF` / `compileHOF`
- `defOp` / `defOpS` / `defFnOp` / `defHofOp`
- `defMathNOp` / `defMathOp`
- `vop`

For more information about the code generator see:

- [emit.ts](https://github.com/thi-ng/umbrella/tree/develop/packages/vectors/src/compile/emit.ts)
- [templates.ts](https://github.com/thi-ng/umbrella/tree/develop/packages/vectors/src/compile/templates.ts)
- [vop.ts](https://github.com/thi-ng/umbrella/tree/develop/packages/vectors/src/vop.ts)

<!-- include ../../assets/tpl/footer.md -->
