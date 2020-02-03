"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SelectShapeAction {
    constructor(shapeId, userId, timeStamp, color) {
        this.type = "selectShape";
        this.objectId = shapeId;
        this.userId = userId;
        this.timeStamp = timeStamp;
        this.color = color;
    }
    do(canvas) {
        let shape = canvas.getShape(this.objectId);
        shape.select(this.userId, this.color);
    }
    undo(canvas) {
        let shape = canvas.getShape(this.objectId);
        shape.unselect(this.userId);
    }
}
exports.SelectShapeAction = SelectShapeAction;
//# sourceMappingURL=SelectShapeAction.js.map