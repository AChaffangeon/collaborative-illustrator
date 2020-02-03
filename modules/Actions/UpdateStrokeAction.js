"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UpdateStrokeAction {
    constructor(color, shapeId, userId, timeStamp) {
        this.type = "updateStroke";
        this.color = color;
        this.objectId = shapeId;
        this.userId = userId;
        this.timeStamp = timeStamp;
    }
    do(canvas) {
        let shape = canvas.getShape(this.objectId);
        if (this.oldColor === undefined) {
            this.oldColor = shape.getStroke();
        }
        shape.setStroke(this.color);
    }
    undo(canvas) {
        if (this.oldColor !== undefined) {
            let shape = canvas.getShape(this.objectId);
            shape.setStroke(this.oldColor);
        }
    }
}
exports.UpdateStrokeAction = UpdateStrokeAction;
//# sourceMappingURL=UpdateStrokeAction.js.map