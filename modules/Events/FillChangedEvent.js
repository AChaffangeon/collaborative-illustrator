"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UpdateFillAction_1 = require("../Actions/UpdateFillAction");
class FillChangedEvent {
    constructor(color, shapeId, userId, timeStamp) {
        this.id = "fillChanged";
        this.action = new UpdateFillAction_1.UpdateFillAction(color, shapeId, userId, timeStamp);
    }
}
exports.FillChangedEvent = FillChangedEvent;
//# sourceMappingURL=FillChangedEvent.js.map