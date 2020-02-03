"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UpdateStrokeWidthAction {
    constructor(width, shapeId, userId, timeStamp) {
        this.type = "updateStrokeWidth";
        this.width = width;
        this.objectId = shapeId;
        this.userId = userId;
        this.timeStamp = timeStamp;
    }
    do(canvas) {
        let shape = canvas.getShape(this.objectId);
        if (this.oldWidth === undefined) {
            this.oldWidth = shape.getStrokeWidth();
        }
        shape.setStrokeWidth(this.width);
    }
    undo(canvas) {
        if (this.oldWidth !== undefined) {
            let shape = canvas.getShape(this.objectId);
            shape.setStrokeWidth(this.oldWidth);
        }
    }
}
exports.UpdateStrokeWidthAction = UpdateStrokeWidthAction;
//# sourceMappingURL=UpdateStrokeWidthAction.js.map