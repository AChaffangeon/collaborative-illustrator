import { Action, ActionManager } from "./ActionManager";
import { Shape } from "../View/Shapes/Shape";
import { Canvas } from "../View/Canvas";

export class AddShapeAction implements Action {
    objectId: string = ActionManager.userId + "-Canvas";
    userId: string = ActionManager.userId;
    timeStamp: number = ActionManager.getTimeStamp();
    shape: Shape;

    constructor(shape: Shape) {
        this.shape = shape;
    }

    do(canvas: Canvas): void {
        this.shape.addToCanvas(canvas);
    }

    undo(canvas: Canvas): void {
        this.shape.removeFromCanvas(canvas);
    }
}