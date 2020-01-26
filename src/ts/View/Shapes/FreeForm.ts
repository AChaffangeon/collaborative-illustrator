import { Shape } from "./Shape";
import { Canvas } from "../Canvas";
import { Helpers, Point } from "../../helpers";

/** A class to create a new free form shape. */
export class FreeForm extends Shape {
    /** List of point in the shape. */
    path: Point[];
    /** D3 selection of the svg path representing this shape. */
    pathSelection: d3.Selection<SVGPathElement, Point[], any, any>;  

    constructor() {
        super();

        this.path = [];

        this.fill = "none";
        this.strokeWidth = 2;
    }

    /**
     * Adds a point to the shape.
     * @param pt The point to add.
     */
    addPoint(pt: Point): void {
        this.path.push(pt);
        this.repaint();
    }

    /**
     * Set the list of points of the shape. 
     * @param points List of points.
     */
    setPoints(points: Point[]): void {
        this.path = points;
        this.repaint();
    }

    /**
     * Adds the shape to a canvas.
     * @param canvas The canvas where to add the shape.
     */
    addToCanvas(canvas: Canvas): void {
        super.addToCanvas(canvas);
        this.pathSelection = this.shapeSelection.append("path");
        this.repaint();
    }

    /**
     * Repaints the free form
     */
    repaint(): void {
        super.repaint();
        if (this.shapeSelection === undefined) {
            return;
        }
        if (this.path.length < 2) {
            return;
        }
        
        this.pathSelection
            .attr("d", Helpers.pointsToDAttr(this.path))
            .style("fill", this.fill)
            .style("stroke", this.stroke)
            .style("stroke-width", `${this.strokeWidth}px`);
    }

    /**
     * Export the shape to json
     * @returns json 
     */
    toJSON(): any {
        let json = super.toJSON();
        json["path"] = this.path;
        return json;
    }
}