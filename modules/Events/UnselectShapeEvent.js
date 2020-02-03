"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UnselectShapeAction_1 = require("../Actions/UnselectShapeAction");
class UnselectShapeEvent {
    constructor(shapeId, userId, timeStamp) {
        this.id = "unselectShape";
        this.action = new UnselectShapeAction_1.UnselectShapeAction(shapeId, userId, timeStamp);
    }
}
exports.UnselectShapeEvent = UnselectShapeEvent;
//# sourceMappingURL=UnselectShapeEvent.js.map