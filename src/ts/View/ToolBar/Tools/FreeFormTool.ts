import { Tool } from "./Tool";
import { ToolBar } from "../ToolBar";

export class FreeFormTool extends Tool {
    id: string = "freeform";

    constructor(toolBar: ToolBar) {
        super(toolBar);
        this.setupUI(toolBar);
    }
}