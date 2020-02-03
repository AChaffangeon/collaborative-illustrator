"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TranslateShapeAction {
    constructor(translate, shapeId, userId, timeStamp) {
        this.type = "translateShape";
        this.translate = translate;
        this.objectId = shapeId;
        this.userId = userId;
        this.timeStamp = timeStamp;
    }
    do(canvas) {
        let shape = canvas.getShape(this.objectId);
        if (this.oldTranslate === undefined) {
            this.oldTranslate = shape.getTranslate();
        }
        shape.setTranslate(this.translate);
    }
    undo(canvas) {
        let shape = canvas.getShape(this.objectId);
        shape.setTranslate(this.oldTranslate);
    }
}
exports.TranslateShapeAction = TranslateShapeAction;
//# sourceMappingURL=TranslateShapeAction.js.map