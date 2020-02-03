"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ActionManager_1 = require("../Actions/ActionManager");
class PeerDisconnectEvent {
    constructor(userId) {
        this.id = "peerDisconnect";
        this.userId = userId;
        ActionManager_1.ActionManager.removePeer(this.userId);
    }
}
exports.PeerDisconnectEvent = PeerDisconnectEvent;
//# sourceMappingURL=PeerDisconnectEvent.js.map