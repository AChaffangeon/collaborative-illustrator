import * as d3 from "d3-selection";
import { ToolBar } from "./ToolBar/ToolBar";
import { EventManager } from "../Events/EventManager";
import { ColorChangedEvent } from "../Events/ColorChangedEvent";
import { Shape } from "./Shapes/Shape";
import { FreeForm } from "./Shapes/FreeForm";
import { ShapeCreatedEvent } from "../Events/ShapeCreatedEvent";

/** A class to create a canvas */
export class Canvas {
    toolBar: ToolBar;
    holderSelection: d3.Selection<any, any, any, any>;
    svgSelection: d3.Selection<SVGSVGElement, any, any, any>;
    shapes: Shape[];

    constructor(toolBar: ToolBar) {
        this.holderSelection = d3.select("#canvas");
        this.svgSelection = this.holderSelection.append("svg");
        this.toolBar = toolBar;
        this.shapes = [];

        this.setupUI();
        this.setupPointerListeners();
    }

    private setupUI(): void {
    }

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
    }

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