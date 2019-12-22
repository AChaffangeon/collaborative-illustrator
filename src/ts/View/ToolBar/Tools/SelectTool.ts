import { Tool } from "./Tool";
import { ToolBar } from "../ToolBar";
import { Canvas } from "../../Canvas";
import * as d3 from "d3-selection";
import { Shape } from "../../Shapes/Shape";
import { Helpers } from "../../../helpers";

export class SelectTool extends Tool {
    id: string = "select";
    selectedShapes: Shape[];

    constructor(toolBar: ToolBar, selected: boolean) {
        super();
        this.selectedShapes = [];
        this.setupUI(toolBar, selected);
    }

    pointerDown(e: PointerEvent, canvas: Canvas): void {
        super.pointerDown(e, canvas);

        let point = Helpers.pageToSVG({ x: e.pageX, y: e.pageY }, canvas.svgSelection);
        let shape;
        let targetSelection = d3.select(e.target as d3.BaseType);

        if (!e.shiftKey) {
            this.unselectAllShapes();
        }

        if (!Shape.isShape(targetSelection)) {
            d3.selectAll(".shape").each((d: Shape) => {
                if (shape === undefined && d.isPicked(point)) {
                    shape = d;
                }
            });
            if (shape === undefined) {
                return;
            }
        } else {
            shape = Shape.getShape(targetSelection);
        }

        if (this.selectedShapes.includes(shape)) {
            this.unselectShape(shape);
        } else {
            this.selectShape(shape);
        }
    }

    pointerMove(e: PointerEvent, canvas: Canvas): void {
        super.pointerMove(e, canvas);
        if (!this.isDown) {
            return;
        }
    }

    pointerUp(e: PointerEvent, canvas: Canvas): void {
        super.pointerUp(e, canvas);
        if (!this.isDown) {
            return;
        }
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
    }

    selectShape(shape: Shape): void {
        this.selectedShapes.push(shape);
        shape.select();
    }

    unselectShape(shape: Shape): void {
        this.selectedShapes = this.selectedShapes.filter((value) => {
            return value !== shape;
        });
        shape.unselect();
    }

    unselectAllShapes(): void {
        let shapeList = this.selectedShapes.slice();
        shapeList.forEach((shape) => {
            this.unselectShape(shape);
        });
    }

    toUnselect(): void {
        this.unselectAllShapes();
    }
}