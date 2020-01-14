import { Action, ActionManager } from "./ActionManager";
import { Shape } from "../View/Shapes/Shape";
import { Canvas } from "../View/Canvas";

export class AddShapeAction implements Action {
    UserId: string = ActionManager.UserId;
    shape: Shape;

    constructor(shape: Shape) {
        this.shape = shape;
    }

    do(canvas: Canvas): void {
        this.shape.addToCanvas(canvas);
    }

    undo(canvas: Canvas): void {

    }
}