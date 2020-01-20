import { Action, ActionManager } from "./ActionManager";
import { Shape } from "../View/Shapes/Shape";
import { Canvas } from "../View/Canvas";

export class TranslateShapeAction implements Action {
    type: string;
    objectId: string;
    userId: string;
    timeStamp: number = ActionManager.getTimeStamp();
    translate: { dx: number, dy: number };
    oldTranslate: { dx: number, dy: number };

    constructor(translate: { dx: number, dy: number }, shapeId: string, userId: string, timeStamp: number) {
        this.type = "translateShape";
        this.translate = translate;
        this.objectId = shapeId;
        this.userId = userId;
        this.timeStamp = timeStamp;
    }

    do(canvas: Canvas): void {
        let shape = canvas.getShape(this.objectId);
        if (this.oldTranslate === undefined) {
            this.oldTranslate = shape.getTranslate();
        }
        shape.setTranslate(this.translate);
    }

    undo(canvas: Canvas): void {
        let shape = canvas.getShape(this.objectId);
        shape.setTranslate(this.oldTranslate);
    }
}
