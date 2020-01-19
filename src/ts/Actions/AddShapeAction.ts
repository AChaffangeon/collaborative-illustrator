import { Action, ActionManager } from "./ActionManager";
import { Shape } from "../View/Shapes/Shape";
import { Canvas } from "../View/Canvas";

export class AddShapeAction implements Action {
    objectId: string = ActionManager.userId + "-Canvas";
    userId: string;
    timeStamp: number;
    shape: Shape;

    constructor(shape: Shape, userId: string, timeStamp: number) {
        this.shape = shape;
        this.userId = userId;
        this.timeStamp = timeStamp;
    }

    do(canvas: Canvas): void {
        this.shape.addToCanvas(canvas);
    }

    undo(canvas: Canvas): void {
        this.shape.removeFromCanvas(canvas);
    }
}