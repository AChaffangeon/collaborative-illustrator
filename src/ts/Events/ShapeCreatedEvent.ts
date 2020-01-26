import { ActionEvent } from "./EventManager";
import { Shape } from "../View/Shapes/Shape";
import { AddShapeAction } from "../Actions/AddShapeAction";

/** A class to signal that a shape has been created. */
export class ShapeCreatedEvent implements ActionEvent {
    id: string = "shapeCreated";
    action: AddShapeAction;

    constructor(shape: Shape, userId: string, timeStamp: number) {
        this.action = new AddShapeAction(shape, userId, timeStamp);
    }
}