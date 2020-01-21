import { Action, ActionManager } from "./ActionManager";
import { Shape } from "../View/Shapes/Shape";
import { Canvas } from "../View/Canvas";

export class AddShapeAction implements Action {
    type: string;
    objectId: string;
    userId: string;
    timeStamp: number;
    shape: Shape;

    constructor(shape: Shape, userId: string, timeStamp: number) {
        this.type = "addShape";
        this.shape = shape;
        this.objectId = shape.id;
        this.userId = userId;
        this.timeStamp = timeStamp;
    }

    do(canvas: Canvas): void {
        ActionManager.createdShapes.push(this.objectId);
        this.shape.addToCanvas(canvas);
    }

    undo(canvas: Canvas): void {
        ActionManager.createdShapes.splice(ActionManager.createdShapes.indexOf(this.objectId),1);
        this.shape.removeFromCanvas(canvas);
    }
}
