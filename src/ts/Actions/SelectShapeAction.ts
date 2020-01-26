import { Action, ActionManager } from "./ActionManager";
import { Canvas } from "../View/Canvas";

/** A class to select a shape in a canvas. */
export class SelectShapeAction implements Action {
    type: string;
    objectId: string;
    userId: string;
    timeStamp: number = ActionManager.getTimeStamp();
    color: string;

    constructor(shapeId: string, userId: string, timeStamp: number, color: string) {
        this.type = "selectShape";
        this.objectId = shapeId;
        this.userId = userId;
        this.timeStamp = timeStamp;
        this.color = color;
    }

    do(canvas: Canvas): void {
      let shape = canvas.getShape(this.objectId);
      shape.select(this.userId, this.color);
    }

    undo(canvas: Canvas): void {
        let shape = canvas.getShape(this.objectId);
        shape.unselect(this.userId);
    }
}
