"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UpdateStrokeWidthAction_1 = require("../Actions/UpdateStrokeWidthAction");
class StrokeWidthChangedEvent {
    constructor(width, shapeId, userId, timeStamp) {
        this.id = "strokeWidthChanged";
        this.action = new UpdateStrokeWidthAction_1.UpdateStrokeWidthAction(width, shapeId, userId, timeStamp);
    }
}
exports.StrokeWidthChangedEvent = StrokeWidthChangedEvent;
//# sourceMappingURL=StrokeWidthChangedEvent.js.map