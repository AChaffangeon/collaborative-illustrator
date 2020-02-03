"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ActionManager_1 = require("../Actions/ActionManager");
class PeerConnectEvent {
    constructor(userId, color) {
        this.id = "peerConnect";
        this.userId = userId;
        this.color = color;
        ActionManager_1.ActionManager.addNewPeer(this.userId);
    }
}
exports.PeerConnectEvent = PeerConnectEvent;
//# sourceMappingURL=PeerConnectEvent.js.map