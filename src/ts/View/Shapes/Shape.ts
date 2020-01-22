import { Canvas } from "../Canvas";
import { Point, Helpers } from "../../helpers";
import * as d3 from "d3-selection";
import { ActionManager } from "../../Actions/ActionManager";
import { Numeric } from "d3";

let shapeNumber = 0;

/** Abstract class for every shapes in the canvas. */
export abstract class Shape {
    id: string;
    holderSelection: d3.Selection<SVGGElement, any, any, any>;
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
    }

    addToCanvas(canvas: Canvas): void {
        this.holderSelection = canvas.svgSelection.append("g").classed("shape", true);
        this.holderSelection.datum(this);
        canvas.shapes.push(this);
    }

    removeFromCanvas(canvas: Canvas): void {
        this.holderSelection.remove();
        this.holderSelection = undefined;

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
        let bbox = this.holderSelection.node().getBBox();
        return pt.x > bbox.x + this.translate.dx &&
               pt.x < bbox.x + this.translate.dx + bbox.width &&
               pt.y > bbox.y + this.translate.dy &&
               pt.y < bbox.y + this.translate.dy + bbox.height;
    }

    select(): void {
        this.holderSelection.classed("selected", true);
        let bbox = this.holderSelection.node().getBBox();
        this.holderSelection.append("rect")
            .attr("x", bbox.x - 5)
            .attr("y", bbox.y - 5)
            .attr("width", bbox.width + 10)
            .attr("height", bbox.height + 10)
            .classed("selection-rect", true);
    }

    unselect(): void {
        if (this.holderSelection) {
            this.holderSelection.classed("selected", false);
            this.holderSelection.select("rect").remove();
        }
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
        d3.selectAll(".shape.selected").each(function(): void {
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
