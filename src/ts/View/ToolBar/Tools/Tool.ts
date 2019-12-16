import { ToolBar, ToolID } from "../ToolBar";
import { EventManager } from "../../../Events/EventManager";
import { ToolSelectedEvent } from "../../../Events/ToolSelected";

export abstract class Tool {
    id: ToolID = "unknown";

    constructor(toolBar: ToolBar) { }

    setupUI(toolBar: ToolBar): void {
        toolBar.holderSelection.append("button")
            .attr("id", this.id + "-button")
            .on("click", () => {
                toolBar.selectedTool = this.id;
                EventManager.emit(new ToolSelectedEvent(this.id));
            });
    }
}