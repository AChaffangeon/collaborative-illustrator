import { InfoPanel } from "./InfoPanel";
import { EventManager } from "../../Events/EventManager";
import { Shape } from "../Shapes/Shape";
import { FillChangedEvent } from "../../Events/FillChangedEvent";
import { ActionManager } from "../../Actions/ActionManager";
import * as d3 from "d3-selection";

interface PeerInfo { color: string; id: string; }

export class PeerDisplay {

    static holderSelection: d3.Selection<HTMLDivElement, any, any, any>;
    static svg: d3.Selection<SVGElement, any, any, any>;
    static peerInfoList: PeerInfo[] = [];

    constructor(infoPanel: InfoPanel) {
        PeerDisplay.holderSelection = infoPanel.holderSelection
            .append("div")
                .attr("id", "peerList")
                .classed("peerList", true);
        PeerDisplay.setupUI();
        PeerDisplay.svg = PeerDisplay.holderSelection.append("svg");

        PeerDisplay.redrawCircles();
    }

    static addNewPeer(color: string, id: string): void {
      let peer: PeerInfo = { color: color, id: id};
      PeerDisplay.peerInfoList.push(peer);
      PeerDisplay.redrawCircles();
    }

    static removePeer(id: string): void {
      let cpt = 0;
      for (let i of PeerDisplay.peerInfoList) {
        if (PeerDisplay.peerInfoList[cpt].id === id) {
            PeerDisplay.peerInfoList.splice(cpt, 1);
          break;
        }
        cpt++;
      }
      PeerDisplay.redrawCircles();
    }

    private static setupUI(): void {
        PeerDisplay.holderSelection
            .append("div")
                .classed("header", true)
                .text("Other collaborators connected");
    }

    private static redrawCircles(): void {
        let nbInLine = 0;
        PeerDisplay.svg.remove();
        PeerDisplay.svg = PeerDisplay.holderSelection.append("svg");
        for (let peerInfo of PeerDisplay.peerInfoList) {
          PeerDisplay.svg.append('circle')
              .attr('cx', 30 + 40 * (nbInLine % 6))
              .attr('cy', 20 + 40 * Math.floor(nbInLine / 6))
              .attr('r', 15)
              .attr('stroke', peerInfo.color)
              .attr('fill', '#ffffff')
              .attr("stroke-width", "3");
              nbInLine++;

        }

    }

}
