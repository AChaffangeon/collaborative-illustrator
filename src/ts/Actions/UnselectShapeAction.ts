import { Action, ActionManager } from "./ActionManager";
import { Shape } from "../View/Shapes/Shape";
import { Canvas } from "../View/Canvas";

export class UnselectShapeAction implements Action {
    type: string;
    objectId: string;
    userId: string;
    timeStamp: number = ActionManager.getTimeStamp();

    constructor(shapeId: string, userId: string, timeStamp: number) {
        this.type = "unselectShape";
        this.objectId = shapeId;
        this.userId = userId;
        this.timeStamp = timeStamp;
    }

    do(canvas: Canvas): void {
      let shape = canvas.getShape(this.objectId);
      shape.unselectbyId(this.userId);
    }

    undo(canvas: Canvas): void {
    }
}
