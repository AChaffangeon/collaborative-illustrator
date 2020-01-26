import { Shape } from "./Shape";
import { Canvas } from "../Canvas";
import { Helpers, Point } from "../../helpers";

export class FreeForm extends Shape {
    path: Point[];
    pathSelection: d3.Selection<SVGPathElement, Point[], any, any>;  

    constructor() {
        super();

        this.path = [];

        this.fill = "none";
        this.strokeWidth = 2;
    }

    addPoint(pt: Point): void {
        this.path.push(pt);
        this.repaint();
    }

    addPoints(points: Point[]): void {
        this.path = points;
        this.repaint();
    }

    addToCanvas(canvas: Canvas): void {
        super.addToCanvas(canvas);
        this.pathSelection = this.shapeSelection.append("path");
        this.repaint();
    }

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

    copy(shape: any): void {
        super.copy(shape);
        this.path = shape.path;
    }

    toJSON(): any {
        let json = super.toJSON();
        json["path"] = this.path;
        return json;
    }
}