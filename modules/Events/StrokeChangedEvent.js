"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UpdateStrokeAction_1 = require("../Actions/UpdateStrokeAction");
class StrokeChangedEvent {
    constructor(color, shapeId, userId, timeStamp) {
        this.id = "strokeChanged";
        this.action = new UpdateStrokeAction_1.UpdateStrokeAction(color, shapeId, userId, timeStamp);
    }
}
exports.StrokeChangedEvent = StrokeChangedEvent;
//# sourceMappingURL=StrokeChangedEvent.js.map