import { ActionEvent } from "./EventManager";
import { DeleteShapeAction } from "../Actions/DeleteShapeAction";

/** A class to signal that a shape has been deleted. */
export class DeleteShapeEvent implements ActionEvent {
    id: string = "shapeDeleted";
    action: DeleteShapeAction;

    constructor( shapeId: string, userId: string, timeStamp: number) {
        this.action = new DeleteShapeAction(shapeId, userId, timeStamp);
    }
}
