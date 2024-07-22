<!-- include ../../assets/tpl/header.md -->

<!-- toc -->

## About

![screenshot](https://raw.githubusercontent.com/thi-ng/umbrella/develop/assets/examples/pixel-dither.jpg)

{{pkg.description}}

The package provides the following dithering algorithm presets (can also be
very easily extended via definition of custom kernels):

- Atkinson
- Bayes (ordered dithering w/ customizable sizes & levels)
- Burkes
- Diffusion (1D row/column, 2D)
- Floyd-Steinberg
- Jarvis-Judice-Ninke
- Sierra 2-row
- Stucki
- Threshold

{{meta.status}}

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

```ts
import { imageFromURL, intBufferFromImage, GRAY8 } from "@thi.ng/pixel";
import { ditherWith, ATKINSON } from "@thi.ng/pixel-dither";

// create pixel buffer from HTML image element
const img = intBufferFromImage(await imageFromURL("test.jpg"));

// apply dithering to all channels in given pixel buffer
ditherWith(ATKINSON, img);

// first convert to 8-bit gray before dithering
ditherWith(ATKINSON, img.as(GRAY8));

// ...or apply dithering to select channels only
// use custom threshold & error spillage/bleed factor
ditherWith(ATKINSON, img, { channels: [1, 2, 3], threshold: 0.66, bleed: 0.75 });
```

### Custom dither kernels

All bundled algorithm presets (apart from `orderedDither()`) are implemented as
[`DitherKernel`](https://docs.thi.ng/umbrella/pixel-dither/interfaces/DitherKernel.html)
configurations for, defining how each dithered pixel's error should be
diffused/distributed to neighbors. This approach makes it very easy to define
custom dither configs, like so:

```ts
import { ditherWith, type DitherKernel } from "@thi.ng/pixel-dither";

const CUSTOM: DitherKernel = {
    // X offsets of neighbor pixels to update
    ox: [1],
    // Y offsets of neighbor pixels to update
    oy: [1],
    // error weights for updated pixels
    weights: [1],
    // bit shift (scale factor)
    shift: 1,
};

ditherWith(CUSTOM, img);
```

The above config will distribute the error to a single pixel @ offset (1,1).
However the error will be bit-shifted by 1 bit to the right (aka division-by-2).
In code form:

```ts
pixels[i + ox + oy * width] += (err * weight) >> shift;
```

**Important:** Ensure the offset positions only refer to still unprocessed
pixels, i.e. those to the right and/or below the currently processed pixel (in
following rows).

You can see the result of this kernel in the [pixel-dither
demo](https://demo.thi.ng/umbrella/pixel-dither/).

<!-- include ../../assets/tpl/footer.md -->
