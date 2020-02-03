"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UpdateFillAction {
    constructor(color, shapeId, userId, timeStamp) {
        this.type = "updateFill";
        this.color = color;
        this.objectId = shapeId;
        this.userId = userId;
        this.timeStamp = timeStamp;
    }
    do(canvas) {
        let shape = canvas.getShape(this.objectId);
        if (this.oldColor === undefined) {
            this.oldColor = shape.getFill();
        }
        shape.setFill(this.color);
    }
    undo(canvas) {
        if (this.oldColor !== undefined) {
            let shape = canvas.getShape(this.objectId);
            shape.setFill(this.oldColor);
        }
    }
}
exports.UpdateFillAction = UpdateFillAction;
//# sourceMappingURL=UpdateFillAction.js.map