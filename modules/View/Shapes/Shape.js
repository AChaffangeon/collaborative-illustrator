"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3-selection");
const ActionManager_1 = require("../../Actions/ActionManager");
let shapeNumber = 0;
class Shape {
    constructor() {
        this.id = ActionManager_1.ActionManager.userId + "-S_" + shapeNumber.toString();
        shapeNumber += 1;
        this.stroke = "#000000";
        this.strokeWidth = 0;
        this.fill = "#ffffff";
        this.translate = { dx: 0, dy: 0 };
        this.holderSelection = undefined;
        this.shapeSelection = undefined;
    }
    addToCanvas(canvas) {
        this.holderSelection = canvas.svgSelection.append("g").classed("shape-holder", true);
        this.holderSelection.datum(this);
        this.shapeSelection = this.holderSelection.append("g").classed("shape", true);
        canvas.shapes.push(this);
    }
    removeFromCanvas(canvas) {
        this.holderSelection.remove();
        this.holderSelection = undefined;
        this.shapeSelection = undefined;
        canvas.shapes = canvas.shapes.filter((value, index, arr) => {
            return value !== this;
        });
    }
    translateBy(dx, dy) {
        this.translate.dx += dx;
        this.translate.dy += dy;
        this.repaint();
    }
    repaint() {
        if (this.holderSelection === undefined) {
            return;
        }
        this.holderSelection
            .attr("transform", `translate(${this.translate.dx}, ${this.translate.dy})`);
    }
    isPicked(pt) {
        let bbox = this.shapeSelection.node().getBBox();
        return pt.x > bbox.x + this.translate.dx &&
            pt.x < bbox.x + this.translate.dx + bbox.width &&
            pt.y > bbox.y + this.translate.dy &&
            pt.y < bbox.y + this.translate.dy + bbox.height;
    }
    select(peerId, color) {
        if (ActionManager_1.ActionManager.userId === peerId) {
            this.holderSelection.classed("selected", true);
        }
        this.holderSelection.append("rect")
            .attr("id", `peer-selection-${peerId}`)
            .attr("stroke", color)
            .classed("selection-rect", true);
        this.redrawRectangleSelection();
    }
    unselect(peerId) {
        if (this.holderSelection) {
            let selection = d3.select(`#peer-selection-${peerId}`);
            if (!selection.empty()) {
                selection.remove();
                this.redrawRectangleSelection();
                if (ActionManager_1.ActionManager.userId === peerId) {
                    this.holderSelection.classed("selected", false);
                }
            }
        }
    }
    redrawRectangleSelection() {
        let bbox = this.shapeSelection.node().getBBox();
        this.holderSelection.selectAll("rect")
            .attr("x", (_, i) => { return bbox.x - 5 - 4 * i; })
            .attr("y", (_, i) => { return bbox.y - 5 - 4 * i; })
            .attr("width", (_, i) => { return bbox.width + 10 + 8 * i; })
            .attr("height", (_, i) => { return bbox.height + 10 + 8 * i; });
    }
    static isShape(d3Selection) {
        if (d3Selection.datum() === undefined) {
            return false;
        }
        return d3Selection.datum() instanceof Shape;
    }
    static getShape(d3Selection) {
        if (!Shape.isShape(d3Selection)) {
            console.log("Error");
            return;
        }
        return d3Selection.datum();
    }
    static getSelectedShapes() {
        let selectedShapes = [];
        d3.selectAll(".shape-holder.selected").each(function () {
            selectedShapes.push(Shape.getShape(d3.select(this)));
        });
        return selectedShapes;
    }
    getStroke() {
        return this.stroke;
    }
    getStrokeWidth() {
        return this.strokeWidth;
    }
    getFill() {
        return this.fill;
    }
    getTranslate() {
        return this.translate;
    }
    setStroke(color) {
        this.stroke = color;
        this.repaint();
    }
    setStrokeWidth(width) {
        this.strokeWidth = width;
        this.repaint();
    }
    setFill(color) {
        this.fill = color;
        this.repaint();
    }
    setTranslate(translate) {
        this.translate = translate;
        this.repaint();
    }
    toJSON() {
        let json = {};
        json["id"] = this.id;
        json["stroke"] = this.stroke;
        json["strokeWidth"] = this.strokeWidth;
        json["fill"] = this.fill;
        return json;
    }
}
exports.Shape = Shape;
//# sourceMappingURL=Shape.js.map