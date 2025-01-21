// SPDX-License-Identifier: Apache-2.0
import { rect } from "@thi.ng/geom/rect";
import { isLayout } from "@thi.ng/layout/checks";
import { hash } from "@thi.ng/vectors/hash";
import type { ComponentOpts } from "../api.js";
import { mixHash } from "../hash.js";
import { buttonRaw } from "./button.js";
import { textLabelRaw } from "./textlabel.js";

export interface IconButtonOpts extends ComponentOpts {
	icon: any;
	iconSize: [number, number];
}

export const iconButton = ({
	gui,
	layout,
	id,
	icon,
	iconSize: [iconW, iconH],
	label,
	info,
}: IconButtonOpts) => {
	const theme = gui.theme;
	const pad = theme.pad;
	const bodyW = label
		? iconW + 3 * pad + gui.textWidth(label)
		: iconW + 2 * pad;
	const bodyH = iconH + pad;
	const { x, y, w, h } = isLayout(layout)
		? layout.next(layout.spanForSize(bodyW, bodyH))
		: layout;
	const key = hash([x, y, w, h, ~~gui.disabled]);
	const mkIcon = (hover: boolean) => {
		const col = gui.textColor(hover);
		const pos = [x + pad, y + (h - iconH) / 2];
		return [
			"g",
			{
				translate: pos,
				fill: col,
				stroke: col,
			},
			icon,
			label
				? textLabelRaw(
						[
							iconW + pad,
							-(h - iconH) / 2 + h / 2 + theme.baseLine,
						],
						{ fill: col, stroke: "none" },
						label
				  )
				: undefined,
		];
	};
	return buttonRaw(
		gui,
		id,
		gui.resource(id, key, () => rect([x, y], [w, h])),
		key,
		gui.resource(id, mixHash(key, `l${label}`), () => mkIcon(false)),
		gui.resource(id, mixHash(key, `lh${label}`), () => mkIcon(true)),
		info
	);
};
