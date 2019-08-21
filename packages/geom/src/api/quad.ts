import { IHiccupShape, Type } from "@thi.ng/geom-api";
import { copyShape } from "../internal/copy-shape";
import { APC } from "./apc";

export class Quad extends APC implements IHiccupShape {
    get type() {
        return Type.QUAD;
    }

    copy(): Quad {
        return <Quad>copyShape(Quad, this);
    }

    toHiccup() {
        return ["polygon", this.attribs, this.points];
    }
}
