import * as d3 from "d3-selection";
import { Peer } from "./Peer";
import { SignalingChannel } from "./SignalingChannel";
import { ActionManager } from "../Actions/ActionManager";
import { RoomServer } from "./roomServer";
import { PeerDisplay } from "../View/InfoPanel/PeerDisplay";
import { EventManager } from "../Events/EventManager";
import { PeerDisconnectEvent } from "../Events/PeerDisconnectEvent";
const io = require('socket.io-client');

export class PeerManager {
    // tslint:disable-next-line: typedef
    roomServer: RoomServer;

    constructor(actionManager: ActionManager) {
        this.roomServer = new RoomServer();
        this.setupServerListeners(actionManager);
    }

    setupServerListeners(actionManager: ActionManager): void {
        this.roomServer.register("newPeer", (data) => {
            let sc = new SignalingChannel(this.roomServer, data.signalingChannel);
            new Peer(sc, actionManager);
        });
        this.roomServer.register("connectToPeer", (data) => {
            let sc = new SignalingChannel(this.roomServer, data.signalingChannel);
            new Peer( sc, actionManager, true);

        });
    }

    joinRoom(roomId: string): void {
        this.roomServer.emit("joinRoom", { roomId: roomId });
        this.roomServer.register("roomJoined", (data) => {
            if (data.status === 404) {
                alert("Room id not correct");
            } else if (data.status === 200) {
                this.displayRoomId(roomId);
            }
        });
    }

    newRoom(): void {
        this.roomServer.emit("newRoom", { });
        this.roomServer.register("roomCreated", (data) => {
            this.displayRoomId(data.roomId);
        });
    }

    displayRoomId(roomId: string): void {
        d3.select("#menu")
            .append("div")
            .attr("id", "room-id")
            .text(`ID: ${roomId}`);

        d3.select("#login-screen").remove();
    }
}
