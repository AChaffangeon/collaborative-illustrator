"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ActionManager_1 = require("./ActionManager");
class AddShapeAction {
    constructor(shape, userId, timeStamp) {
        this.type = "addShape";
        this.shape = shape;
        this.objectId = shape.id;
        this.userId = userId;
        this.timeStamp = timeStamp;
    }
    do(canvas) {
        ActionManager_1.ActionManager.createdShapes.push(this.objectId);
        this.shape.addToCanvas(canvas);
    }
    undo(canvas) {
        ActionManager_1.ActionManager.createdShapes.splice(ActionManager_1.ActionManager.createdShapes.indexOf(this.objectId), 1);
        this.shape.removeFromCanvas(canvas);
    }
}
exports.AddShapeAction = AddShapeAction;
//# sourceMappingURL=AddShapeAction.js.map