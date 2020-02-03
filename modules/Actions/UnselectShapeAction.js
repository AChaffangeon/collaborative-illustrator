"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UnselectShapeAction {
    constructor(shapeId, userId, timeStamp) {
        this.type = "unselectShape";
        this.objectId = shapeId;
        this.userId = userId;
        this.timeStamp = timeStamp;
    }
    do(canvas) {
        let shape = canvas.getShape(this.objectId);
        shape.unselect(this.userId);
    }
    undo(canvas) {
    }
}
exports.UnselectShapeAction = UnselectShapeAction;
//# sourceMappingURL=UnselectShapeAction.js.map