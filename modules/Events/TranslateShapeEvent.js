"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TranslateShapeAction_1 = require("../Actions/TranslateShapeAction");
class TranslateShapeEvent {
    constructor(translate, shapeId, userId, timeStamp) {
        this.id = "translateShape";
        this.action = new TranslateShapeAction_1.TranslateShapeAction(translate, shapeId, userId, timeStamp);
    }
}
exports.TranslateShapeEvent = TranslateShapeEvent;
//# sourceMappingURL=TranslateShapeEvent.js.map