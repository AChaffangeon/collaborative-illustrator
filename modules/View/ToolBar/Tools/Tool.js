"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Tool {
    constructor() {
        this.id = "unknown";
        this.isDown = false;
    }
    setupUI(toolBar, selected) {
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
    pointerDown(e, canvas) {
        this.isDown = true;
    }
    pointerMove(e, canvas) {
    }
    pointerUp(e, canvas) {
        this.isDown = false;
    }
    pointerCancel(e, canvas) {
        this.isDown = false;
    }
    pointerLeave(e, canvas) {
        this.isDown = false;
    }
    keyUp(e, canvas) { }
    toUnselect() { }
}
exports.Tool = Tool;
//# sourceMappingURL=Tool.js.map