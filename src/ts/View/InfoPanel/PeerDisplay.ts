import { InfoPanel } from "./InfoPanel";
import { EventManager } from "../../Events/EventManager";
import { Shape } from "../Shapes/Shape";
import { FillChangedEvent } from "../../Events/FillChangedEvent";
import { ActionManager } from "../../Actions/ActionManager";
import * as d3 from "d3-selection";

interface PeerInfo { color: string };

export class PeerDisplay {

    holderSelection: d3.Selection<HTMLDivElement, any, any, any>;
    svg: d3.Selection<SVGElement, any, any, any>;
    peerInfoList: PeerInfo[];

    constructor(infoPanel: InfoPanel) {
        this.holderSelection = infoPanel.holderSelection
            .append("div")
                .attr("id", "peerList")
                .classed("peerList", true);

        this.peerInfoList = [];

        this.setupUI();
        this.svg = this.holderSelection.append("svg");

        this.redrawCircles();
    }

    addNewPeer(color:string): void{
      let peer: PeerInfo = {color:color};
      this.peerInfoList.push(peer);
      this.redrawCircles();
    }
/*
    private removePeer(id:string): void{
      let cpt = 0;
      for(let i in this.peerInfoList){
        if(this.peerInfoList[cpt].id === id){
            this.peerInfoList.splice(cpt,1);
          break;
        }
        cpt++;
      }
    }*/

    private setupUI(): void {
        this.holderSelection
            .append("div")
                .classed("header", true)
                .text("Collaborators list");
    }

    private redrawCircles(): void {
        let nbInLine = 0;
        for(let peerInfo of this.peerInfoList){
          this.svg.append('circle')
              .attr('cx', 30 + 40*(nbInLine%6))
              .attr('cy', 20 + 40*Math.floor(nbInLine/6))
              .attr('r', 15)
              .attr('stroke', peerInfo.color)
              .attr('fill', '#ffffff')
              .attr("stroke-width","3");
              nbInLine++;

        }

    }

}
