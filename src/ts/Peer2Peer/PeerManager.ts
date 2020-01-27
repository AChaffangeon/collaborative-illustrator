import * as d3 from "d3-selection";
import { Peer } from "./Peer";
import { SignalingChannel } from "./SignalingChannel";
import { ActionManager } from "../Actions/ActionManager";
import { RoomServer } from "./roomServer";

/** A class to manage multiple peers. */
export class PeerManager {
    // tslint:disable-next-line: typedef
    /** Room server to get notification of new user from. */
    roomServer: RoomServer;

    constructor(actionManager: ActionManager) {
        this.roomServer = new RoomServer();
        this.setupServerListeners(actionManager);
    }

    /**
     * Setups room server listeners.
     * @param actionManager Action Manage to pass to new peer.
     */
    private setupServerListeners(actionManager: ActionManager): void {
        this.roomServer.register("newPeer", (data) => {
            let sc = new SignalingChannel(this.roomServer, data.signalingChannel);
            new Peer(sc, actionManager, data.userId);
        });
        this.roomServer.register("connectToPeer", (data) => {
            let sc = new SignalingChannel(this.roomServer, data.signalingChannel);
            new Peer(sc, actionManager, data.userId, true);

        });
    }

    /**
     * Notify the room server that we want to join a room.
     * @param roomId Id of the room we want to join.
     */
    joinRoom(roomId: string): void {
        this.roomServer.emit("joinRoom", { roomId: roomId });
        this.roomServer.register("roomJoined", (data) => {
            if (data.status === 404) {
                alert("Room id not correct");
            } else if (data.status === 200) {
                ActionManager.userId = data.userId;
                this.displayRoomId(roomId);
            }
        });
    }

    /**
     * Notify the room server that we want to create a new room.
     */
    newRoom(): void {
        this.roomServer.emit("newRoom", { });
        this.roomServer.register("roomCreated", (data) => {
            ActionManager.userId = data.userId;
            this.displayRoomId(data.roomId);
        });
    }

    /**
     * Displays the room id.
     * @param roomId room id to displayed.
     */
    private displayRoomId(roomId: string): void {
        d3.select("#room-id").remove();
        d3.select("#menu")
            .append("div")
            .attr("id", "room-id")
            .text(`ID: ${roomId}`);

        d3.select("#login-screen").remove();
    }
}
