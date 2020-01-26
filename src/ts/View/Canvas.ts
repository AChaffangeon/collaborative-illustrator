import * as d3 from "d3-selection";
import { ToolBar } from "./ToolBar/ToolBar";
import { Shape } from "./Shapes/Shape";
import { InfoPanel } from "./InfoPanel/InfoPanel";

/** A class to create a canvas. */
export class Canvas {
    /** Tool bar linked to the canvas. */
    toolBar: ToolBar;
    /** Info panel linked to the canavs. */
    infoPanel: InfoPanel;
    /** D3 selection of the div #canvas */
    holderSelection: d3.Selection<any, any, any, any>;
    /** D3 selection of the svg in the div #canvas */
    svgSelection: d3.Selection<SVGSVGElement, any, any, any>;
    /** List of shapes in the canvas. */
    shapes: Shape[];

    constructor(toolBar: ToolBar, infoPanel: InfoPanel) {
        this.holderSelection = d3.select("#canvas");
        this.svgSelection = this.holderSelection.append("svg");
        this.toolBar = toolBar;
        this.infoPanel = infoPanel;
        this.shapes = [];

        this.setupPointerListeners();
    }

    /**
     * Setups pointer listeners.
     */
    private setupPointerListeners(): void {
        let canvasSVG = this.holderSelection.node();

        canvasSVG.addEventListener("pointerdown", (e) => {
            this.toolBar.getTool().pointerDown(e, this);
        });

        canvasSVG.addEventListener("pointermove", (e) => {
            this.toolBar.getTool().pointerMove(e, this);
        });

        canvasSVG.addEventListener("pointerup", (e) => {
            this.toolBar.getTool().pointerUp(e, this);
        });

        canvasSVG.addEventListener("pointercancel", (e) => {
            this.toolBar.getTool().pointerCancel(e, this);

        });
        canvasSVG.addEventListener("pointerleave", (e) => {
            this.toolBar.getTool().pointerLeave(e, this);
        });

        document.addEventListener('keyup', (e) => {
            this.toolBar.getTool().keyUp(e, this);
        });
    }

    /**
     * Gets a shape based on a shape id.
     * @param shapeId Id of the shape.
     * @returns shape 
     */
    getShape(shapeId: string): Shape {
        let shape;
        this.shapes.forEach((s) => {
            if (s.id === shapeId) {
                shape = s;
            }
        });

        if (shape === undefined) {
            console.error("Shape not in canvas: " + shapeId);
        }

        return shape;
    }
}
