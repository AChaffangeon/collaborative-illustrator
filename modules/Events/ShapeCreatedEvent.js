"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AddShapeAction_1 = require("../Actions/AddShapeAction");
class ShapeCreatedEvent {
    constructor(shape, userId, timeStamp) {
        this.id = "shapeCreated";
        this.action = new AddShapeAction_1.AddShapeAction(shape, userId, timeStamp);
    }
}
exports.ShapeCreatedEvent = ShapeCreatedEvent;
//# sourceMappingURL=ShapeCreatedEvent.js.map