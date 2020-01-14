import { Tool } from "./Tool";
import { ToolBar } from "../ToolBar";
import { Canvas } from "../../Canvas";
import { FreeForm } from "../../Shapes/FreeForm";
import { Helpers, Point } from "../../../helpers";
import { EventManager } from "../../../Events/EventManager";
import { ShapeCreatedEvent } from "../../../Events/ShapeCreatedEvent";

export class FreeFormTool extends Tool {
    id: string = "freeform";
    currentShape: d3.Selection<SVGGElement, any, any, any>;
    currentPoints: Point[];

    constructor(toolBar: ToolBar, selected: boolean) {
        super();
        this.setupUI(toolBar, selected);
    }

    pointerDown(e: PointerEvent, canvas: Canvas): void {
        super.pointerDown(e, canvas);
        let point = { x: e.pageX, y: e.pageY };
        point = Helpers.pageToSVG(point, canvas.svgSelection);

        this.currentPoints = [point];
        this.currentShape = canvas.svgSelection.append("path").classed("in-creation", true);
     }

    pointerMove(e: PointerEvent, canvas: Canvas): void {
        super.pointerMove(e, canvas);
        if (!this.isDown) {
            return;
        }
        let point = { x: e.pageX, y: e.pageY };
        point = Helpers.pageToSVG(point, canvas.svgSelection);

        this.currentPoints.push(point);
        this.currentShape.attr("d", Helpers.pointsToDAttr(this.currentPoints));
    }

    pointerUp(e: PointerEvent, canvas: Canvas): void { 
        if (!this.isDown) {
            return;
        }
        this.isDown = false;

        let shape = new FreeForm();
        shape.addPoints(this.currentPoints);
        EventManager.emit(new ShapeCreatedEvent(shape));

        this.currentPoints = undefined;
        this.currentShape.remove();
        this.currentShape = undefined;
    }

    pointerCancel(e: PointerEvent, canvas: Canvas): void { 
        super.pointerCancel(e, canvas);
        if (!this.isDown) {
            return;
        }
    }

    pointerLeave(e: PointerEvent, canvas: Canvas): void { 
        super.pointerLeave(e, canvas);
        if (!this.isDown) {
            return;
        }
        this.pointerUp(e, canvas);
    }
}