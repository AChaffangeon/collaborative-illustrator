import * as d3 from "d3-selection";
import { FreeFormTool } from "./Tools/FreeFormTool";
import { Tool } from "./Tools/Tool";
import { SelectTool } from "./Tools/SelectTool";

export type ToolID = string;

/** A class to create a toolbar */
export class ToolBar {
    /** Current tool. */
    selectedTool: Tool;
    /** D3 selection of div #toolbar. */
    holderSelection: d3.Selection<any, any, any, any>;

    constructor() {
        this.holderSelection = d3.select("#toolbar");

        this.setupUI();
    }

    setupUI(): void {
        this.selectedTool = new SelectTool(this, true);
        new FreeFormTool(this, false);
    }

    /**
     * Returns the current tool.
     * @returns tool 
     */
    getTool(): Tool {
        return this.selectedTool;
    }
}
