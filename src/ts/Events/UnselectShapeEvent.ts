import { ActionEvent } from "./EventManager";
import { UnselectShapeAction } from "../Actions/UnselectShapeAction";

/** A class to signal that a shape has been unselected. */
export class UnselectShapeEvent implements ActionEvent {
    id: string = "unselectShape";
    action: UnselectShapeAction;

    constructor(shapeId: string, userId: string, timeStamp: number) {
        this.action = new UnselectShapeAction(shapeId, userId, timeStamp);

    }
}
