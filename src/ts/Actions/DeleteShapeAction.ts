import { Action, ActionManager } from "./ActionManager";
import { Canvas } from "../View/Canvas";


export class DeleteShapeAction implements Action {
    type: string;
    objectId: string;
    userId: string;
    timeStamp: number = ActionManager.getTimeStamp();

    constructor(shapeId: string, userId: string, timeStamp: number) {
        this.type = "deleteShape";
        this.objectId = shapeId;
        this.userId = userId;
        this.timeStamp = timeStamp;
    }

    do(canvas: Canvas): void {
        ActionManager.deletedShapes.push(this.objectId);
        let shape = canvas.getShape(this.objectId);
        shape.removeFromCanvas(canvas);
    }

    undo(canvas: Canvas): void {
        ActionManager.deletedShapes.splice(ActionManager.deletedShapes.indexOf(this.objectId),1);
        let shape = canvas.getShape(this.objectId);
        shape.addToCanvas(canvas);
    }
}
