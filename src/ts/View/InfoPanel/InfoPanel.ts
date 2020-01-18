import * as d3 from "d3-selection";
import { StrokePicker } from "./StrokePicker";
import { FillPicker } from "./FillPicker";

export class InfoPanel {
    holderSelection: d3.Selection<HTMLDivElement, any, any, any>;
    strokePicker: StrokePicker;
    fillPicker: FillPicker;

    constructor() {
        this.holderSelection = d3.select("#info-panel");
        this.strokePicker = new StrokePicker(this);
        this.fillPicker = new FillPicker(this);
    }
}