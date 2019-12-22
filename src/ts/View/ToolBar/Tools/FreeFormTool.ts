import { Tool } from "./Tool";
import { ToolBar } from "../ToolBar";
import { Canvas } from "../../Canvas";
import { FreeForm } from "../../Shapes/FreeForm";
import { Helpers } from "../../../helpers";

export class FreeFormTool extends Tool {
    id: string = "freeform";
    currentShape: FreeForm;

    constructor(toolBar: ToolBar, selected: boolean) {
        super();
        this.setupUI(toolBar, selected);
    }

    pointerDown(e: PointerEvent, canvas: Canvas): void {
        super.pointerDown(e, canvas);
        let point = { x: e.pageX, y: e.pageY };
        point = Helpers.pageToSVG(point, canvas.svgSelection);

        this.currentShape = new FreeForm(point.x, point.y, canvas);
     }

    pointerMove(e: PointerEvent, canvas: Canvas): void {
        super.pointerMove(e, canvas);
        if (!this.isDown) {
            return;
        }
        let point = { x: e.pageX, y: e.pageY };
        point = Helpers.pageToSVG(point, canvas.svgSelection);

        this.currentShape.addPoint(point.x, point.y);
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
}