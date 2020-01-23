import * as d3 from "d3-selection";
import { Peer } from "./Peer";
import { SignalingChannel } from "./SignalingChannel";
import { ActionManager } from "../Actions/ActionManager";
import { RoomServer } from "./roomServer";
import { PeerDisplay } from "../View/InfoPanel/PeerDisplay";
const io = require('socket.io-client');

export class PeerManager {
    // tslint:disable-next-line: typedef
    roomServer: RoomServer;
    peerDisplay: PeerDisplay;

    constructor(actionManager: ActionManager, peerDisplay: PeerDisplay) {
        this.roomServer = new RoomServer();
        this.peerDisplay = peerDisplay;
        this.setupServerListeners(actionManager);
    }



    setupServerListeners(actionManager: ActionManager): void {
        this.roomServer.register("newPeer", (data) => {
            console.log("new user:", data.signalingChannel);
            let sc = new SignalingChannel(this.roomServer, data.signalingChannel);
            new Peer(this.peerDisplay, sc, actionManager);
        });
        this.roomServer.register("connectToPeer", (data) => {
            console.log("connect to user:", data.signalingChannel);
            let sc = new SignalingChannel(this.roomServer, data.signalingChannel);
            new Peer(this.peerDisplay, sc, actionManager, true);

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
