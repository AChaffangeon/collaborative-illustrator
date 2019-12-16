import { Shape } from "./Shape";
import { Canvas } from "../Canvas";

export class FreeForm extends Shape {
    path: { x: number, y: number }[];
    pathSelection: d3.Selection<SVGPathElement, { x: number, y: number }[], any, any>;
    dPathAttribute: string;

    constructor(x: number, y: number, canvas: Canvas) {
        super(x, y, canvas);

        this.path = [{ x: x, y: y }];
        this.pathSelection = this.holderSelection.append("path");
        this.dPathAttribute = `M${x},${y}`;

        this.fill = "none";
        this.strokeWidth = 2;
    }

    addPoint(x: number, y: number): void {
        this.path.push({ x: x, y: y });
        this.dPathAttribute += `L${x},${y}`;
        this.redraw();
    }

    redraw(): void {
        this.pathSelection
            .attr("d", this.dPathAttribute)
            .style("fill", this.fill)
            .style("stroke", this.stroke)
            .style("stroke-width", `${this.strokeWidth}px`);
    }
}