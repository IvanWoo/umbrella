import { adaptiveCanvas2d } from "@thi.ng/canvas";
import { circle, group, star, vertices } from "@thi.ng/geom";
import {
	compFill,
	defDots,
	defHatchPen,
	fuzzyPoly,
	jitterPoints,
} from "@thi.ng/geom-fuzz";
import { draw } from "@thi.ng/hiccup-canvas";
import { fromInterval } from "@thi.ng/rstream";

const W = 300;

const SHAPES = {
	tri: vertices(circle(100), 3),
	hex: vertices(circle(50), 6),
	star: vertices(star(50, 6, [0.5, 1])),
	spike: jitterPoints(vertices(circle(40), 12), 15),
};

const PEN1 = defHatchPen([0, 0.8, 1, 0.5]);
const PEN2 = compFill(
	defHatchPen("#f3f", "d", 1, 3),
	defHatchPen("#f3f", "v", 1, 3)
);
const PEN3 = defHatchPen([1, 1, 0, 0.5], "h", 4, 1.2);
const PEN4 = defDots({
	jitter: 1,
	attribs: { size: 1.5, fill: [0, 1, 0], stroke: "none" },
});

const curvePos = (
	t: number,
	fx: number,
	fy: number,
	ax: number,
	ay: number
) => [Math.sin(t * fx) * ax + W / 2, Math.cos(t * fy) * ay + W / 2];

const { canvas, ctx } = adaptiveCanvas2d(W, W, document.body);

fromInterval(1000 / 30).subscribe({
	next(t: number) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		draw(
			ctx,
			group({ stroke: "black", scale: window.devicePixelRatio || 1 }, [
				fuzzyPoly(
					SHAPES.tri,
					{ translate: [150, 150], rotate: t * 0.04 },
					{
						fill: PEN1,
						curve: { scale: 0.05 },
						jitter: 3,
					}
				),
				fuzzyPoly(
					SHAPES.star,
					{ translate: curvePos(t, 0.02, 0.03, 100, 50) },
					{ fill: PEN2, curve: { scale: 0.3 } }
				),
				fuzzyPoly(
					SHAPES.hex,
					{ translate: curvePos(t + 100, 0.03, 0.02, 100, 50) },
					{ fill: PEN3, curve: { scale: 0.1 } }
				),
				fuzzyPoly(
					SHAPES.spike,
					{ translate: curvePos(t, 0.04, 0.03, 50, 100) },
					{ fill: PEN4 }
				),
			])
		);
	},
});
