import { Event } from "./EventManager";
import { UpdateFillAction } from "../Actions/UpdateFillAction";

export class FillChangedEvent implements Event{
    id: string = "fillChanged";
    action: UpdateFillAction;

    constructor(color: string, shapeId: string, userId: string, timeStamp: number) {
        this.action = new UpdateFillAction(color, shapeId, userId, timeStamp);
    }
}