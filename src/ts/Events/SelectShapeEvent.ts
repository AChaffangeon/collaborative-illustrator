import { ActionEvent } from "./EventManager";
  import { SelectShapeAction } from "../Actions/SelectShapeAction";

export class SelectShapeEvent implements ActionEvent {
    id: string = "selectShape";
    action: SelectShapeAction;

    constructor(shapeId: string, userId: string, timeStamp: number) {
        this.action = new SelectShapeAction(shapeId, userId, timeStamp);

    }
}
