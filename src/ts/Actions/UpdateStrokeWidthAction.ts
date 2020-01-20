import { ActionManager, Action } from "./ActionManager";
import { Canvas } from "../View/Canvas";

export class UpdateStrokeWidthAction implements Action {
    type: string;
    objectId: string;
    userId: string;
    timeStamp: number;
    width: number;
    oldWidth: number;

    constructor(width: number, shapeId: string, userId: string, timeStamp: number) {
        this.type = "updateStrokeWidth";
        this.width = width;
        this.objectId = shapeId;
        this.userId = userId;
        this.timeStamp = timeStamp;
    }

    do(canvas: Canvas): void {
        let shape = canvas.getShape(this.objectId);
        if (this.oldWidth === undefined ) {
            this.oldWidth = shape.getStrokeWidth();
        }
        shape.setStrokeWidth(this.width);
    }

    undo(canvas: Canvas): void {
        if (this.oldWidth !== undefined) {
            let shape = canvas.getShape(this.objectId);
            shape.setStrokeWidth(this.oldWidth);
        }
    }
}
