import { Canvas } from "../Canvas";
import { Point } from "../../helpers";
import * as d3 from "d3-selection";
import { ActionManager } from "../../Actions/ActionManager";

let shapeNumber = 0;

/** Abstract class for every shapes in the canvas. */
export abstract class Shape {
    id: string;
    holderSelection: d3.Selection<SVGGElement, any, any, any>;
    shapeSelection: d3.Selection<SVGGElement, any, any, any>;
    stroke: string;
    strokeWidth: number;
    fill: string;
    translate: { dx: number; dy: number; };

    constructor() {
        this.id = ActionManager.userId + "-S_" + shapeNumber.toString();
        shapeNumber += 1;

        this.stroke = "#000000";
        this.strokeWidth = 0;
        this.fill = "#ffffff";

        this.translate = { dx: 0, dy: 0 };

        this.holderSelection = undefined;
        this.shapeSelection = undefined;
    }

    addToCanvas(canvas: Canvas): void {
        this.holderSelection = canvas.svgSelection.append("g").classed("shape-holder", true);
        this.holderSelection.datum(this);
        this.shapeSelection = this.holderSelection.append("g").classed("shape", true);
        canvas.shapes.push(this);
    }

    removeFromCanvas(canvas: Canvas): void {
        this.holderSelection.remove();
        this.holderSelection = undefined;
        this.shapeSelection = undefined;

        canvas.shapes = canvas.shapes.filter((value, index, arr) => {
            return value !== this;
        });
    }

    translateBy(dx: number, dy: number): void {
        this.translate.dx += dx;
        this.translate.dy += dy;
        this.repaint();
     }

    repaint(): void {
        if (this.holderSelection === undefined) {
            return;
        }
        this.holderSelection
            .attr("transform", `translate(${this.translate.dx}, ${this.translate.dy})`);
     }

    /**
     * Determines whether the shape is picked
     * @param pt Point cliked on screen, use pageX and pageY
     * @returns true if picked
     */
    isPicked(pt: Point): boolean {
        let bbox = this.shapeSelection.node().getBBox();
        return pt.x > bbox.x + this.translate.dx &&
               pt.x < bbox.x + this.translate.dx + bbox.width &&
               pt.y > bbox.y + this.translate.dy &&
               pt.y < bbox.y + this.translate.dy + bbox.height;
    }

    select(peerId: string, color: string): void {
        this.holderSelection.classed("selected", true);
        this.holderSelection.append("rect")
            .attr("id", `peer-selection-${peerId}`)
            .attr("stroke", color)
            .classed("selection-rect", true);
        this.redrawRectangleSelection();
    }

    unselect(peerId: string): void {
        if (this.holderSelection) {
            let selection = d3.select(`#peer-selection-${peerId}`);
            if (!selection.empty()) {
                selection.remove();
                this.redrawRectangleSelection();

                let isUnselect = this.holderSelection.selectAll("rect").empty();
                this.holderSelection.classed("selected", !isUnselect);
            }
        }
    }

    private redrawRectangleSelection(): void {
        let bbox = this.shapeSelection.node().getBBox();
        this.holderSelection.selectAll("rect")
            .attr("x", (_, i) => { return bbox.x - 5 - 4 * i; })
            .attr("y", (_, i) => { return bbox.y - 5 - 4 * i; })
            .attr("width", (_, i) => { return bbox.width + 10 + 8 * i; })
            .attr("height", (_, i) => { return bbox.height + 10 + 8 * i; });
    }

    static isShape(d3Selection: d3.Selection<any, any, any, any>): boolean {
        if (d3Selection.datum() === undefined) {
            return false;
        }

        return d3Selection.datum() instanceof Shape;
    }

    static getShape(d3Selection: d3.Selection<any, any, any, any>): Shape {
        if (!Shape.isShape(d3Selection)) {
            console.log("Error");
            return;
        }

        return d3Selection.datum();
    }

    static getSelectedShapes(): Shape[] {
        let selectedShapes = [];
        d3.selectAll(".shape-holder.selected").each(function(): void {
            selectedShapes.push(Shape.getShape(d3.select(this)));
        });
        return selectedShapes;
    }

    getStroke(): string {
        return this.stroke;
    }

    getStrokeWidth(): number {
        return this.strokeWidth;
    }

    getFill(): string {
        return this.fill;
    }

    getTranslate(): { dx: number, dy: number} {
        return this.translate;
    }

    setStroke(color: string): void {
        this.stroke = color;
        this.repaint();
    }

    setStrokeWidth(width: number): void {
        this.strokeWidth = width;
        this.repaint();
    }

    setFill(color: string): void {
        this.fill = color;
        this.repaint();
    }

    setTranslate(translate: { dx: number, dy: number}): void {
        this.translate = translate;
        this.repaint();
    }

    copy(shape: any): void {
        this.stroke = shape.stroke;
        this.strokeWidth = shape.strokeWidth;
        this.fill = shape.fill;
    }

    toJSON(): any {
        let json = { };
        json["id"] = this.id;
        json["stroke"] = this.stroke;
        json["strokeWidth"] = this.strokeWidth;
        json["fill"] = this.fill;
        return json;
    }
}
