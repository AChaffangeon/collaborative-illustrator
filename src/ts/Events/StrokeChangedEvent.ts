import { Event } from "./EventManager";
import { UpdateStrokeAction } from "../Actions/UpdateStrokeAction";

export class StrokeChangedEvent implements Event{
    id: string = "strokeChanged";
    action: UpdateStrokeAction;

    constructor(color: string, shapeId: string) {
        this.action = new UpdateStrokeAction(color, shapeId);
    }
}