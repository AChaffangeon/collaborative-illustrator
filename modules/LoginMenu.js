"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3-selection");
class LoginMenu {
    constructor(peerManager) {
        this.setupInteractions(peerManager);
    }
    setupInteractions(peerManager) {
        d3.select("#new-room-button")
            .on("click", () => {
            peerManager.newRoom();
        });
        d3.select("#join-room-button")
            .on("click", () => {
            let value = document.getElementById("join-room-roomid").value;
            peerManager.joinRoom(`room-${value}`);
        });
    }
}
exports.LoginMenu = LoginMenu;
//# sourceMappingURL=LoginMenu.js.map