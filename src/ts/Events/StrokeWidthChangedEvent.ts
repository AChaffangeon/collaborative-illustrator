import { Event } from "./EventManager";
import { UpdateStrokeWidthAction } from "../Actions/UpdateStrokeWidthAction";

export class StrokeWidthChangedEvent implements Event{
    id: string = "strokeWidthChanged";
    action: UpdateStrokeWidthAction;

    constructor(width: number, shapeId: string) {
        this.action = new UpdateStrokeWidthAction(width, shapeId);
    }
}