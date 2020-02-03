"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3-selection");
const FreeFormTool_1 = require("./Tools/FreeFormTool");
const SelectTool_1 = require("./Tools/SelectTool");
class ToolBar {
    constructor() {
        this.holderSelection = d3.select("#toolbar");
        this.setupUI();
    }
    setupUI() {
        this.selectedTool = new SelectTool_1.SelectTool(this, true);
        new FreeFormTool_1.FreeFormTool(this, false);
    }
    getTool() {
        return this.selectedTool;
    }
}
exports.ToolBar = ToolBar;
//# sourceMappingURL=ToolBar.js.map