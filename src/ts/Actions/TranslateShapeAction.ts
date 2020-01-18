import { Action, ActionManager } from "./ActionManager";
import { Shape } from "../View/Shapes/Shape";
import { Canvas } from "../View/Canvas";

export class TranslateShapeAction implements Action {
    objectId: string = ActionManager.userId + "-Canvas";
    userId: string = ActionManager.userId;
    timeStamp: number = ActionManager.getTimeStamp();
    translate: { dx: number, dy: number };
    oldTranslate: { dx: number, dy: number };

    constructor(translate: { dx: number, dy: number }, shapeId: string) {
        this.translate = translate;
        this.objectId = shapeId;
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