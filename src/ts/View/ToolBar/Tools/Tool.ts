import { ToolBar, ToolID } from "../ToolBar";
import { Canvas } from "../../Canvas";

export abstract class Tool {
    id: ToolID = "unknown";
    isDown: boolean;

    constructor() { 
        this.isDown = false;
    }

    protected setupUI(toolBar: ToolBar, selected: boolean): void {
        let button = toolBar.holderSelection.append("button")
            .attr("id", this.id + "-button")
            .classed("selected", selected);
        button.on("click", () => {
                toolBar.holderSelection
                    .selectAll("button")
                        .classed("selected", false);
                button.classed("selected", true);
                toolBar.selectedTool.toUnselect();
                toolBar.selectedTool = this;
            });
    }

    pointerDown(e: PointerEvent, canvas: Canvas): void {
        this.isDown = true;
     }

    pointerMove(e: PointerEvent, canvas: Canvas): void { 
    }

    pointerUp(e: PointerEvent, canvas: Canvas): void { 
        this.isDown = false;
    }

    pointerCancel(e: PointerEvent, canvas: Canvas): void { 
        this.isDown = false;
    }

    pointerLeave(e: PointerEvent, canvas: Canvas): void { 
        this.isDown = false;
    }

    toUnselect(): void { }
}