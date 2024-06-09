import type { IShape } from "@thi.ng/geom";
import { pointInside } from "@thi.ng/geom/point-inside";
import { Key } from "../api.js";
import { tooltipRaw } from "../components/tooltip.js";
import type { IMGUI } from "../gui.js";

export const hoverButton = (
	gui: IMGUI,
	id: string,
	shape: IShape,
	info?: string
) => {
	if (gui.disabled) return false;
	const aid = gui.activeID;
	const hover = (aid === "" || aid === id) && pointInside(shape, gui.mouse);
	if (hover) {
		gui.setCursor("pointer");
		gui.hotID = id;
		gui.isMouseDown() && (gui.activeID = id);
		info && gui.draw && tooltipRaw(gui, info);
	}
	return hover;
};

export const handleButtonKeys = (gui: IMGUI) => {
	switch (gui.key) {
		case Key.TAB:
			gui.switchFocus();
			break;
		case Key.ENTER:
		case Key.SPACE:
			return true;
		default:
	}
};
