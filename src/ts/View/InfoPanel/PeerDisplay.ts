import { InfoPanel } from "./InfoPanel";
import { EventManager } from "../../Events/EventManager";
import { Shape } from "../Shapes/Shape";
import { FillChangedEvent } from "../../Events/FillChangedEvent";
import { ActionManager } from "../../Actions/ActionManager";
import * as d3 from "d3-selection";
import { PeerConnectEvent } from "../../Events/PeerConnectEvent";
import { PeerDisconnectEvent } from "../../Events/PeerDisconnectEvent";

interface PeerInfo { color: string; id: string; }

export class PeerDisplay {
    holderSelection: d3.Selection<HTMLDivElement, any, any, any>;
    svg: d3.Selection<SVGElement, any, any, any>;
    peerInfoList: PeerInfo[] = [];

    constructor(infoPanel: InfoPanel) {
        this.holderSelection = infoPanel.holderSelection
            .append("div")
                .attr("id", "peer-list")
                .classed("info-panel-element", true);

        this.setupUI();
        this.setupEventHandlers();
    }

    addNewPeer(color: string, id: string): void {
      this.holderSelection
        .select(".body")
            .append("div")
                .attr("id", `peer-circle-${id}`)
                .classed("peer-circle", true)
                .style("border-color", color);
    }

    removePeer(id: string): void {
        console.log(id);
        let circle = d3.select(`#peer-circle-${id}`);
        if (!circle.empty()) {
            circle.remove();
        }
    }

    private setupUI(): void {
        this.holderSelection
            .append("div")
                .classed("header", true)
                .text("Connected peers");
        this.holderSelection
            .append("div")
                .classed("body", true);
    }

    private setupEventHandlers(): void {
        EventManager.registerHandler("peerConnect", (e: PeerConnectEvent) => {
            this.addNewPeer(e.color, e.userId);
        });

        EventManager.registerHandler("peerDisconnect", (e: PeerDisconnectEvent) => {
            this.removePeer(e.userId);
        });
    }
}
