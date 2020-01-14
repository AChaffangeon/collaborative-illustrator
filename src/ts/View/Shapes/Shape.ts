import { Canvas } from "../Canvas";
import { Point, Helpers } from "../../helpers";
import * as d3 from "d3-selection";

/** Abstract class for every shapes in the canvas. */
export abstract class Shape {
    holderSelection: d3.Selection<SVGGElement, any, any, any>;
    stroke: string;
    strokeWidth: number;
    fill: string;

    constructor() {
        this.stroke = "#000000";
        this.strokeWidth = 0;
        this.fill = "#ffffff";

        this.holderSelection = undefined;
    }

    addToCanvas(canvas: Canvas): void {
        this.holderSelection = canvas.svgSelection.append("g").classed("shape", true);
        this.holderSelection.datum(this);
    }

    translateTo(x: number, y: number): void { }

    translateBy(dx: number, dy: number): void { }

    repaint(): void {
        console.log("wrong repaint");
     }

    /**
     * Determines whether the shape is picked
     * @param pt Point cliked on screen, use pageX and pageY
     * @returns true if picked 
     */
    isPicked(pt: Point): boolean {
        let bbox = this.holderSelection.node().getBBox();
        return pt.x > bbox.x && pt.x < bbox.x + bbox.width && pt.y > bbox.y && pt.y < bbox.y + bbox.height;
    }

    select(): void {
        this.holderSelection.classed("selected", true);
    }

    unselect(): void {
        this.holderSelection.classed("selected", false);
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

    copy(shape: any): void {
        this.stroke = shape.stroke;
        this.strokeWidth = shape.strokeWidth;
        this.fill = shape.fill;
    }

    toJSON(): any {
        let json = { };
        json["stroke"] = this.stroke;
        json["strokeWidth"] = this.strokeWidth;
        json["fill"] = this.fill;
        return json;
    }
}