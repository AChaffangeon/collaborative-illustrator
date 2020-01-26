import { ActionEvent } from "./EventManager";
import { UpdateStrokeWidthAction } from "../Actions/UpdateStrokeWidthAction";

/** A class to signal that the stroke width property of a shape has been changed. */
export class StrokeWidthChangedEvent implements ActionEvent{
    id: string = "strokeWidthChanged";
    action: UpdateStrokeWidthAction;

    constructor(width: number, shapeId: string, userId: string, timeStamp: number) {
        this.action = new UpdateStrokeWidthAction(width, shapeId, userId, timeStamp);
    }
}