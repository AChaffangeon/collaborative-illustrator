import { ActionEvent } from "./EventManager";
import { UpdateFillAction } from "../Actions/UpdateFillAction";

/** A class to signal that the fill property of a shape has been changed. */
export class FillChangedEvent implements ActionEvent{
    id: string = "fillChanged";
    action: UpdateFillAction;

    constructor(color: string, shapeId: string, userId: string, timeStamp: number) {
        this.action = new UpdateFillAction(color, shapeId, userId, timeStamp);
    }
}
