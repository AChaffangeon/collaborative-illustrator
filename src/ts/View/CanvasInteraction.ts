import { Canvas } from "./Canvas";
import { FreeForm } from "./Shapes/FreeForm";
import { Helpers } from "../helpers";

export class CanvasInteraction {
    canvas: Canvas;

    constructor(canvas: Canvas) {
        this.canvas = canvas;
        this.setupPointerListeners();
    }

    setupPointerListeners(): void {
        let canvasSVG = this.canvas.holderSelection.node()
        let currentShape: FreeForm;
        let isDown = false;
        
        canvasSVG.addEventListener("pointerdown", (e) => {
            isDown = true;
            let point = { x: e.pageX, y: e.pageY };
            point = Helpers.pageToSVG(point, this.canvas.svgSelection);
            currentShape = new FreeForm(point.x, point.y, this.canvas);
            console.log("ta mere");
        });
        
        canvasSVG.addEventListener("pointermove", (e) => { 
            let point = { x: e.pageX, y: e.pageY };
            point = Helpers.pageToSVG(point, this.canvas.svgSelection);
            if (!isDown) { return; }
            currentShape.addPoint(point.x, point.y);
        });

        canvasSVG.addEventListener("pointerup", (e) => { 
            if (!isDown) { return; }
            isDown = false;
        });

        canvasSVG.addEventListener("pointercancel", (e) => { });
        canvasSVG.addEventListener("pointerleave", (e) => { });
    }
}