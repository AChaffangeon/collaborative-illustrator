"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventManager_1 = require("../../Events/EventManager");
const ActionManager_1 = require("../../Actions/ActionManager");
const d3 = require("d3-selection");
class PeerDisplay {
    constructor(infoPanel) {
        this.holderSelection = infoPanel.holderSelection
            .append("div")
            .attr("id", "peer-list")
            .classed("info-panel-element", true);
        this.setupUI();
        this.setupEventHandlers();
    }
    addMainPeer() {
        this.holderSelection
            .select(".body")
            .append("div")
            .attr("id", `my-circle${ActionManager_1.ActionManager.userId}`)
            .classed("peer-circle", true)
            .classed("main-circle", true)
            .style("border-color", "#56B4E9")
            .text(ActionManager_1.ActionManager.userId);
    }
    addNewPeer(color, id) {
        this.holderSelection
            .select(".body")
            .append("div")
            .attr("id", `peer-circle-${id}`)
            .classed("peer-circle", true)
            .style("border-color", color)
            .text(id);
    }
    removePeer(id) {
        let circle = d3.select(`#peer-circle-${id}`);
        if (!circle.empty()) {
            circle.remove();
        }
    }
    setupUI() {
        this.holderSelection
            .append("div")
            .classed("header", true)
            .text("Connected peers");
        this.holderSelection
            .append("div")
            .classed("body", true);
    }
    setupEventHandlers() {
        EventManager_1.EventManager.registerHandler("peerConnect", (e) => {
            this.addNewPeer(e.color, e.userId);
        });
        EventManager_1.EventManager.registerHandler("peerDisconnect", (e) => {
            this.removePeer(e.userId);
        });
    }
}
exports.PeerDisplay = PeerDisplay;
//# sourceMappingURL=PeerDisplay.js.map