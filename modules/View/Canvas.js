"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3-selection");
class Canvas {
    constructor(toolBar, infoPanel) {
        this.holderSelection = d3.select("#canvas");
        this.svgSelection = this.holderSelection.append("svg");
        this.toolBar = toolBar;
        this.infoPanel = infoPanel;
        this.shapes = [];
        this.setupPointerListeners();
    }
    setupPointerListeners() {
        let canvasSVG = this.holderSelection.node();
        canvasSVG.addEventListener("pointerdown", (e) => {
            this.toolBar.getTool().pointerDown(e, this);
        });
        canvasSVG.addEventListener("pointermove", (e) => {
            this.toolBar.getTool().pointerMove(e, this);
        });
        canvasSVG.addEventListener("pointerup", (e) => {
            this.toolBar.getTool().pointerUp(e, this);
        });
        canvasSVG.addEventListener("pointercancel", (e) => {
            this.toolBar.getTool().pointerCancel(e, this);
        });
        canvasSVG.addEventListener("pointerleave", (e) => {
            this.toolBar.getTool().pointerLeave(e, this);
        });
        document.addEventListener('keyup', (e) => {
            this.toolBar.getTool().keyUp(e, this);
        });
    }
    getShape(shapeId) {
        let shape;
        this.shapes.forEach((s) => {
            if (s.id === shapeId) {
                shape = s;
            }
        });
        if (shape === undefined) {
            console.error("Shape not in canvas: " + shapeId);
        }
        return shape;
    }
}
exports.Canvas = Canvas;
//# sourceMappingURL=Canvas.js.map