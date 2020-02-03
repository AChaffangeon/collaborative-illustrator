"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3-selection");
const Peer_1 = require("./Peer");
const SignalingChannel_1 = require("./SignalingChannel");
const ActionManager_1 = require("../Actions/ActionManager");
const roomServer_1 = require("./roomServer");
class PeerManager {
    constructor(actionManager) {
        this.roomServer = new roomServer_1.RoomServer();
        this.actionManager = actionManager;
        this.setupServerListeners();
    }
    setupServerListeners() {
        this.roomServer.register("newPeer", (data) => {
            let sc = new SignalingChannel_1.SignalingChannel(this.roomServer, data.signalingChannel);
            new Peer_1.Peer(sc, this.actionManager, data.userId);
        });
        this.roomServer.register("connectToPeer", (data) => {
            let sc = new SignalingChannel_1.SignalingChannel(this.roomServer, data.signalingChannel);
            new Peer_1.Peer(sc, this.actionManager, data.userId, true);
        });
    }
    joinRoom(roomId) {
        this.roomServer.emit("joinRoom", { roomId: roomId });
        this.roomServer.register("roomJoined", (data) => {
            if (data.status === 404) {
                alert("Room id not correct");
            }
            else if (data.status === 200) {
                ActionManager_1.ActionManager.userId = data.userId;
                this.actionManager.canvas.infoPanel.peerList.addMainPeer();
                this.displayRoomId(roomId);
            }
        });
    }
    newRoom() {
        this.roomServer.emit("newRoom", {});
        this.roomServer.register("roomCreated", (data) => {
            ActionManager_1.ActionManager.userId = data.userId;
            this.actionManager.canvas.infoPanel.peerList.addMainPeer();
            this.displayRoomId(data.roomId);
        });
    }
    displayRoomId(roomId) {
        d3.select("#room-id").remove();
        d3.select("#menu")
            .append("div")
            .attr("id", "room-id")
            .text(`ID: ${roomId}`);
        d3.select("#login-screen").remove();
    }
}
exports.PeerManager = PeerManager;
//# sourceMappingURL=PeerManager.js.map