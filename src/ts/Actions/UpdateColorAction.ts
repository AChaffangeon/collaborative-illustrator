import { ActionManager, Action } from "./ActionManager";
import { Canvas } from "../View/Canvas";

export class UpdateColorAction implements Action {
    UserId: string =  ActionManager.UserId;
    color: string;
    oldColor: string;
    shapeId: string;

    constructor(color: string, shapeId: string) {
        this.color = color;
        this.shapeId = shapeId;
    }

    do(canvas: Canvas): void {
        let shape = canvas.getShape(this.shapeId);
        if ( this.oldColor === undefined ) {
            this.oldColor = shape.getStroke();
        }
        shape.setStroke(this.color);
    }

    undo(canvas: Canvas): void {
        if (this.oldColor !== undefined) {
            let shape = canvas.getShape(this.shapeId);
            shape.setStroke(this.oldColor);
        }
    }
}