import * as d3 from "d3-selection";
import { PeerManager } from "./Peer2Peer/PeerManager";

/** A class to create a login menu. */
export class LoginMenu {
    constructor(peerManager: PeerManager) {
        this.setupInteractions(peerManager);
    }

    setupInteractions(peerManager: PeerManager): void {
        d3.select("#new-room-button")
            .on("click", () => {
                peerManager.newRoom();
            });

        d3.select("#join-room-button")
            .on("click", () => {
                let value = (document.getElementById("join-room-roomid") as HTMLInputElement).value;
                peerManager.joinRoom(`room-${value}`);
            });
    }
}