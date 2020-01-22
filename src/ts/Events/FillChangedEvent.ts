import { ActionEvent } from "./EventManager";
import { UpdateFillAction } from "../Actions/UpdateFillAction";

export class FillChangedEvent implements ActionEvent{
    id: string = "fillChanged";
    action: UpdateFillAction;

    constructor(color: string, shapeId: string, userId: string, timeStamp: number) {
        this.action = new UpdateFillAction(color, shapeId, userId, timeStamp);
    }
}
