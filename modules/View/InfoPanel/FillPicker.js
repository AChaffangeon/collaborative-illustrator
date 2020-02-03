"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventManager_1 = require("../../Events/EventManager");
const Shape_1 = require("../Shapes/Shape");
const FillChangedEvent_1 = require("../../Events/FillChangedEvent");
const ActionManager_1 = require("../../Actions/ActionManager");
const d3 = require("d3-selection");
class FillPicker {
    constructor(infoPanel) {
        this.holderSelection = infoPanel.holderSelection
            .append("div")
            .attr("id", "fill-picker")
            .classed("info-panel-element", true);
        this.fill = "none";
        this.setupUI();
        this.setupInteraction();
    }
    setupUI() {
        this.holderSelection
            .append("div")
            .classed("header", true)
            .text("Fill");
        let selectButton = this.holderSelection
            .append("select")
            .attr("id", "color-picker-option-button");
        selectButton
            .append("option")
            .attr("value", "no-fill")
            .text("None / Transparent");
        selectButton
            .append("option")
            .attr("value", "fill")
            .text("Color");
        this.holderSelection
            .append("input")
            .attr("type", "color")
            .attr("value", this.fill)
            .style("display", "none");
    }
    setupInteraction() {
        this.holderSelection
            .select("select")
            .on("change", () => {
            let val = document.getElementById("color-picker-option-button").value;
            if (val === "no-fill") {
                this.holderSelection
                    .select("input")
                    .style("display", "none");
                this.updateColor("none");
            }
            else {
                this.holderSelection
                    .select("input")
                    .style("display", "initial");
                let v = this.holderSelection.select("input").node().value;
                this.updateColor(v);
            }
        });
        this.holderSelection.select("input")
            .on("change", () => {
            let v = this.holderSelection.select("input").node().value;
            this.updateColor(v);
        });
    }
    updateColor(color) {
        this.fill = color;
        let selectedShapes = Shape_1.Shape.getSelectedShapes();
        selectedShapes.forEach((shape) => {
            EventManager_1.EventManager.emit(new FillChangedEvent_1.FillChangedEvent(color, shape.id, ActionManager_1.ActionManager.userId, ActionManager_1.ActionManager.getTimeStamp()));
        });
    }
    getColor() {
        return this.fill;
    }
    setFill(color) {
        this.fill = color;
        let selectButton = this.holderSelection
            .select("#color-picker-option-button")
            .node();
        let colorButton = this.holderSelection
            .select("input").node();
        if (color === "none") {
            selectButton.value = "no-fill";
            d3.select(colorButton).style("display", "none");
        }
        else {
            selectButton.value = "fill";
            d3.select(colorButton)
                .style("display", "initial");
            colorButton.value = this.fill;
        }
    }
}
exports.FillPicker = FillPicker;
//# sourceMappingURL=FillPicker.js.map