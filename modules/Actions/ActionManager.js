"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventManager_1 = require("../Events/EventManager");
class ActionManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.doneActions = [];
        this.undoneActions = [];
        this.queueActions = [];
        this.setupEventListeners();
    }
    do(action) {
        action.do(this.canvas);
    }
    undo(action) {
        action.undo(this.canvas);
    }
    rankActions(a, b) {
        let uIdNumA = parseFloat(a.userId.replace(/[^0-9]/g, ""));
        let uIdNumB = parseFloat(b.userId.replace(/[^0-9]/g, ""));
        if (a.timeStamp < b.timeStamp) {
            return -1;
        }
        else if (a.timeStamp === b.timeStamp && uIdNumA < uIdNumB) {
            return -1;
        }
        else {
            return 1;
        }
    }
    manageActions(action) {
        if (ActionManager.deletedShapes.includes(action.objectId)) {
            return;
        }
        else if (!ActionManager.createdShapes.includes(action.objectId)) {
            if (action.type === "addShape") {
                this.doneActions.push(action);
                this.do(action);
                for (let a of this.queueActions) {
                    if (a.objectId === action.objectId) {
                        this.doneActions.push(a);
                        this.do(a);
                        this.queueActions.splice(this.queueActions.indexOf(a), 1);
                    }
                }
            }
            else {
                this.queueActions.push(action);
            }
        }
        else if (action.timeStamp !== ActionManager.timeStamp) {
            this.promote(action);
        }
        else {
            this.doneActions.push(action);
            this.do(action);
        }
        this.update(action);
    }
    promote(action) {
        let concurrentActions = [];
        for (let a of this.doneActions) {
            if (this.rankActions(action, a) < 0 && action.type === a.type) {
                concurrentActions.push(a);
            }
        }
        concurrentActions.reverse();
        for (let a of concurrentActions) {
            this.undo(a);
        }
        this.doneActions.push(action);
        this.do(action);
        concurrentActions.reverse();
        for (let a of concurrentActions) {
            this.do(a);
        }
    }
    update(action) {
        ActionManager.timeStamp = Math.max(ActionManager.timeStamp, action.timeStamp);
    }
    static addNewPeer(peerId) {
        ActionManager.lastPeerTimeStamps.push([peerId, 0]);
    }
    static removePeer(peerId) {
        ActionManager.lastPeerTimeStamps = ActionManager.lastPeerTimeStamps.filter((el) => el[0] !== peerId);
    }
    setupEventListeners() {
        EventManager_1.EventManager.registerHandler("shapeCreated", (e) => {
            this.manageActions(e.action);
        });
        EventManager_1.EventManager.registerHandler("strokeChanged", (e) => {
            this.manageActions(e.action);
        });
        EventManager_1.EventManager.registerHandler("strokeWidthChanged", (e) => {
            this.manageActions(e.action);
        });
        EventManager_1.EventManager.registerHandler("fillChanged", (e) => {
            this.manageActions(e.action);
        });
        EventManager_1.EventManager.registerHandler("translateShape", (e) => {
            this.manageActions(e.action);
        });
        EventManager_1.EventManager.registerHandler("shapeDeleted", (e) => {
            this.manageActions(e.action);
        });
        EventManager_1.EventManager.registerHandler("selectShape", (e) => {
            this.manageActions(e.action);
        });
        EventManager_1.EventManager.registerHandler("unselectShape", (e) => {
            this.manageActions(e.action);
        });
    }
    static getTimeStamp() {
        ActionManager.timeStamp += 1;
        return ActionManager.timeStamp;
    }
}
exports.ActionManager = ActionManager;
ActionManager.userId = "";
ActionManager.timeStamp = 0;
ActionManager.createdShapes = [];
ActionManager.deletedShapes = [];
ActionManager.lastPeerTimeStamps = [];
//# sourceMappingURL=ActionManager.js.map