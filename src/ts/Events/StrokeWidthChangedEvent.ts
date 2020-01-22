import { ActionEvent } from "./EventManager";
import { UpdateStrokeWidthAction } from "../Actions/UpdateStrokeWidthAction";

export class StrokeWidthChangedEvent implements ActionEvent{
    id: string = "strokeWidthChanged";
    action: UpdateStrokeWidthAction;

    constructor(width: number, shapeId: string, userId: string, timeStamp: number) {
        this.action = new UpdateStrokeWidthAction(width, shapeId, userId, timeStamp);
    }
}