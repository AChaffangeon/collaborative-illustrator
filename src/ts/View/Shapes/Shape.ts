import { Canvas } from "../Canvas";
import { Point } from "../../helpers";
import * as d3 from "d3-selection";
import { ActionManager } from "../../Actions/ActionManager";

let shapeNumber = 0;

/** Abstract class for every shapes in the canvas. */
export abstract class Shape {
    /** Id of the shape. */
    id: string;
    /** D3 selection of the svg group defining the shape holder. */
    holderSelection: d3.Selection<SVGGElement, any, any, any>;
    /** D3 selection of the svg group defining the shape. */
    shapeSelection: d3.Selection<SVGGElement, any, any, any>;
    /** Stroke color of the shape. */
    stroke: string;
    /** Stroke width of the shape. */
    strokeWidth: number;
    /** Fill color of the shape. */
    fill: string;
    /** Translate property of the shape */
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

    /**
     * Adds the shape to a canvas.
     * @param canvas Canvas where to add the shape.
     */
    addToCanvas(canvas: Canvas): void {
        this.holderSelection = canvas.svgSelection.append("g").classed("shape-holder", true);
        this.holderSelection.datum(this);
        this.shapeSelection = this.holderSelection.append("g").classed("shape", true);
        canvas.shapes.push(this);
    }

    /**
     * Removes the shape from a canvas.
     * @param canvas The canvas to remove from.
     */
    removeFromCanvas(canvas: Canvas): void {
        this.holderSelection.remove();
        this.holderSelection = undefined;
        this.shapeSelection = undefined;

        canvas.shapes = canvas.shapes.filter((value, index, arr) => {
            return value !== this;
        });
    }

    /**
     * Translates the shape by dx and dy.
     * @param dx X-axis translation value.
     * @param dy Y-axis translation value.
     */
    translateBy(dx: number, dy: number): void {
        this.translate.dx += dx;
        this.translate.dy += dy;
        this.repaint();
     }

    /**
     * Repaints the shape.
     */
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

    /**
     * Selects the shape for a peer. 
     * @param peerId Peer that selected the shape.
     * @param color Color of the rectangle around the shape.
     */
    select(peerId: string, color: string): void {
        if (ActionManager.userId === peerId) {
            this.holderSelection.classed("selected", true);
        }
        this.holderSelection.append("rect")
            .attr("id", `peer-selection-${peerId}`)
            .attr("stroke", color)
            .classed("selection-rect", true);
        this.redrawRectangleSelection();
    }

    /**
     * Unselects the shape for a peer.
     * @param peerId Peer that unselected the shape.
     */
    unselect(peerId: string): void {
        if (this.holderSelection) {
            let selection = d3.select(`#peer-selection-${peerId}`);
            if (!selection.empty()) {
                selection.remove();
                this.redrawRectangleSelection();

                if (ActionManager.userId === peerId) {
                    this.holderSelection.classed("selected", false);
                }
            }
        }
    }

    /**
     * Redraws the rectangles around the shape.
     */
    private redrawRectangleSelection(): void {
        let bbox = this.shapeSelection.node().getBBox();
        this.holderSelection.selectAll("rect")
            .attr("x", (_, i) => { return bbox.x - 5 - 4 * i; })
            .attr("y", (_, i) => { return bbox.y - 5 - 4 * i; })
            .attr("width", (_, i) => { return bbox.width + 10 + 8 * i; })
            .attr("height", (_, i) => { return bbox.height + 10 + 8 * i; });
    }

    /**
     * Determines whether a D3 selection is a shape.
     * @param d3Selection The selection to test.
     * @returns true if shape.
     */
    static isShape(d3Selection: d3.Selection<any, any, any, any>): boolean {
        if (d3Selection.datum() === undefined) {
            return false;
        }

        return d3Selection.datum() instanceof Shape;
    }

    /**
     * Gets the shape from a d3 selection.
     * @param d3Selection D3 selection to get the shape from.
     * @returns shape 
     */
    static getShape(d3Selection: d3.Selection<any, any, any, any>): Shape {
        if (!Shape.isShape(d3Selection)) {
            console.log("Error");
            return;
        }

        return d3Selection.datum();
    }

    /**
     * Gets the list of selected shapes.
     * @returns selected shapes.
     */
    static getSelectedShapes(): Shape[] {
        let selectedShapes = [];
        d3.selectAll(".shape-holder.selected").each(function(): void {
            selectedShapes.push(Shape.getShape(d3.select(this)));
        });
        return selectedShapes;
    }

    /**
     * Gets stroke
     * @returns stroke 
     */
    getStroke(): string {
        return this.stroke;
    }

    /**
     * Gets stroke width
     * @returns stroke width 
     */
    getStrokeWidth(): number {
        return this.strokeWidth;
    }

    /**
     * Gets fill
     * @returns fill 
     */
    getFill(): string {
        return this.fill;
    }

    /**
     * Gets translate
     * @returns translate 
     */
    getTranslate(): { dx: number, dy: number} {
        return this.translate;
    }

    /**
     * Sets stroke
     * @param color 
     */
    setStroke(color: string): void {
        this.stroke = color;
        this.repaint();
    }

    /**
     * Sets stroke width
     * @param width 
     */
    setStrokeWidth(width: number): void {
        this.strokeWidth = width;
        this.repaint();
    }

    /**
     * Sets fill
     * @param color 
     */
    setFill(color: string): void {
        this.fill = color;
        this.repaint();
    }

    /**
     * Sets translate
     * @param translate 
     */
    setTranslate(translate: { dx: number, dy: number}): void {
        this.translate = translate;
        this.repaint();
    }

    /**
     * Export the shape to json
     * @returns json
     */
    toJSON(): any {
        let json = { };
        json["id"] = this.id;
        json["stroke"] = this.stroke;
        json["strokeWidth"] = this.strokeWidth;
        json["fill"] = this.fill;
        return json;
    }
}
