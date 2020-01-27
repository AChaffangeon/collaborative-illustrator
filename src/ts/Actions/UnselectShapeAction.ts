import { Action, ActionManager } from "./ActionManager";
import { Canvas } from "../View/Canvas";

/** A class to unselect a shape in a canvas. */
export class UnselectShapeAction implements Action {
    type: string;
    objectId: string;
    userId: string;
    timeStamp: number;

    constructor(shapeId: string, userId: string, timeStamp: number) {
        this.type = "unselectShape";
        this.objectId = shapeId;
        this.userId = userId;
        this.timeStamp = timeStamp;
    }

    do(canvas: Canvas): void {
      let shape = canvas.getShape(this.objectId);
      shape.unselect(this.userId);
    }

    undo(canvas: Canvas): void {
    }
}
