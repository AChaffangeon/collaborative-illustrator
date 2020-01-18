import { ActionManager, Action } from "./ActionManager";
import { Canvas } from "../View/Canvas";

export class UpdateFillAction implements Action {
    objectId: string;
    userId: string =  ActionManager.userId;
    timeStamp: number = ActionManager.getTimeStamp();
    color: string;
    oldColor: string;

    constructor(color: string, shapeId: string) {
        this.color = color;
        this.objectId = shapeId;
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