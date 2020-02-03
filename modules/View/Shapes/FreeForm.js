"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Shape_1 = require("./Shape");
const helpers_1 = require("../../helpers");
class FreeForm extends Shape_1.Shape {
    constructor() {
        super();
        this.path = [];
        this.fill = "none";
        this.strokeWidth = 2;
    }
    addPoint(pt) {
        this.path.push(pt);
        this.repaint();
    }
    setPoints(points) {
        this.path = points;
        this.repaint();
    }
    addToCanvas(canvas) {
        super.addToCanvas(canvas);
        this.pathSelection = this.shapeSelection.append("path");
        this.repaint();
    }
    repaint() {
        super.repaint();
        if (this.shapeSelection === undefined) {
            return;
        }
        if (this.path.length < 2) {
            return;
        }
        this.pathSelection
            .attr("d", helpers_1.Helpers.pointsToDAttr(this.path))
            .style("fill", this.fill)
            .style("stroke", this.stroke)
            .style("stroke-width", `${this.strokeWidth}px`);
    }
    toJSON() {
        let json = super.toJSON();
        json["path"] = this.path;
        return json;
    }
}
exports.FreeForm = FreeForm;
//# sourceMappingURL=FreeForm.js.map