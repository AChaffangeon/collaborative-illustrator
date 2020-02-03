"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ToolBar_1 = require("./View/ToolBar/ToolBar");
const Canvas_1 = require("./View/Canvas");
const InfoPanel_1 = require("./View/InfoPanel/InfoPanel");
const ActionManager_1 = require("./Actions/ActionManager");
const LoginMenu_1 = require("./LoginMenu");
const PeerManager_1 = require("./Peer2Peer/PeerManager");
new LoginMenu_1.LoginMenu(new PeerManager_1.PeerManager(new ActionManager_1.ActionManager(new Canvas_1.Canvas(new ToolBar_1.ToolBar(), new InfoPanel_1.InfoPanel()))));
//# sourceMappingURL=index.js.map