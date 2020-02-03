"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Tool_1 = require("./Tool");
const d3 = require("d3-selection");
const Shape_1 = require("../../Shapes/Shape");
const helpers_1 = require("../../../helpers");
const EventManager_1 = require("../../../Events/EventManager");
const TranslateShapeEvent_1 = require("../../../Events/TranslateShapeEvent");
const DeleteShapeEvent_1 = require("../../../Events/DeleteShapeEvent");
const SelectShapeEvent_1 = require("../../../Events/SelectShapeEvent");
const ActionManager_1 = require("../../../Actions/ActionManager");
const UnselectShapeEvent_1 = require("../../../Events/UnselectShapeEvent");
class SelectTool extends Tool_1.Tool {
    constructor(toolBar, selected) {
        super();
        this.id = "select";
        this.selectedShapes = [];
        this.lastPoint = { x: 0, y: 0 };
        this.setupUI(toolBar, selected);
    }
    pointerDown(e, canvas) {
        super.pointerDown(e, canvas);
        this.moved = false;
        let point = helpers_1.Helpers.pageToSVG({ x: e.pageX, y: e.pageY }, canvas.svgSelection);
        let targetSelection = d3.select(e.target);
        if (!Shape_1.Shape.isShape(targetSelection)) {
            d3.selectAll(".shape").each((d) => {
                if (d.isPicked(point)) {
                    this.shape = d;
                }
            });
            if (this.shape === undefined) {
                return;
            }
        }
        else {
            this.shape = Shape_1.Shape.getShape(targetSelection);
        }
        if (!e.shiftKey) {
            this.unselectAllShapes();
        }
        this.lastPoint = point;
    }
    pointerMove(e, canvas) {
        if (!this.isDown) {
            return;
        }
        super.pointerMove(e, canvas);
        if (this.shape === undefined) {
            return;
        }
        let point = helpers_1.Helpers.pageToSVG({ x: e.pageX, y: e.pageY }, canvas.svgSelection);
        this.shape.translateBy(point.x - this.lastPoint.x, point.y - this.lastPoint.y);
        this.selectedShapes.forEach((s) => {
            if (s !== this.shape) {
                s.translateBy(point.x - this.lastPoint.x, point.y - this.lastPoint.y);
            }
        });
        this.moved = true;
        this.lastPoint = point;
    }
    pointerUp(e, canvas) {
        if (!this.isDown) {
            return;
        }
        super.pointerUp(e, canvas);
        if (this.shape === undefined) {
            this.unselectAllShapes();
            return;
        }
        if (this.moved) {
            let translate = this.shape.getTranslate();
            let userId = ActionManager_1.ActionManager.userId;
            let timeStamp = ActionManager_1.ActionManager.getTimeStamp();
            EventManager_1.EventManager.emit(new TranslateShapeEvent_1.TranslateShapeEvent(translate, this.shape.id, userId, timeStamp));
            this.selectedShapes.forEach((s) => {
                if (s !== this.shape) {
                    translate = s.getTranslate();
                    EventManager_1.EventManager.emit(new TranslateShapeEvent_1.TranslateShapeEvent(translate, s.id, userId, timeStamp));
                }
            });
        }
        else {
            if (this.selectedShapes.includes(this.shape)) {
                this.unselectShape(this.shape);
            }
            else {
                this.selectShape(this.shape);
                canvas.infoPanel.setFill(this.shape.getFill());
                canvas.infoPanel.setStroke(this.shape.getStroke());
                canvas.infoPanel.setStrokeWidth(this.shape.getStrokeWidth());
            }
        }
        this.shape = undefined;
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
        super.pointerLeave(e, canvas);
    }
    selectShape(shape) {
        this.selectedShapes.push(shape);
        EventManager_1.EventManager.emit(new SelectShapeEvent_1.SelectShapeEvent(shape.id, ActionManager_1.ActionManager.userId, ActionManager_1.ActionManager.getTimeStamp(), "#56B4E9"));
    }
    unselectShape(shape) {
        this.selectedShapes = this.selectedShapes.filter((value) => {
            return value !== shape;
        });
        EventManager_1.EventManager.emit(new UnselectShapeEvent_1.UnselectShapeEvent(shape.id, ActionManager_1.ActionManager.userId, ActionManager_1.ActionManager.getTimeStamp()));
    }
    unselectAllShapes() {
        let shapeList = this.selectedShapes.slice();
        shapeList.forEach((shape) => {
            this.unselectShape(shape);
        });
    }
    keyUp(e, canvas) {
        if (e.code === "Delete" || (e.code === "KeyD" && e.ctrlKey) || (e.code === "KeyD" && e.altKey)) {
            let userId = ActionManager_1.ActionManager.userId;
            let timeStamp = ActionManager_1.ActionManager.getTimeStamp();
            for (let shape of this.selectedShapes) {
                EventManager_1.EventManager.emit(new DeleteShapeEvent_1.DeleteShapeEvent(shape.id, userId, timeStamp));
            }
        }
    }
    toUnselect() {
        this.unselectAllShapes();
    }
}
exports.SelectTool = SelectTool;
//# sourceMappingURL=SelectTool.js.map