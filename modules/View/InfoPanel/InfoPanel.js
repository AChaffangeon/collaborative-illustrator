"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3-selection");
const StrokePicker_1 = require("./StrokePicker");
const FillPicker_1 = require("./FillPicker");
const PeerDisplay_1 = require("./PeerDisplay");
class InfoPanel {
    constructor() {
        this.holderSelection = d3.select("#info-panel");
        this.strokePicker = new StrokePicker_1.StrokePicker(this);
        this.fillPicker = new FillPicker_1.FillPicker(this);
        this.peerList = new PeerDisplay_1.PeerDisplay(this);
    }
    setFill(color) {
        this.fillPicker.setFill(color);
    }
    setStroke(color) {
        this.strokePicker.setStroke(color);
    }
    setStrokeWidth(width) {
        this.strokePicker.setStrokeWidth(width);
    }
}
exports.InfoPanel = InfoPanel;
//# sourceMappingURL=InfoPanel.js.map