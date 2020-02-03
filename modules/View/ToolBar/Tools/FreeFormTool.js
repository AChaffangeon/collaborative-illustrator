"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Tool_1 = require("./Tool");
const FreeForm_1 = require("../../Shapes/FreeForm");
const helpers_1 = require("../../../helpers");
const EventManager_1 = require("../../../Events/EventManager");
const ShapeCreatedEvent_1 = require("../../../Events/ShapeCreatedEvent");
const ActionManager_1 = require("../../../Actions/ActionManager");
class FreeFormTool extends Tool_1.Tool {
    constructor(toolBar, selected) {
        super();
        this.id = "freeform";
        this.setupUI(toolBar, selected);
    }
    pointerDown(e, canvas) {
        super.pointerDown(e, canvas);
        let point = { x: e.pageX, y: e.pageY };
        point = helpers_1.Helpers.pageToSVG(point, canvas.svgSelection);
        this.currentPoints = [point];
        this.currentShape = canvas.svgSelection.append("path").classed("in-creation", true);
        this.currentShape.style("fill", canvas.infoPanel.fillPicker.fill)
            .style("stroke-width", `${canvas.infoPanel.strokePicker.strokeWidth}px`)
            .style("stroke", canvas.infoPanel.strokePicker.stroke);
    }
    pointerMove(e, canvas) {
        if (!this.isDown) {
            return;
        }
        super.pointerMove(e, canvas);
        let point = { x: e.pageX, y: e.pageY };
        point = helpers_1.Helpers.pageToSVG(point, canvas.svgSelection);
        this.currentPoints.push(point);
        this.currentShape.attr("d", helpers_1.Helpers.pointsToDAttr(this.currentPoints));
    }
    pointerUp(e, canvas) {
        if (!this.isDown) {
            return;
        }
        super.pointerUp(e, canvas);
        let shape = new FreeForm_1.FreeForm();
        shape.setStroke(canvas.infoPanel.strokePicker.stroke);
        shape.setStrokeWidth(canvas.infoPanel.strokePicker.strokeWidth);
        shape.setFill(canvas.infoPanel.fillPicker.fill);
        shape.setPoints(this.currentPoints);
        EventManager_1.EventManager.emit(new ShapeCreatedEvent_1.ShapeCreatedEvent(shape, ActionManager_1.ActionManager.userId, ActionManager_1.ActionManager.getTimeStamp()));
        this.currentPoints = undefined;
        this.currentShape.remove();
        this.currentShape = undefined;
    }
    pointerCancel(e, canvas) {
        if (!this.isDown) {
            return;
        }
        super.pointerCancel(e, canvas);
    }
    pointerLeave(e, canvas) {
        if (!this.isDown) {
            return;
        }
        this.pointerUp(e, canvas);
    }
}
exports.FreeFormTool = FreeFormTool;
//# sourceMappingURL=FreeFormTool.js.map