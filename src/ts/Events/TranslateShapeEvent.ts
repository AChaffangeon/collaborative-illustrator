import { ActionEvent } from "./EventManager";
import { TranslateShapeAction } from "../Actions/TranslateShapeAction";

/** A class to signal that a shape has been moved. */
export class TranslateShapeEvent implements ActionEvent {
    id: string = "translateShape";
    action: TranslateShapeAction;

    constructor(translate: { dx: number, dy: number }, shapeId: string, userId: string, timeStamp: number) {
        this.action = new TranslateShapeAction(translate, shapeId, userId, timeStamp);
    }
}