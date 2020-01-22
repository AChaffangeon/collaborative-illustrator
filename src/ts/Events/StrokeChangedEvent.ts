import { ActionEvent } from "./EventManager";
import { UpdateStrokeAction } from "../Actions/UpdateStrokeAction";

export class StrokeChangedEvent implements ActionEvent{
    id: string = "strokeChanged";
    action: UpdateStrokeAction;

    constructor(color: string, shapeId: string, userId: string, timeStamp: number) {
        this.action = new UpdateStrokeAction(color, shapeId, userId, timeStamp);
    }
}
