import * as d3 from "d3-selection";

import { PeerManager } from "./Peer2Peer/PeerManager";

export class LoginMenu {
    constructor() {
        this.setupInteractions();
    }

    setupInteractions(): void {
        let pm = new PeerManager();
        d3.select("#new-room-button")
            .on("click", () => {
                pm.newRoom();
            });

        d3.select("#join-room-button")
            .on("click", () => {
                let value = (document.getElementById("join-room-roomid") as HTMLInputElement).value;
                pm.joinRoom(value);
            });
    }
}