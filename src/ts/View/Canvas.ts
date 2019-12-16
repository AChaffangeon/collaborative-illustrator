import { Shape } from "./Shapes/Shape";
import * as d3 from "d3-selection";
import { CanvasInteraction } from "./CanvasInteraction";

/** A class to create a canvas */
export class Canvas {
    holderSelection: d3.Selection<any, any, any, any>;
    svgSelection: d3.Selection<SVGSVGElement, any, any, any>;

    constructor() {
        this.holderSelection = d3.select("#canvas");
        this.svgSelection = this.holderSelection.append("svg");

        this.setupUI();
        new CanvasInteraction(this);
    }

    setupUI(): void {
    }
}