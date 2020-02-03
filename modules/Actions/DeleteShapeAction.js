"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ActionManager_1 = require("./ActionManager");
class DeleteShapeAction {
    constructor(shapeId, userId, timeStamp) {
        this.type = "deleteShape";
        this.objectId = shapeId;
        this.userId = userId;
        this.timeStamp = timeStamp;
    }
    do(canvas) {
        ActionManager_1.ActionManager.deletedShapes.push(this.objectId);
        let shape = canvas.getShape(this.objectId);
        shape.removeFromCanvas(canvas);
    }
    undo(canvas) {
        ActionManager_1.ActionManager.deletedShapes.splice(ActionManager_1.ActionManager.deletedShapes.indexOf(this.objectId), 1);
        let shape = canvas.getShape(this.objectId);
        shape.addToCanvas(canvas);
    }
}
exports.DeleteShapeAction = DeleteShapeAction;
//# sourceMappingURL=DeleteShapeAction.js.map