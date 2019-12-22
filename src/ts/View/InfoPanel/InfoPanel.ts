import * as d3 from "d3-selection";
import { ColorPicker } from "./ColorPicker";

export class InfoPanel {
    holderSelection: d3.Selection<HTMLDivElement, any, any, any>;
    colorPicker: ColorPicker;

    constructor() {
        this.holderSelection = d3.select("#info-panel");
        this.colorPicker = new ColorPicker(this);
    }
}