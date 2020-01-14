import * as d3 from "d3-selection";
import { Peer } from "./Peer";

export class PeerManager {
    peers: Peer[];

    constructor() {
        this.peers = [];
        this.setupListeners();
    }

    private setupListeners(): void {


        d3.select("#menu").append("button")
            .on("click", () => { this.createSalon(); })
            .text("new");

        d3.select("#menu").append("button")
            .on("click", () => { this.requestConnection(); })
            .text("connect");
    }

    requestConnection(): void {
        console.log("request");
        new Peer(true);
    }

    createSalon(): void {
        console.log("new");
        new Peer();
    }
}