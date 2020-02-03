"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventManager_1 = require("../../Events/EventManager");
const Shape_1 = require("../Shapes/Shape");
const StrokeChangedEvent_1 = require("../../Events/StrokeChangedEvent");
const StrokeWidthChangedEvent_1 = require("../../Events/StrokeWidthChangedEvent");
const ActionManager_1 = require("../../Actions/ActionManager");
class StrokePicker {
    constructor(infoPanel) {
        this.holderSelection = infoPanel.holderSelection
            .append("div")
            .attr("id", "stroke-picker")
            .classed("info-panel-element", true);
        this.stroke = "#000000";
        this.strokeWidth = 2;
        this.setupUI();
        this.setupInteraction();
    }
    setupUI() {
        this.holderSelection
            .append("div")
            .classed("header", true)
            .text("Stroke");
        this.holderSelection
            .append("input")
            .attr("type", "color")
            .attr("value", this.stroke);
        this.holderSelection
            .append("input")
            .attr("type", "range")
            .attr("min", 1)
            .attr("max", 100)
            .attr("value", this.strokeWidth);
        this.holderSelection
            .append("input")
            .attr("id", "stroke-width-text-input")
            .attr("type", "text")
            .attr("value", this.strokeWidth);
        this.holderSelection
            .append("label")
            .attr("for", "stroke-width-text-input")
            .text("px");
    }
    setupInteraction() {
        this.holderSelection.select("input[type='color']")
            .on("change", () => {
            let v = this.holderSelection.select("input[type='color']").node().value;
            this.updateStroke(v);
        });
        this.holderSelection.select("#stroke-width-text-input")
            .on("change", () => {
            let v = this.holderSelection.select("#stroke-width-text-input").node().value;
            this.updateStrokeWidth(parseInt(v));
        });
        this.holderSelection.select("input[type='range']")
            .on("change", () => {
            let v = this.holderSelection.select("input[type='range']").node().value;
            this.updateStrokeWidth(parseInt(v));
        });
    }
    updateStroke(color) {
        this.stroke = color;
        let selectedShapes = Shape_1.Shape.getSelectedShapes();
        selectedShapes.forEach((shape) => {
            EventManager_1.EventManager.emit(new StrokeChangedEvent_1.StrokeChangedEvent(this.getStroke(), shape.id, ActionManager_1.ActionManager.userId, ActionManager_1.ActionManager.getTimeStamp()));
        });
    }
    updateStrokeWidth(width) {
        this.strokeWidth = width;
        let input = document.getElementById("stroke-width-text-input");
        input.value = width.toString();
        let selectedShapes = Shape_1.Shape.getSelectedShapes();
        selectedShapes.forEach((shape) => {
            EventManager_1.EventManager.emit(new StrokeWidthChangedEvent_1.StrokeWidthChangedEvent(width, shape.id, ActionManager_1.ActionManager.userId, ActionManager_1.ActionManager.getTimeStamp()));
        });
    }
    getStroke() {
        return this.stroke;
    }
    getStrokeWidth() {
        return this.strokeWidth;
    }
    setStroke(color) {
        this.stroke = color;
        this.holderSelection
            .select("input[type='color']")
            .node()
            .value = color;
    }
    setStrokeWidth(width) {
        this.strokeWidth = width;
        this.holderSelection
            .select("#stroke-width-text-input")
            .node()
            .value = width.toString();
        this.holderSelection
            .select("input[type='range']")
            .node()
            .value = width.toString();
    }
}
exports.StrokePicker = StrokePicker;
//# sourceMappingURL=StrokePicker.js.map