"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DeleteShapeAction_1 = require("../Actions/DeleteShapeAction");
class DeleteShapeEvent {
    constructor(shapeId, userId, timeStamp) {
        this.id = "shapeDeleted";
        this.action = new DeleteShapeAction_1.DeleteShapeAction(shapeId, userId, timeStamp);
    }
}
exports.DeleteShapeEvent = DeleteShapeEvent;
//# sourceMappingURL=DeleteShapeEvent.js.map