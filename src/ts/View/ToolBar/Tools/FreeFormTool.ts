import { Tool } from "./Tool";
import { ToolBar } from "../ToolBar";
import { Canvas } from "../../Canvas";
import { FreeForm } from "../../Shapes/FreeForm";
import { Helpers, Point } from "../../../helpers";
import { EventManager } from "../../../Events/EventManager";
import { ShapeCreatedEvent } from "../../../Events/ShapeCreatedEvent";
import { ActionManager } from "../../../Actions/ActionManager";

/** A class to add a free form tool. It allows to draw free form shape. */
export class FreeFormTool extends Tool {
    /** Id of the tool. */
    id: string = "freeform";
    /** Shape being drawn. */
    currentShape: d3.Selection<SVGGElement, any, any, any>;
    /** List of points that define the current shape. */
    currentPoints: Point[];

    constructor(toolBar: ToolBar, selected: boolean) {
        super();
        this.setupUI(toolBar, selected);
    }

    /**
     * Instanciates the current shape.
     * @param e Pointer Event that triggered this function.
     * @param canvas Canvas where the event was triggered.
     */
    pointerDown(e: PointerEvent, canvas: Canvas): void {
        super.pointerDown(e, canvas);
        let point = { x: e.pageX, y: e.pageY };
        point = Helpers.pageToSVG(point, canvas.svgSelection);

        this.currentPoints = [point];
        this.currentShape = canvas.svgSelection.append("path").classed("in-creation", true);

        this.currentShape.style("fill", canvas.infoPanel.fillPicker.fill)
          .style("stroke-width", `${canvas.infoPanel.strokePicker.strokeWidth}px`)
          .style("stroke", canvas.infoPanel.strokePicker.stroke);
     }

    /**
     * Add points to the current shape.
     * @param e Pointer Event that triggered this function.
     * @param canvas Canvas where the event was triggered.
     */
    pointerMove(e: PointerEvent, canvas: Canvas): void {
        if (!this.isDown) {
            return;
        }
        super.pointerMove(e, canvas);
        let point = { x: e.pageX, y: e.pageY };
        point = Helpers.pageToSVG(point, canvas.svgSelection);

        this.currentPoints.push(point);
        this.currentShape.attr("d", Helpers.pointsToDAttr(this.currentPoints));
    }

    /**
     * Emit an event to signal the creation of a new shape.
     * @param e Pointer Event that triggered this function.
     * @param canvas Canvas where the event was triggered.
     */
    pointerUp(e: PointerEvent, canvas: Canvas): void {
        if (!this.isDown) {
            return;
        }
        super.pointerUp(e, canvas);

        let shape = new FreeForm();


        shape.setStroke(canvas.infoPanel.strokePicker.stroke);
        shape.setStrokeWidth(canvas.infoPanel.strokePicker.strokeWidth);
        shape.setFill(canvas.infoPanel.fillPicker.fill);
        shape.setPoints(this.currentPoints);

        EventManager.emit(new ShapeCreatedEvent(shape, ActionManager.userId, ActionManager.getTimeStamp()));

        this.currentPoints = undefined;
        this.currentShape.remove();
        this.currentShape = undefined;
    }

    pointerCancel(e: PointerEvent, canvas: Canvas): void {
        if (!this.isDown) {
            return;
        }
        super.pointerCancel(e, canvas);
    }

    pointerLeave(e: PointerEvent, canvas: Canvas): void {
        if (!this.isDown) {
            return;
        }
        this.pointerUp(e, canvas);
    }
}
