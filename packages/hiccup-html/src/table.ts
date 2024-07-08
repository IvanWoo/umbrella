import type {
	Attribs,
	AttribVal,
	MultiStringAttrib,
	NumericAttrib,
} from "./api.js";
import { defElement, defElements } from "./def.js";

export const [caption, table, tbody, tfoot, thead, tr] = defElements([
	"caption",
	"table",
	"tbody",
	"tfoot",
	"thead",
	"tr",
]);

export interface TableCellAttribs extends Attribs {
	colspan: NumericAttrib;
	headers: MultiStringAttrib;
	rowspan: NumericAttrib;
}

export const td = defElement<Partial<TableCellAttribs>>("td");

export interface TableCellHeaderAttribs extends TableCellAttribs {
	scope: AttribVal<"auto" | "col" | "colgroup" | "row" | "rowgroup">;
}

export const th = defElement<Partial<TableCellHeaderAttribs>>("th");

export interface ColAttribs extends Attribs {
	span: NumericAttrib;
}

export const [col, colgroup] = defElements<Partial<ColAttribs>>([
	"col",
	"colgroup",
]);
