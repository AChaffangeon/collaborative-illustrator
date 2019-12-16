import { Canvas } from "../Canvas";

/** Abstract class for every shapes in the canvas. */
export abstract class Shape {
    holderSelection: d3.Selection<SVGGElement, any, any, any>;
    x: number;
    y: number;
    stroke: string;
    strokeWidth: number;
    fill: string;

    constructor(x: number, y: number, canvas: Canvas) {
        this.x = x;
        this.y = y;
        this.stroke = "#000000";
        this.strokeWidth = 0;
        this.fill = "#ffffff";

        this.holderSelection = canvas.svgSelection.append("g").classed("shape", true);
    }

    getX(): number {
        return this.x;
    }

    getY(): number {
        return this.y;
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

    setX(x: number): void {
        this.x = x;
        this.repaint();
    }

    setY(y: number): void {
        this.y = y;
        this.repaint();
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

    translateTo(x: number, y: number): void {
        this.x = x;
        this.y = y;
        this.holderSelection.attr("transform", `translate(${this.x}, ${this.y})`);
    }

    translateBy(dx: number, dy: number): void {
        this.x += dx;
        this.y += dy;
        this.holderSelection.attr("transform", `translate(${this.x}, ${this.y})`);
    }

    repaint(): void {

    }
}