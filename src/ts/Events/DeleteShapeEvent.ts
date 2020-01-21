import { Event } from "./EventManager";
import { Shape } from "../View/Shapes/Shape";
import { DeleteShapeAction } from "../Actions/DeleteShapeAction";

export class DeleteShapeEvent implements Event {
    id: string = "shapeDeleted";
    action: DeleteShapeAction;

    constructor( shapeId: string, userId: string, timeStamp: number) {
        this.action = new DeleteShapeAction(shapeId, userId, timeStamp);
    }
}
