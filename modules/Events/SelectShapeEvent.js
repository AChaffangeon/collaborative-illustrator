"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SelectShapeAction_1 = require("../Actions/SelectShapeAction");
class SelectShapeEvent {
    constructor(shapeId, userId, timeStamp, color) {
        this.id = "selectShape";
        this.action = new SelectShapeAction_1.SelectShapeAction(shapeId, userId, timeStamp, color);
    }
}
exports.SelectShapeEvent = SelectShapeEvent;
//# sourceMappingURL=SelectShapeEvent.js.map