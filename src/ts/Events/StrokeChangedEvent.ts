import { ActionEvent } from "./EventManager";
import { UpdateStrokeAction } from "../Actions/UpdateStrokeAction";

/** A class to signal that the stroke property of a shape has been changed. */
export class StrokeChangedEvent implements ActionEvent{
    id: string = "strokeChanged";
    action: UpdateStrokeAction;

    constructor(color: string, shapeId: string, userId: string, timeStamp: number) {
        this.action = new UpdateStrokeAction(color, shapeId, userId, timeStamp);
    }
}
