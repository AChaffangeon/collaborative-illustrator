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

    setFill(color: string): void {
        this.fillPicker.setFill(color);
    }

    setStroke(color: string): void {
        this.strokePicker.setStroke(color);
    }

    setStrokeWidth(width: number): void {
        this.strokePicker.setStrokeWidth(width);
    }

    getFill(): string {
        return this.fillPicker.fill;
    }

    getStroke(): string {
        return this.strokePicker.stroke;
    }

    getStrokeWidth(): number {
        return this.strokePicker.strokeWidth;
    }
}