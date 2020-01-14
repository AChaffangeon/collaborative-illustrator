import { Event } from "./EventManager";
import { Shape } from "../View/Shapes/Shape";
import { AddShapeAction } from "../Actions/AddShapeAction";

export class ShapeCreatedEvent implements Event {
    id: string = "shapeCreated";
    action: AddShapeAction;

    constructor(shape: Shape) {
        this.action = new AddShapeAction(shape);
    }
}