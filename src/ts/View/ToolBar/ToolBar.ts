import * as d3 from "d3-selection";
import { FreeFormTool } from "./Tools/FreeFormTool";

export type ToolID = string;

/** A class to create a toolbar */
export class ToolBar {
    selectedTool: ToolID;
    holderSelection: d3.Selection<any, any, any, any>;

    constructor() {
        this.holderSelection = d3.select("#toolbar");

        this.setupUI();
    }

    setupUI(): void {
        new FreeFormTool(this);
    }
}