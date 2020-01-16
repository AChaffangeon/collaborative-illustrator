import { Action, ActionManager } from "./ActionManager";
import { Shape } from "../View/Shapes/Shape";
import { Canvas } from "../View/Canvas";

export class AddShapeAction implements Action {
    ObjectId: string = ActionManager.UserId + "-Canvas";
    UserId: string = ActionManager.UserId;
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