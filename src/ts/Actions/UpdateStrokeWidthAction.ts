import { ActionManager, Action } from "./ActionManager";
import { Canvas } from "../View/Canvas";

export class UpdateStrokeWidthAction implements Action {
    objectId: string;
    userId: string =  ActionManager.userId;
    timeStamp: number = ActionManager.getTimeStamp();
    width: number;
    oldWidth: number;

    constructor(width: number, shapeId: string) {
        this.width = width;
        this.objectId = shapeId;
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