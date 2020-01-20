import { ActionManager, Action } from "./ActionManager";
import { Canvas } from "../View/Canvas";

export class UpdateFillAction implements Action {
    type: string;
    objectId: string;
    userId: string ;
    timeStamp: number;
    color: string;
    oldColor: string;

    constructor(color: string, shapeId: string, userId: string, timeStamp: number) {
        this.type = "updateFill";
        this.color = color;
        this.objectId = shapeId;
        this.userId = userId;
        this.timeStamp = timeStamp;
    }

    do(canvas: Canvas): void {
        let shape = canvas.getShape(this.objectId);
        if ( this.oldColor === undefined ) {
            this.oldColor = shape.getFill();
        }
        shape.setFill(this.color);
    }

    undo(canvas: Canvas): void {
        if (this.oldColor !== undefined) {
            let shape = canvas.getShape(this.objectId);
            shape.setFill(this.oldColor);
        }
    }
}
