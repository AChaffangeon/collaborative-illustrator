import { Tool } from "./Tool";
import { ToolBar } from "../ToolBar";
import { Canvas } from "../../Canvas";
import * as d3 from "d3-selection";
import { Shape } from "../../Shapes/Shape";
import { Helpers } from "../../../helpers";
import { EventManager } from "../../../Events/EventManager";
import { TranslateShapeEvent } from "../../../Events/TranslateShapeEvent";
import { DeleteShapeEvent } from "../../../Events/DeleteShapeEvent";
import { SelectShapeEvent } from "../../../Events/SelectShapeEvent";
import { ActionManager } from "../../../Actions/ActionManager";
import { UnselectShapeEvent } from "../../../Events/UnselectShapeEvent";

/** A class to add a selection tool. It allows to select and drag a shape. */
export class SelectTool extends Tool {
    /** Id of the tool */
    id: string = "select";
    /** List of selected shapes */
    selectedShapes: Shape[];
    /** last point where the cursor was. */
    lastPoint: { x: number; y: number; };
    /** Shape being dragged. */
    shape: Shape;
    /** If true, a shape was dragged. */
    moved: boolean;

    constructor(toolBar: ToolBar, selected: boolean) {
        super();
        this.selectedShapes = [];
        this.lastPoint = { x: 0, y: 0 };
        this.setupUI(toolBar, selected);
    }

    /**
     * Determines the shape that is selected, if any.
     * @param e Pointer Event that triggered this function.
     * @param canvas Canvas where the event was triggered.
     */
    pointerDown(e: PointerEvent, canvas: Canvas): void {
        super.pointerDown(e, canvas);
        this.moved = false;

        let point = Helpers.pageToSVG({ x: e.pageX, y: e.pageY }, canvas.svgSelection);
        let targetSelection = d3.select(e.target as d3.BaseType);

        if (!Shape.isShape(targetSelection)) {
            d3.selectAll(".shape").each((d: Shape) => {
                if (d.isPicked(point)) {
                    this.shape = d;
                }
            });
            if (this.shape === undefined) {
                return;
            }
        } else {
            this.shape = Shape.getShape(targetSelection);
        }

        if (!e.shiftKey) {
            this.unselectAllShapes();
        }

        this.lastPoint = point;
    }

    /**
     * Drags the selected shapes.
     * @param e Pointer Event that triggered this function.
     * @param canvas Canvas where the event was triggered.
     */
    pointerMove(e: PointerEvent, canvas: Canvas): void {
        if (!this.isDown) {
            return;
        }
        super.pointerMove(e, canvas);

        if (this.shape === undefined) {
            return;
        }

        let point = Helpers.pageToSVG({ x: e.pageX, y: e.pageY }, canvas.svgSelection);

        this.shape.translateBy(point.x - this.lastPoint.x, point.y - this.lastPoint.y);
        this.selectedShapes.forEach((s) => {
            if (s !== this.shape) {
                s.translateBy(point.x - this.lastPoint.x, point.y - this.lastPoint.y);
            }
        });

        this.moved = true;

        this.lastPoint = point;
    }

    /**
     * Emits events that a shape was dragged and/or selected.
     * @param e Pointer Event that triggered this function.
     * @param canvas Canvas where the event was triggered.
     */
    pointerUp(e: PointerEvent, canvas: Canvas): void {
        if (!this.isDown) {
            return;
        }
        super.pointerUp(e, canvas);

        if (this.shape === undefined) {
            this.unselectAllShapes();
            return;
        }

        if (this.moved) {
            let translate = this.shape.getTranslate();

            let userId = ActionManager.userId;
            let timeStamp = ActionManager.getTimeStamp();
            EventManager.emit(new TranslateShapeEvent(translate, this.shape.id, userId, timeStamp));

            this.selectedShapes.forEach((s) => {
                if (s !== this.shape) {
                    translate = s.getTranslate();
                    EventManager.emit(new TranslateShapeEvent(translate, s.id, userId, timeStamp));
                }
            });
        } else {
            if (this.selectedShapes.includes(this.shape)) {
                this.unselectShape(this.shape);
            } else {
                this.selectShape(this.shape);
                canvas.infoPanel.setFill(this.shape.getFill());
                canvas.infoPanel.setStroke(this.shape.getStroke());
                canvas.infoPanel.setStrokeWidth(this.shape.getStrokeWidth());
            }
        }

        this.shape = undefined;
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
        super.pointerLeave(e, canvas);
    }

    /**
     * Selects a shape.
     * @param shape Shape to select.
     */
    private selectShape(shape: Shape): void {
        this.selectedShapes.push(shape);
        EventManager.emit(new SelectShapeEvent(shape.id, ActionManager.userId, ActionManager.getTimeStamp(), "#56B4E9"));
    }

    /**
     * Unselects a shape.
     * @param shape Shape to unselect.
     */
    unselectShape(shape: Shape): void {
        this.selectedShapes = this.selectedShapes.filter((value) => {
            return value !== shape;
        });
        EventManager.emit(new UnselectShapeEvent(shape.id, ActionManager.userId, ActionManager.getTimeStamp()));
    }

    /**
     * Unselects all shapes
     */
    unselectAllShapes(): void {
        let shapeList = this.selectedShapes.slice();
        shapeList.forEach((shape) => {
            this.unselectShape(shape);
        });
    }

    keyUp(e: KeyboardEvent, canvas: Canvas): void {
        if (e.code === "Delete" || (e.code === "KeyD" && e.ctrlKey) || (e.code === "KeyD" && e.altKey)) {
            let userId = ActionManager.userId;
            let timeStamp = ActionManager.getTimeStamp();

            for (let shape of this.selectedShapes) {
                EventManager.emit(new DeleteShapeEvent(shape.id, userId, timeStamp));
            }
        }
    }

    /**
     * To unselect
     */
    toUnselect(): void {
        this.unselectAllShapes();
    }
}
