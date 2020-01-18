import { Event } from "./EventManager";
import { TranslateShapeAction } from "../Actions/TranslateShapeAction";

export class TranslateShapeEvent implements Event {
    id: string = "translateShape";
    action: TranslateShapeAction;

    constructor(translate: { dx: number, dy: number}, shapeId: string) {
        this.action = new TranslateShapeAction(translate, shapeId);
    }
}