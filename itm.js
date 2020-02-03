(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{"../Events/EventManager":11}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ActionManager_1 = require("./ActionManager");
class AddShapeAction {
    constructor(shape, userId, timeStamp) {
        this.type = "addShape";
        this.shape = shape;
        this.objectId = shape.id;
        this.userId = userId;
        this.timeStamp = timeStamp;
    }
    do(canvas) {
        ActionManager_1.ActionManager.createdShapes.push(this.objectId);
        this.shape.addToCanvas(canvas);
    }
    undo(canvas) {
        ActionManager_1.ActionManager.createdShapes.splice(ActionManager_1.ActionManager.createdShapes.indexOf(this.objectId), 1);
        this.shape.removeFromCanvas(canvas);
    }
}
exports.AddShapeAction = AddShapeAction;

},{"./ActionManager":1}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ActionManager_1 = require("./ActionManager");
class DeleteShapeAction {
    constructor(shapeId, userId, timeStamp) {
        this.type = "deleteShape";
        this.objectId = shapeId;
        this.userId = userId;
        this.timeStamp = timeStamp;
    }
    do(canvas) {
        ActionManager_1.ActionManager.deletedShapes.push(this.objectId);
        let shape = canvas.getShape(this.objectId);
        shape.removeFromCanvas(canvas);
    }
    undo(canvas) {
        ActionManager_1.ActionManager.deletedShapes.splice(ActionManager_1.ActionManager.deletedShapes.indexOf(this.objectId), 1);
        let shape = canvas.getShape(this.objectId);
        shape.addToCanvas(canvas);
    }
}
exports.DeleteShapeAction = DeleteShapeAction;

},{"./ActionManager":1}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SelectShapeAction {
    constructor(shapeId, userId, timeStamp, color) {
        this.type = "selectShape";
        this.objectId = shapeId;
        this.userId = userId;
        this.timeStamp = timeStamp;
        this.color = color;
    }
    do(canvas) {
        let shape = canvas.getShape(this.objectId);
        shape.select(this.userId, this.color);
    }
    undo(canvas) {
        let shape = canvas.getShape(this.objectId);
        shape.unselect(this.userId);
    }
}
exports.SelectShapeAction = SelectShapeAction;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TranslateShapeAction {
    constructor(translate, shapeId, userId, timeStamp) {
        this.type = "translateShape";
        this.translate = translate;
        this.objectId = shapeId;
        this.userId = userId;
        this.timeStamp = timeStamp;
    }
    do(canvas) {
        let shape = canvas.getShape(this.objectId);
        if (this.oldTranslate === undefined) {
            this.oldTranslate = shape.getTranslate();
        }
        shape.setTranslate(this.translate);
    }
    undo(canvas) {
        let shape = canvas.getShape(this.objectId);
        shape.setTranslate(this.oldTranslate);
    }
}
exports.TranslateShapeAction = TranslateShapeAction;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UnselectShapeAction {
    constructor(shapeId, userId, timeStamp) {
        this.type = "unselectShape";
        this.objectId = shapeId;
        this.userId = userId;
        this.timeStamp = timeStamp;
    }
    do(canvas) {
        let shape = canvas.getShape(this.objectId);
        shape.unselect(this.userId);
    }
    undo(canvas) {
    }
}
exports.UnselectShapeAction = UnselectShapeAction;

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UpdateFillAction {
    constructor(color, shapeId, userId, timeStamp) {
        this.type = "updateFill";
        this.color = color;
        this.objectId = shapeId;
        this.userId = userId;
        this.timeStamp = timeStamp;
    }
    do(canvas) {
        let shape = canvas.getShape(this.objectId);
        if (this.oldColor === undefined) {
            this.oldColor = shape.getFill();
        }
        shape.setFill(this.color);
    }
    undo(canvas) {
        if (this.oldColor !== undefined) {
            let shape = canvas.getShape(this.objectId);
            shape.setFill(this.oldColor);
        }
    }
}
exports.UpdateFillAction = UpdateFillAction;

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UpdateStrokeAction {
    constructor(color, shapeId, userId, timeStamp) {
        this.type = "updateStroke";
        this.color = color;
        this.objectId = shapeId;
        this.userId = userId;
        this.timeStamp = timeStamp;
    }
    do(canvas) {
        let shape = canvas.getShape(this.objectId);
        if (this.oldColor === undefined) {
            this.oldColor = shape.getStroke();
        }
        shape.setStroke(this.color);
    }
    undo(canvas) {
        if (this.oldColor !== undefined) {
            let shape = canvas.getShape(this.objectId);
            shape.setStroke(this.oldColor);
        }
    }
}
exports.UpdateStrokeAction = UpdateStrokeAction;

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UpdateStrokeWidthAction {
    constructor(width, shapeId, userId, timeStamp) {
        this.type = "updateStrokeWidth";
        this.width = width;
        this.objectId = shapeId;
        this.userId = userId;
        this.timeStamp = timeStamp;
    }
    do(canvas) {
        let shape = canvas.getShape(this.objectId);
        if (this.oldWidth === undefined) {
            this.oldWidth = shape.getStrokeWidth();
        }
        shape.setStrokeWidth(this.width);
    }
    undo(canvas) {
        if (this.oldWidth !== undefined) {
            let shape = canvas.getShape(this.objectId);
            shape.setStrokeWidth(this.oldWidth);
        }
    }
}
exports.UpdateStrokeWidthAction = UpdateStrokeWidthAction;

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DeleteShapeAction_1 = require("../Actions/DeleteShapeAction");
class DeleteShapeEvent {
    constructor(shapeId, userId, timeStamp) {
        this.id = "shapeDeleted";
        this.action = new DeleteShapeAction_1.DeleteShapeAction(shapeId, userId, timeStamp);
    }
}
exports.DeleteShapeEvent = DeleteShapeEvent;

},{"../Actions/DeleteShapeAction":3}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EventManager {
    constructor() {
    }
    static registerHandler(eventId, eventHandler) {
        if (!EventManager.eventHandlers.has(eventId)) {
            EventManager.eventHandlers.set(eventId, []);
        }
        EventManager.eventHandlers.get(eventId).push(eventHandler);
    }
    static emit(event) {
        if (!EventManager.eventHandlers.has(event.id)) {
            return;
        }
        EventManager.eventHandlers.get(event.id)
            .forEach((eventHandler) => {
            eventHandler(event);
        });
    }
}
exports.EventManager = EventManager;
EventManager.eventHandlers = new Map();

},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UpdateFillAction_1 = require("../Actions/UpdateFillAction");
class FillChangedEvent {
    constructor(color, shapeId, userId, timeStamp) {
        this.id = "fillChanged";
        this.action = new UpdateFillAction_1.UpdateFillAction(color, shapeId, userId, timeStamp);
    }
}
exports.FillChangedEvent = FillChangedEvent;

},{"../Actions/UpdateFillAction":7}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ActionManager_1 = require("../Actions/ActionManager");
class PeerConnectEvent {
    constructor(userId, color) {
        this.id = "peerConnect";
        this.userId = userId;
        this.color = color;
        ActionManager_1.ActionManager.addNewPeer(this.userId);
    }
}
exports.PeerConnectEvent = PeerConnectEvent;

},{"../Actions/ActionManager":1}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ActionManager_1 = require("../Actions/ActionManager");
class PeerDisconnectEvent {
    constructor(userId) {
        this.id = "peerDisconnect";
        this.userId = userId;
        ActionManager_1.ActionManager.removePeer(this.userId);
    }
}
exports.PeerDisconnectEvent = PeerDisconnectEvent;

},{"../Actions/ActionManager":1}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SelectShapeAction_1 = require("../Actions/SelectShapeAction");
class SelectShapeEvent {
    constructor(shapeId, userId, timeStamp, color) {
        this.id = "selectShape";
        this.action = new SelectShapeAction_1.SelectShapeAction(shapeId, userId, timeStamp, color);
    }
}
exports.SelectShapeEvent = SelectShapeEvent;

},{"../Actions/SelectShapeAction":4}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AddShapeAction_1 = require("../Actions/AddShapeAction");
class ShapeCreatedEvent {
    constructor(shape, userId, timeStamp) {
        this.id = "shapeCreated";
        this.action = new AddShapeAction_1.AddShapeAction(shape, userId, timeStamp);
    }
}
exports.ShapeCreatedEvent = ShapeCreatedEvent;

},{"../Actions/AddShapeAction":2}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UpdateStrokeAction_1 = require("../Actions/UpdateStrokeAction");
class StrokeChangedEvent {
    constructor(color, shapeId, userId, timeStamp) {
        this.id = "strokeChanged";
        this.action = new UpdateStrokeAction_1.UpdateStrokeAction(color, shapeId, userId, timeStamp);
    }
}
exports.StrokeChangedEvent = StrokeChangedEvent;

},{"../Actions/UpdateStrokeAction":8}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UpdateStrokeWidthAction_1 = require("../Actions/UpdateStrokeWidthAction");
class StrokeWidthChangedEvent {
    constructor(width, shapeId, userId, timeStamp) {
        this.id = "strokeWidthChanged";
        this.action = new UpdateStrokeWidthAction_1.UpdateStrokeWidthAction(width, shapeId, userId, timeStamp);
    }
}
exports.StrokeWidthChangedEvent = StrokeWidthChangedEvent;

},{"../Actions/UpdateStrokeWidthAction":9}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TranslateShapeAction_1 = require("../Actions/TranslateShapeAction");
class TranslateShapeEvent {
    constructor(translate, shapeId, userId, timeStamp) {
        this.id = "translateShape";
        this.action = new TranslateShapeAction_1.TranslateShapeAction(translate, shapeId, userId, timeStamp);
    }
}
exports.TranslateShapeEvent = TranslateShapeEvent;

},{"../Actions/TranslateShapeAction":5}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UnselectShapeAction_1 = require("../Actions/UnselectShapeAction");
class UnselectShapeEvent {
    constructor(shapeId, userId, timeStamp) {
        this.id = "unselectShape";
        this.action = new UnselectShapeAction_1.UnselectShapeAction(shapeId, userId, timeStamp);
    }
}
exports.UnselectShapeEvent = UnselectShapeEvent;

},{"../Actions/UnselectShapeAction":6}],21:[function(require,module,exports){
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

},{"d3-selection":39}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventManager_1 = require("../Events/EventManager");
const ShapeCreatedEvent_1 = require("../Events/ShapeCreatedEvent");
const FreeForm_1 = require("../View/Shapes/FreeForm");
const ActionManager_1 = require("../Actions/ActionManager");
const StrokeChangedEvent_1 = require("../Events/StrokeChangedEvent");
const StrokeWidthChangedEvent_1 = require("../Events/StrokeWidthChangedEvent");
const FillChangedEvent_1 = require("../Events/FillChangedEvent");
const TranslateShapeEvent_1 = require("../Events/TranslateShapeEvent");
const DeleteShapeEvent_1 = require("../Events/DeleteShapeEvent");
const AddShapeAction_1 = require("../Actions/AddShapeAction");
const DeleteShapeAction_1 = require("../Actions/DeleteShapeAction");
const TranslateShapeAction_1 = require("../Actions/TranslateShapeAction");
const UpdateFillAction_1 = require("../Actions/UpdateFillAction");
const UpdateStrokeAction_1 = require("../Actions/UpdateStrokeAction");
const UpdateStrokeWidthAction_1 = require("../Actions/UpdateStrokeWidthAction");
const PeerConnectEvent_1 = require("../Events/PeerConnectEvent");
const PeerDisconnectEvent_1 = require("../Events/PeerDisconnectEvent");
const SelectShapeEvent_1 = require("../Events/SelectShapeEvent");
const SelectShapeAction_1 = require("../Actions/SelectShapeAction");
const UnselectShapeEvent_1 = require("../Events/UnselectShapeEvent");
const UnselectShapeAction_1 = require("../Actions/UnselectShapeAction");
const configuration = {
    iceServers: [
        {
            urls: 'stun:stun.l.google.com:19302'
        }
    ]
};
class Peer {
    constructor(signalingChannel, actionManager, peerId, isOfferer = false) {
        this.connection = new RTCPeerConnection(configuration);
        this.signalingChannel = signalingChannel;
        this.isOfferer = isOfferer;
        this.actionManager = actionManager;
        this.peerId = peerId;
        this.setupColor();
        this.config();
    }
    setupColor() {
        this.color = Peer.colorList[Peer.index % Peer.colorList.length];
        Peer.index = Peer.index + 1;
    }
    config() {
        console.log(`Connect TO: ${this.peerId}`);
        this.connection.onicecandidate = (event) => {
            if (event.candidate) {
                console.log(`[SENT]: ICE candidate TO: ${this.peerId}`);
                this.signalingChannel.send({ id: "ICECandidate", candidate: event.candidate, userId: ActionManager_1.ActionManager.userId });
            }
        };
        if (this.isOfferer) {
            this.connection.onnegotiationneeded = () => {
                console.log(`Create Local Description: ${this.peerId}`);
                this.connection.createOffer()
                    .then((offer) => {
                    this.setLocalDescription(offer);
                })
                    .catch((e) => {
                    console.log(`Error negotiations with: ${this.peerId}`, e);
                });
            };
            this.dataChannel = this.connection.createDataChannel('chat');
            this.setupDataChannel();
        }
        else {
            this.connection.ondatachannel = (event) => {
                this.dataChannel = event.channel;
                this.setupDataChannel();
            };
        }
        this.listenToMsg();
    }
    setLocalDescription(description) {
        this.connection.setLocalDescription(description)
            .then(() => {
            console.log(`[SENT] Local description TO: ${this.peerId}`);
            this.signalingChannel.send({ id: "SDP", description: this.connection.localDescription });
        })
            .catch((e) => console.log(`Error set local description with: ${this.peerId}: `, e));
    }
    setRemoteDescription(description) {
        this.connection.setRemoteDescription(description)
            .then(() => {
            if (this.connection.remoteDescription.type === "offer") {
                this.connection.createAnswer()
                    .then((answer) => {
                    this.setLocalDescription(answer);
                })
                    .catch((e) => console.log("Error create answer: ", e));
            }
        })
            .catch((e) => console.log("Error set Remote description: ", e, this.connection, this.peerId));
    }
    listenToMsg() {
        let onMsg = (msg) => {
            console.log(`[Received]: ${msg.id} FROM ${this.peerId}`);
            switch (msg.id) {
                case "ICECandidate":
                    if (msg.candidate) {
                        this.connection.addIceCandidate(msg.candidate);
                    }
                    break;
                case "SDP":
                    this.setRemoteDescription(msg.description);
                    break;
                default:
                    console.log("Unhandled MSG: ", msg);
                    break;
            }
        };
        this.signalingChannel.setOnMSG(onMsg);
    }
    setupDataChannel() {
        this.dataChannel.onopen = (event) => {
            this.onDataChannelOpen();
        };
        this.dataChannel.onmessage = (event) => {
            this.onPeerMsg(event);
        };
    }
    onDataChannelOpen() {
        console.log(`Datachannel is open with: ${this.peerId}`);
        this.signalingChannel.close();
        this.setupEventHandler();
        this.sendCurrentState();
        EventManager_1.EventManager.emit(new PeerConnectEvent_1.PeerConnectEvent(this.peerId, this.color));
    }
    onPeerMsg(event) {
        let msg = JSON.parse(event.data);
        if (msg) {
            if (msg.id === "shapeCreated") {
                let shape = new FreeForm_1.FreeForm();
                shape.setPoints(msg.action.shape.path);
                shape.id = msg.action.objectId;
                shape.stroke = msg.action.shape.stroke;
                shape.strokeWidth = msg.action.shape.strokeWidth;
                shape.fill = msg.action.shape.fill;
                let e = new ShapeCreatedEvent_1.ShapeCreatedEvent(shape, msg.action.userId, msg.action.timeStamp);
                EventManager_1.EventManager.emit(e);
            }
            else if (msg.id === "strokeChanged") {
                let e = new StrokeChangedEvent_1.StrokeChangedEvent(msg.action.color, msg.action.objectId, msg.action.userId, msg.action.timeStamp);
                EventManager_1.EventManager.emit(e);
            }
            else if (msg.id === "strokeWidthChanged") {
                let e = new StrokeWidthChangedEvent_1.StrokeWidthChangedEvent(msg.action.width, msg.action.objectId, msg.action.userId, msg.action.timeStamp);
                EventManager_1.EventManager.emit(e);
            }
            else if (msg.id === "fillChanged") {
                let e = new FillChangedEvent_1.FillChangedEvent(msg.action.color, msg.action.objectId, msg.action.userId, msg.action.timeStamp);
                EventManager_1.EventManager.emit(e);
            }
            else if (msg.id === "translateShape") {
                let e = new TranslateShapeEvent_1.TranslateShapeEvent(msg.action.translate, msg.action.objectId, msg.action.userId, msg.action.timeStamp);
                EventManager_1.EventManager.emit(e);
            }
            else if (msg.id === "shapeDeleted") {
                let e = new DeleteShapeEvent_1.DeleteShapeEvent(msg.action.objectId, msg.action.userId, msg.action.timeStamp);
                EventManager_1.EventManager.emit(e);
            }
            else if (msg.id === "peerDisconnect") {
                let e = new PeerDisconnectEvent_1.PeerDisconnectEvent(this.peerId);
                EventManager_1.EventManager.emit(e);
            }
            else if (msg.id === "selectShape") {
                let e = new SelectShapeEvent_1.SelectShapeEvent(msg.action.objectId, msg.action.userId, msg.action.timeStamp, this.color);
                EventManager_1.EventManager.emit(e);
            }
            else if (msg.id === "unselectShape") {
                let e = new UnselectShapeEvent_1.UnselectShapeEvent(msg.action.objectId, msg.action.userId, msg.action.timeStamp);
                EventManager_1.EventManager.emit(e);
            }
        }
    }
    send(msg) {
        console.log("[SENT]", msg);
        this.dataChannel.send(msg);
    }
    sendEvent(event) {
        this.send(JSON.stringify(event));
    }
    sendActionEvent(event) {
        if (event.action.userId === ActionManager_1.ActionManager.userId) {
            this.sendEvent(event);
        }
    }
    setupEventHandler() {
        EventManager_1.EventManager.registerHandler("shapeCreated", (event) => {
            this.sendActionEvent(event);
        });
        EventManager_1.EventManager.registerHandler("strokeChanged", (event) => {
            this.sendActionEvent(event);
        });
        EventManager_1.EventManager.registerHandler("strokeWidthChanged", (event) => {
            this.sendActionEvent(event);
        });
        EventManager_1.EventManager.registerHandler("fillChanged", (event) => {
            this.sendActionEvent(event);
        });
        EventManager_1.EventManager.registerHandler("translateShape", (event) => {
            this.sendActionEvent(event);
        });
        EventManager_1.EventManager.registerHandler("shapeDeleted", (event) => {
            this.sendActionEvent(event);
        });
        EventManager_1.EventManager.registerHandler("selectShape", (event) => {
            this.sendActionEvent(event);
        });
        EventManager_1.EventManager.registerHandler("unselectShape", (event) => {
            this.sendActionEvent(event);
        });
        window.addEventListener("beforeunload", () => {
            this.sendEvent(new PeerDisconnectEvent_1.PeerDisconnectEvent(ActionManager_1.ActionManager.userId));
        });
    }
    sendCurrentState() {
        let actions = this.actionManager.doneActions;
        console.log(actions);
        actions.forEach((action) => {
            let e;
            if (action instanceof AddShapeAction_1.AddShapeAction) {
                e = new ShapeCreatedEvent_1.ShapeCreatedEvent(action.shape, action.userId, action.timeStamp);
            }
            else if (action instanceof DeleteShapeAction_1.DeleteShapeAction) {
                e = new DeleteShapeEvent_1.DeleteShapeEvent(action.objectId, action.userId, action.timeStamp);
            }
            else if (action instanceof TranslateShapeAction_1.TranslateShapeAction) {
                e = new TranslateShapeEvent_1.TranslateShapeEvent(action.translate, action.objectId, action.userId, action.timeStamp);
            }
            else if (action instanceof UpdateFillAction_1.UpdateFillAction) {
                e = new FillChangedEvent_1.FillChangedEvent(action.color, action.objectId, action.userId, action.timeStamp);
            }
            else if (action instanceof UpdateStrokeAction_1.UpdateStrokeAction) {
                e = new StrokeChangedEvent_1.StrokeChangedEvent(action.color, action.objectId, action.userId, action.timeStamp);
            }
            else if (action instanceof UpdateStrokeWidthAction_1.UpdateStrokeWidthAction) {
                e = new StrokeWidthChangedEvent_1.StrokeWidthChangedEvent(action.width, action.objectId, action.userId, action.timeStamp);
            }
            else if (action instanceof SelectShapeAction_1.SelectShapeAction) {
                e = new SelectShapeEvent_1.SelectShapeEvent(action.objectId, action.userId, action.timeStamp, action.color);
            }
            else if (action instanceof UnselectShapeAction_1.UnselectShapeAction) {
                e = new UnselectShapeEvent_1.UnselectShapeEvent(action.objectId, action.userId, action.timeStamp);
            }
            this.send(JSON.stringify(e));
        });
    }
}
exports.Peer = Peer;
Peer.colorList = ["#E69F00", "#009E73", "#F0E442", "#0072B2", "#D55E00", "#CC79A7", "#000000"];
Peer.index = 0;

},{"../Actions/ActionManager":1,"../Actions/AddShapeAction":2,"../Actions/DeleteShapeAction":3,"../Actions/SelectShapeAction":4,"../Actions/TranslateShapeAction":5,"../Actions/UnselectShapeAction":6,"../Actions/UpdateFillAction":7,"../Actions/UpdateStrokeAction":8,"../Actions/UpdateStrokeWidthAction":9,"../Events/DeleteShapeEvent":10,"../Events/EventManager":11,"../Events/FillChangedEvent":12,"../Events/PeerConnectEvent":13,"../Events/PeerDisconnectEvent":14,"../Events/SelectShapeEvent":15,"../Events/ShapeCreatedEvent":16,"../Events/StrokeChangedEvent":17,"../Events/StrokeWidthChangedEvent":18,"../Events/TranslateShapeEvent":19,"../Events/UnselectShapeEvent":20,"../View/Shapes/FreeForm":31}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3-selection");
const Peer_1 = require("./Peer");
const SignalingChannel_1 = require("./SignalingChannel");
const ActionManager_1 = require("../Actions/ActionManager");
const roomServer_1 = require("./roomServer");
class PeerManager {
    constructor(actionManager) {
        this.roomServer = new roomServer_1.RoomServer();
        this.actionManager = actionManager;
        this.setupServerListeners();
    }
    setupServerListeners() {
        this.roomServer.register("newPeer", (data) => {
            let sc = new SignalingChannel_1.SignalingChannel(this.roomServer, data.signalingChannel);
            new Peer_1.Peer(sc, this.actionManager, data.userId);
        });
        this.roomServer.register("connectToPeer", (data) => {
            let sc = new SignalingChannel_1.SignalingChannel(this.roomServer, data.signalingChannel);
            new Peer_1.Peer(sc, this.actionManager, data.userId, true);
        });
    }
    joinRoom(roomId) {
        this.roomServer.emit("joinRoom", { roomId: roomId });
        this.roomServer.register("roomJoined", (data) => {
            if (data.status === 404) {
                alert("Room id not correct");
            }
            else if (data.status === 200) {
                ActionManager_1.ActionManager.userId = data.userId;
                this.actionManager.canvas.infoPanel.peerList.addMainPeer();
                this.displayRoomId(roomId);
            }
        });
    }
    newRoom() {
        this.roomServer.emit("newRoom", {});
        this.roomServer.register("roomCreated", (data) => {
            ActionManager_1.ActionManager.userId = data.userId;
            this.actionManager.canvas.infoPanel.peerList.addMainPeer();
            this.displayRoomId(data.roomId);
        });
    }
    displayRoomId(roomId) {
        d3.select("#room-id").remove();
        d3.select("#menu")
            .append("div")
            .attr("id", "room-id")
            .text(`ID: ${roomId}`);
        d3.select("#login-screen").remove();
    }
}
exports.PeerManager = PeerManager;

},{"../Actions/ActionManager":1,"./Peer":22,"./SignalingChannel":24,"./roomServer":25,"d3-selection":39}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SignalingChannel {
    constructor(socket, signalingChannel) {
        this.signalingChannel = signalingChannel;
        this.socket = socket;
        this.onMSG = (msg) => { };
        this.setupOnMsg();
    }
    send(msg) {
        this.socket.emit("msg", { signalingChannel: this.signalingChannel, msg: msg });
    }
    setupOnMsg() {
        this.socket.register("msg", (data) => {
            if (data.signalingChannel !== this.signalingChannel) {
                return;
            }
            this.onMSG(data.msg);
        });
    }
    setOnMSG(f) {
        this.onMSG = f;
    }
    close() {
        this.socket.emit("closeSC", { signalingChannel: this.signalingChannel });
    }
}
exports.SignalingChannel = SignalingChannel;

},{}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RoomServer {
    constructor() {
        this.ws = new WebSocket('wss://collaborative-illustrator.herokuapp.com/');
        this.msgHandlers = {};
        this.keepAlive();
        this.ws.onopen = () => { console.log("Connected to room server"); };
        this.ws.onmessage = (msg) => { this.onMsg(msg.data); };
    }
    keepAlive() {
        let timeout = 20000;
        let server = this.ws;
        let ping = () => {
            if (server.readyState === server.OPEN) {
                server.send(JSON.stringify({ id: "ping" }));
            }
            setTimeout(ping, timeout);
        };
        ping();
    }
    register(msgId, f) {
        if (!this.msgHandlers.hasOwnProperty(msgId)) {
            this.msgHandlers[msgId] = [];
        }
        this.msgHandlers[msgId].push(f);
    }
    emit(id, msg) {
        this.ws.send(JSON.stringify({ id: id, data: msg }));
    }
    onMsg(message) {
        let msg = JSON.parse(message);
        if (!this.msgHandlers.hasOwnProperty(msg.id)) {
            return;
        }
        this.msgHandlers[msg.id].forEach((f) => f(msg.data));
    }
}
exports.RoomServer = RoomServer;

},{}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3-selection");
class Canvas {
    constructor(toolBar, infoPanel) {
        this.holderSelection = d3.select("#canvas");
        this.svgSelection = this.holderSelection.append("svg");
        this.toolBar = toolBar;
        this.infoPanel = infoPanel;
        this.shapes = [];
        this.setupPointerListeners();
    }
    setupPointerListeners() {
        let canvasSVG = this.holderSelection.node();
        canvasSVG.addEventListener("pointerdown", (e) => {
            this.toolBar.getTool().pointerDown(e, this);
        });
        canvasSVG.addEventListener("pointermove", (e) => {
            this.toolBar.getTool().pointerMove(e, this);
        });
        canvasSVG.addEventListener("pointerup", (e) => {
            this.toolBar.getTool().pointerUp(e, this);
        });
        canvasSVG.addEventListener("pointercancel", (e) => {
            this.toolBar.getTool().pointerCancel(e, this);
        });
        canvasSVG.addEventListener("pointerleave", (e) => {
            this.toolBar.getTool().pointerLeave(e, this);
        });
        document.addEventListener('keyup', (e) => {
            this.toolBar.getTool().keyUp(e, this);
        });
    }
    getShape(shapeId) {
        let shape;
        this.shapes.forEach((s) => {
            if (s.id === shapeId) {
                shape = s;
            }
        });
        if (shape === undefined) {
            console.error("Shape not in canvas: " + shapeId);
        }
        return shape;
    }
}
exports.Canvas = Canvas;

},{"d3-selection":39}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventManager_1 = require("../../Events/EventManager");
const Shape_1 = require("../Shapes/Shape");
const FillChangedEvent_1 = require("../../Events/FillChangedEvent");
const ActionManager_1 = require("../../Actions/ActionManager");
const d3 = require("d3-selection");
class FillPicker {
    constructor(infoPanel) {
        this.holderSelection = infoPanel.holderSelection
            .append("div")
            .attr("id", "fill-picker")
            .classed("info-panel-element", true);
        this.fill = "none";
        this.setupUI();
        this.setupInteraction();
    }
    setupUI() {
        this.holderSelection
            .append("div")
            .classed("header", true)
            .text("Fill");
        let selectButton = this.holderSelection
            .append("select")
            .attr("id", "color-picker-option-button");
        selectButton
            .append("option")
            .attr("value", "no-fill")
            .text("None / Transparent");
        selectButton
            .append("option")
            .attr("value", "fill")
            .text("Color");
        this.holderSelection
            .append("input")
            .attr("type", "color")
            .attr("value", this.fill)
            .style("display", "none");
    }
    setupInteraction() {
        this.holderSelection
            .select("select")
            .on("change", () => {
            let val = document.getElementById("color-picker-option-button").value;
            if (val === "no-fill") {
                this.holderSelection
                    .select("input")
                    .style("display", "none");
                this.updateColor("none");
            }
            else {
                this.holderSelection
                    .select("input")
                    .style("display", "initial");
                let v = this.holderSelection.select("input").node().value;
                this.updateColor(v);
            }
        });
        this.holderSelection.select("input")
            .on("change", () => {
            let v = this.holderSelection.select("input").node().value;
            this.updateColor(v);
        });
    }
    updateColor(color) {
        this.fill = color;
        let selectedShapes = Shape_1.Shape.getSelectedShapes();
        selectedShapes.forEach((shape) => {
            EventManager_1.EventManager.emit(new FillChangedEvent_1.FillChangedEvent(color, shape.id, ActionManager_1.ActionManager.userId, ActionManager_1.ActionManager.getTimeStamp()));
        });
    }
    getColor() {
        return this.fill;
    }
    setFill(color) {
        this.fill = color;
        let selectButton = this.holderSelection
            .select("#color-picker-option-button")
            .node();
        let colorButton = this.holderSelection
            .select("input").node();
        if (color === "none") {
            selectButton.value = "no-fill";
            d3.select(colorButton).style("display", "none");
        }
        else {
            selectButton.value = "fill";
            d3.select(colorButton)
                .style("display", "initial");
            colorButton.value = this.fill;
        }
    }
}
exports.FillPicker = FillPicker;

},{"../../Actions/ActionManager":1,"../../Events/EventManager":11,"../../Events/FillChangedEvent":12,"../Shapes/Shape":32,"d3-selection":39}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3-selection");
const StrokePicker_1 = require("./StrokePicker");
const FillPicker_1 = require("./FillPicker");
const PeerDisplay_1 = require("./PeerDisplay");
class InfoPanel {
    constructor() {
        this.holderSelection = d3.select("#info-panel");
        this.strokePicker = new StrokePicker_1.StrokePicker(this);
        this.fillPicker = new FillPicker_1.FillPicker(this);
        this.peerList = new PeerDisplay_1.PeerDisplay(this);
    }
    setFill(color) {
        this.fillPicker.setFill(color);
    }
    setStroke(color) {
        this.strokePicker.setStroke(color);
    }
    setStrokeWidth(width) {
        this.strokePicker.setStrokeWidth(width);
    }
}
exports.InfoPanel = InfoPanel;

},{"./FillPicker":27,"./PeerDisplay":29,"./StrokePicker":30,"d3-selection":39}],29:[function(require,module,exports){
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

},{"../../Actions/ActionManager":1,"../../Events/EventManager":11,"d3-selection":39}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventManager_1 = require("../../Events/EventManager");
const Shape_1 = require("../Shapes/Shape");
const StrokeChangedEvent_1 = require("../../Events/StrokeChangedEvent");
const StrokeWidthChangedEvent_1 = require("../../Events/StrokeWidthChangedEvent");
const ActionManager_1 = require("../../Actions/ActionManager");
class StrokePicker {
    constructor(infoPanel) {
        this.holderSelection = infoPanel.holderSelection
            .append("div")
            .attr("id", "stroke-picker")
            .classed("info-panel-element", true);
        this.stroke = "#000000";
        this.strokeWidth = 2;
        this.setupUI();
        this.setupInteraction();
    }
    setupUI() {
        this.holderSelection
            .append("div")
            .classed("header", true)
            .text("Stroke");
        this.holderSelection
            .append("input")
            .attr("type", "color")
            .attr("value", this.stroke);
        this.holderSelection
            .append("input")
            .attr("type", "range")
            .attr("min", 1)
            .attr("max", 100)
            .attr("value", this.strokeWidth);
        this.holderSelection
            .append("input")
            .attr("id", "stroke-width-text-input")
            .attr("type", "text")
            .attr("value", this.strokeWidth);
        this.holderSelection
            .append("label")
            .attr("for", "stroke-width-text-input")
            .text("px");
    }
    setupInteraction() {
        this.holderSelection.select("input[type='color']")
            .on("change", () => {
            let v = this.holderSelection.select("input[type='color']").node().value;
            this.updateStroke(v);
        });
        this.holderSelection.select("#stroke-width-text-input")
            .on("change", () => {
            let v = this.holderSelection.select("#stroke-width-text-input").node().value;
            this.updateStrokeWidth(parseInt(v));
        });
        this.holderSelection.select("input[type='range']")
            .on("change", () => {
            let v = this.holderSelection.select("input[type='range']").node().value;
            this.updateStrokeWidth(parseInt(v));
        });
    }
    updateStroke(color) {
        this.stroke = color;
        let selectedShapes = Shape_1.Shape.getSelectedShapes();
        selectedShapes.forEach((shape) => {
            EventManager_1.EventManager.emit(new StrokeChangedEvent_1.StrokeChangedEvent(this.getStroke(), shape.id, ActionManager_1.ActionManager.userId, ActionManager_1.ActionManager.getTimeStamp()));
        });
    }
    updateStrokeWidth(width) {
        this.strokeWidth = width;
        let input = document.getElementById("stroke-width-text-input");
        input.value = width.toString();
        let selectedShapes = Shape_1.Shape.getSelectedShapes();
        selectedShapes.forEach((shape) => {
            EventManager_1.EventManager.emit(new StrokeWidthChangedEvent_1.StrokeWidthChangedEvent(width, shape.id, ActionManager_1.ActionManager.userId, ActionManager_1.ActionManager.getTimeStamp()));
        });
    }
    getStroke() {
        return this.stroke;
    }
    getStrokeWidth() {
        return this.strokeWidth;
    }
    setStroke(color) {
        this.stroke = color;
        this.holderSelection
            .select("input[type='color']")
            .node()
            .value = color;
    }
    setStrokeWidth(width) {
        this.strokeWidth = width;
        this.holderSelection
            .select("#stroke-width-text-input")
            .node()
            .value = width.toString();
        this.holderSelection
            .select("input[type='range']")
            .node()
            .value = width.toString();
    }
}
exports.StrokePicker = StrokePicker;

},{"../../Actions/ActionManager":1,"../../Events/EventManager":11,"../../Events/StrokeChangedEvent":17,"../../Events/StrokeWidthChangedEvent":18,"../Shapes/Shape":32}],31:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Shape_1 = require("./Shape");
const helpers_1 = require("../../helpers");
class FreeForm extends Shape_1.Shape {
    constructor() {
        super();
        this.path = [];
        this.fill = "none";
        this.strokeWidth = 2;
    }
    addPoint(pt) {
        this.path.push(pt);
        this.repaint();
    }
    setPoints(points) {
        this.path = points;
        this.repaint();
    }
    addToCanvas(canvas) {
        super.addToCanvas(canvas);
        this.pathSelection = this.shapeSelection.append("path");
        this.repaint();
    }
    repaint() {
        super.repaint();
        if (this.shapeSelection === undefined) {
            return;
        }
        if (this.path.length < 2) {
            return;
        }
        this.pathSelection
            .attr("d", helpers_1.Helpers.pointsToDAttr(this.path))
            .style("fill", this.fill)
            .style("stroke", this.stroke)
            .style("stroke-width", `${this.strokeWidth}px`);
    }
    toJSON() {
        let json = super.toJSON();
        json["path"] = this.path;
        return json;
    }
}
exports.FreeForm = FreeForm;

},{"../../helpers":37,"./Shape":32}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3-selection");
const ActionManager_1 = require("../../Actions/ActionManager");
let shapeNumber = 0;
class Shape {
    constructor() {
        this.id = ActionManager_1.ActionManager.userId + "-S_" + shapeNumber.toString();
        shapeNumber += 1;
        this.stroke = "#000000";
        this.strokeWidth = 0;
        this.fill = "#ffffff";
        this.translate = { dx: 0, dy: 0 };
        this.holderSelection = undefined;
        this.shapeSelection = undefined;
    }
    addToCanvas(canvas) {
        this.holderSelection = canvas.svgSelection.append("g").classed("shape-holder", true);
        this.holderSelection.datum(this);
        this.shapeSelection = this.holderSelection.append("g").classed("shape", true);
        canvas.shapes.push(this);
    }
    removeFromCanvas(canvas) {
        this.holderSelection.remove();
        this.holderSelection = undefined;
        this.shapeSelection = undefined;
        canvas.shapes = canvas.shapes.filter((value, index, arr) => {
            return value !== this;
        });
    }
    translateBy(dx, dy) {
        this.translate.dx += dx;
        this.translate.dy += dy;
        this.repaint();
    }
    repaint() {
        if (this.holderSelection === undefined) {
            return;
        }
        this.holderSelection
            .attr("transform", `translate(${this.translate.dx}, ${this.translate.dy})`);
    }
    isPicked(pt) {
        let bbox = this.shapeSelection.node().getBBox();
        return pt.x > bbox.x + this.translate.dx &&
            pt.x < bbox.x + this.translate.dx + bbox.width &&
            pt.y > bbox.y + this.translate.dy &&
            pt.y < bbox.y + this.translate.dy + bbox.height;
    }
    select(peerId, color) {
        if (ActionManager_1.ActionManager.userId === peerId) {
            this.holderSelection.classed("selected", true);
        }
        this.holderSelection.append("rect")
            .attr("id", `peer-selection-${peerId}`)
            .attr("stroke", color)
            .classed("selection-rect", true);
        this.redrawRectangleSelection();
    }
    unselect(peerId) {
        if (this.holderSelection) {
            let selection = d3.select(`#peer-selection-${peerId}`);
            if (!selection.empty()) {
                selection.remove();
                this.redrawRectangleSelection();
                if (ActionManager_1.ActionManager.userId === peerId) {
                    this.holderSelection.classed("selected", false);
                }
            }
        }
    }
    redrawRectangleSelection() {
        let bbox = this.shapeSelection.node().getBBox();
        this.holderSelection.selectAll("rect")
            .attr("x", (_, i) => { return bbox.x - 5 - 4 * i; })
            .attr("y", (_, i) => { return bbox.y - 5 - 4 * i; })
            .attr("width", (_, i) => { return bbox.width + 10 + 8 * i; })
            .attr("height", (_, i) => { return bbox.height + 10 + 8 * i; });
    }
    static isShape(d3Selection) {
        if (d3Selection.datum() === undefined) {
            return false;
        }
        return d3Selection.datum() instanceof Shape;
    }
    static getShape(d3Selection) {
        if (!Shape.isShape(d3Selection)) {
            console.log("Error");
            return;
        }
        return d3Selection.datum();
    }
    static getSelectedShapes() {
        let selectedShapes = [];
        d3.selectAll(".shape-holder.selected").each(function () {
            selectedShapes.push(Shape.getShape(d3.select(this)));
        });
        return selectedShapes;
    }
    getStroke() {
        return this.stroke;
    }
    getStrokeWidth() {
        return this.strokeWidth;
    }
    getFill() {
        return this.fill;
    }
    getTranslate() {
        return this.translate;
    }
    setStroke(color) {
        this.stroke = color;
        this.repaint();
    }
    setStrokeWidth(width) {
        this.strokeWidth = width;
        this.repaint();
    }
    setFill(color) {
        this.fill = color;
        this.repaint();
    }
    setTranslate(translate) {
        this.translate = translate;
        this.repaint();
    }
    toJSON() {
        let json = {};
        json["id"] = this.id;
        json["stroke"] = this.stroke;
        json["strokeWidth"] = this.strokeWidth;
        json["fill"] = this.fill;
        return json;
    }
}
exports.Shape = Shape;

},{"../../Actions/ActionManager":1,"d3-selection":39}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("d3-selection");
const FreeFormTool_1 = require("./Tools/FreeFormTool");
const SelectTool_1 = require("./Tools/SelectTool");
class ToolBar {
    constructor() {
        this.holderSelection = d3.select("#toolbar");
        this.setupUI();
    }
    setupUI() {
        this.selectedTool = new SelectTool_1.SelectTool(this, true);
        new FreeFormTool_1.FreeFormTool(this, false);
    }
    getTool() {
        return this.selectedTool;
    }
}
exports.ToolBar = ToolBar;

},{"./Tools/FreeFormTool":34,"./Tools/SelectTool":35,"d3-selection":39}],34:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Tool_1 = require("./Tool");
const FreeForm_1 = require("../../Shapes/FreeForm");
const helpers_1 = require("../../../helpers");
const EventManager_1 = require("../../../Events/EventManager");
const ShapeCreatedEvent_1 = require("../../../Events/ShapeCreatedEvent");
const ActionManager_1 = require("../../../Actions/ActionManager");
class FreeFormTool extends Tool_1.Tool {
    constructor(toolBar, selected) {
        super();
        this.id = "freeform";
        this.setupUI(toolBar, selected);
    }
    pointerDown(e, canvas) {
        super.pointerDown(e, canvas);
        let point = { x: e.pageX, y: e.pageY };
        point = helpers_1.Helpers.pageToSVG(point, canvas.svgSelection);
        this.currentPoints = [point];
        this.currentShape = canvas.svgSelection.append("path").classed("in-creation", true);
        this.currentShape.style("fill", canvas.infoPanel.fillPicker.fill)
            .style("stroke-width", `${canvas.infoPanel.strokePicker.strokeWidth}px`)
            .style("stroke", canvas.infoPanel.strokePicker.stroke);
    }
    pointerMove(e, canvas) {
        if (!this.isDown) {
            return;
        }
        super.pointerMove(e, canvas);
        let point = { x: e.pageX, y: e.pageY };
        point = helpers_1.Helpers.pageToSVG(point, canvas.svgSelection);
        this.currentPoints.push(point);
        this.currentShape.attr("d", helpers_1.Helpers.pointsToDAttr(this.currentPoints));
    }
    pointerUp(e, canvas) {
        if (!this.isDown) {
            return;
        }
        super.pointerUp(e, canvas);
        let shape = new FreeForm_1.FreeForm();
        shape.setStroke(canvas.infoPanel.strokePicker.stroke);
        shape.setStrokeWidth(canvas.infoPanel.strokePicker.strokeWidth);
        shape.setFill(canvas.infoPanel.fillPicker.fill);
        shape.setPoints(this.currentPoints);
        EventManager_1.EventManager.emit(new ShapeCreatedEvent_1.ShapeCreatedEvent(shape, ActionManager_1.ActionManager.userId, ActionManager_1.ActionManager.getTimeStamp()));
        this.currentPoints = undefined;
        this.currentShape.remove();
        this.currentShape = undefined;
    }
    pointerCancel(e, canvas) {
        if (!this.isDown) {
            return;
        }
        super.pointerCancel(e, canvas);
    }
    pointerLeave(e, canvas) {
        if (!this.isDown) {
            return;
        }
        this.pointerUp(e, canvas);
    }
}
exports.FreeFormTool = FreeFormTool;

},{"../../../Actions/ActionManager":1,"../../../Events/EventManager":11,"../../../Events/ShapeCreatedEvent":16,"../../../helpers":37,"../../Shapes/FreeForm":31,"./Tool":36}],35:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Tool_1 = require("./Tool");
const d3 = require("d3-selection");
const Shape_1 = require("../../Shapes/Shape");
const helpers_1 = require("../../../helpers");
const EventManager_1 = require("../../../Events/EventManager");
const TranslateShapeEvent_1 = require("../../../Events/TranslateShapeEvent");
const DeleteShapeEvent_1 = require("../../../Events/DeleteShapeEvent");
const SelectShapeEvent_1 = require("../../../Events/SelectShapeEvent");
const ActionManager_1 = require("../../../Actions/ActionManager");
const UnselectShapeEvent_1 = require("../../../Events/UnselectShapeEvent");
class SelectTool extends Tool_1.Tool {
    constructor(toolBar, selected) {
        super();
        this.id = "select";
        this.selectedShapes = [];
        this.lastPoint = { x: 0, y: 0 };
        this.setupUI(toolBar, selected);
    }
    pointerDown(e, canvas) {
        super.pointerDown(e, canvas);
        this.moved = false;
        let point = helpers_1.Helpers.pageToSVG({ x: e.pageX, y: e.pageY }, canvas.svgSelection);
        let targetSelection = d3.select(e.target);
        if (!Shape_1.Shape.isShape(targetSelection)) {
            d3.selectAll(".shape").each((d) => {
                if (d.isPicked(point)) {
                    this.shape = d;
                }
            });
            if (this.shape === undefined) {
                return;
            }
        }
        else {
            this.shape = Shape_1.Shape.getShape(targetSelection);
        }
        if (!e.shiftKey) {
            this.unselectAllShapes();
        }
        this.lastPoint = point;
    }
    pointerMove(e, canvas) {
        if (!this.isDown) {
            return;
        }
        super.pointerMove(e, canvas);
        if (this.shape === undefined) {
            return;
        }
        let point = helpers_1.Helpers.pageToSVG({ x: e.pageX, y: e.pageY }, canvas.svgSelection);
        this.shape.translateBy(point.x - this.lastPoint.x, point.y - this.lastPoint.y);
        this.selectedShapes.forEach((s) => {
            if (s !== this.shape) {
                s.translateBy(point.x - this.lastPoint.x, point.y - this.lastPoint.y);
            }
        });
        this.moved = true;
        this.lastPoint = point;
    }
    pointerUp(e, canvas) {
        if (!this.isDown) {
            return;
        }
        super.pointerUp(e, canvas);
        if (this.shape === undefined) {
            this.unselectAllShapes();
            return;
        }
        if (this.moved) {
            let translate = this.shape.getTranslate();
            let userId = ActionManager_1.ActionManager.userId;
            let timeStamp = ActionManager_1.ActionManager.getTimeStamp();
            EventManager_1.EventManager.emit(new TranslateShapeEvent_1.TranslateShapeEvent(translate, this.shape.id, userId, timeStamp));
            this.selectedShapes.forEach((s) => {
                if (s !== this.shape) {
                    translate = s.getTranslate();
                    EventManager_1.EventManager.emit(new TranslateShapeEvent_1.TranslateShapeEvent(translate, s.id, userId, timeStamp));
                }
            });
        }
        else {
            if (this.selectedShapes.includes(this.shape)) {
                this.unselectShape(this.shape);
            }
            else {
                this.selectShape(this.shape);
                canvas.infoPanel.setFill(this.shape.getFill());
                canvas.infoPanel.setStroke(this.shape.getStroke());
                canvas.infoPanel.setStrokeWidth(this.shape.getStrokeWidth());
            }
        }
        this.shape = undefined;
    }
    pointerCancel(e, canvas) {
        if (!this.isDown) {
            return;
        }
        super.pointerCancel(e, canvas);
    }
    pointerLeave(e, canvas) {
        if (!this.isDown) {
            return;
        }
        super.pointerLeave(e, canvas);
    }
    selectShape(shape) {
        this.selectedShapes.push(shape);
        EventManager_1.EventManager.emit(new SelectShapeEvent_1.SelectShapeEvent(shape.id, ActionManager_1.ActionManager.userId, ActionManager_1.ActionManager.getTimeStamp(), "#56B4E9"));
    }
    unselectShape(shape) {
        this.selectedShapes = this.selectedShapes.filter((value) => {
            return value !== shape;
        });
        EventManager_1.EventManager.emit(new UnselectShapeEvent_1.UnselectShapeEvent(shape.id, ActionManager_1.ActionManager.userId, ActionManager_1.ActionManager.getTimeStamp()));
    }
    unselectAllShapes() {
        let shapeList = this.selectedShapes.slice();
        shapeList.forEach((shape) => {
            this.unselectShape(shape);
        });
    }
    keyUp(e, canvas) {
        if (e.code === "Delete" || (e.code === "KeyD" && e.ctrlKey) || (e.code === "KeyD" && e.altKey)) {
            let userId = ActionManager_1.ActionManager.userId;
            let timeStamp = ActionManager_1.ActionManager.getTimeStamp();
            for (let shape of this.selectedShapes) {
                EventManager_1.EventManager.emit(new DeleteShapeEvent_1.DeleteShapeEvent(shape.id, userId, timeStamp));
            }
        }
    }
    toUnselect() {
        this.unselectAllShapes();
    }
}
exports.SelectTool = SelectTool;

},{"../../../Actions/ActionManager":1,"../../../Events/DeleteShapeEvent":10,"../../../Events/EventManager":11,"../../../Events/SelectShapeEvent":15,"../../../Events/TranslateShapeEvent":19,"../../../Events/UnselectShapeEvent":20,"../../../helpers":37,"../../Shapes/Shape":32,"./Tool":36,"d3-selection":39}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Tool {
    constructor() {
        this.id = "unknown";
        this.isDown = false;
    }
    setupUI(toolBar, selected) {
        let button = toolBar.holderSelection.append("button")
            .attr("id", this.id + "-button")
            .classed("selected", selected);
        button.on("click", () => {
            toolBar.holderSelection
                .selectAll("button")
                .classed("selected", false);
            button.classed("selected", true);
            toolBar.selectedTool.toUnselect();
            toolBar.selectedTool = this;
        });
    }
    pointerDown(e, canvas) {
        this.isDown = true;
    }
    pointerMove(e, canvas) {
    }
    pointerUp(e, canvas) {
        this.isDown = false;
    }
    pointerCancel(e, canvas) {
        this.isDown = false;
    }
    pointerLeave(e, canvas) {
        this.isDown = false;
    }
    keyUp(e, canvas) { }
    toUnselect() { }
}
exports.Tool = Tool;

},{}],37:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Helpers {
    static pageToSVG(p, svgSelection) {
        let svg = svgSelection.node();
        let pt = svg.createSVGPoint(), svgP;
        pt.x = p.x;
        pt.y = p.y;
        svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
        return { x: svgP.x, y: svgP.y };
    }
    static pointsToDAttr(pts) {
        let d = `M${pts[0].x}, ${pts[0].y}`;
        for (let i = 1; i < pts.length; i++) {
            d += ` L${pts[i].x}, ${pts[i].y}`;
        }
        return d;
    }
}
exports.Helpers = Helpers;

},{}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ToolBar_1 = require("./View/ToolBar/ToolBar");
const Canvas_1 = require("./View/Canvas");
const InfoPanel_1 = require("./View/InfoPanel/InfoPanel");
const ActionManager_1 = require("./Actions/ActionManager");
const LoginMenu_1 = require("./LoginMenu");
const PeerManager_1 = require("./Peer2Peer/PeerManager");
new LoginMenu_1.LoginMenu(new PeerManager_1.PeerManager(new ActionManager_1.ActionManager(new Canvas_1.Canvas(new ToolBar_1.ToolBar(), new InfoPanel_1.InfoPanel()))));

},{"./Actions/ActionManager":1,"./LoginMenu":21,"./Peer2Peer/PeerManager":23,"./View/Canvas":26,"./View/InfoPanel/InfoPanel":28,"./View/ToolBar/ToolBar":33}],39:[function(require,module,exports){
// https://d3js.org/d3-selection/ v1.4.1 Copyright 2019 Mike Bostock
(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = global || self, factory(global.d3 = global.d3 || {}));
}(this, function (exports) { 'use strict';

var xhtml = "http://www.w3.org/1999/xhtml";

var namespaces = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: xhtml,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};

function namespace(name) {
  var prefix = name += "", i = prefix.indexOf(":");
  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
  return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name;
}

function creatorInherit(name) {
  return function() {
    var document = this.ownerDocument,
        uri = this.namespaceURI;
    return uri === xhtml && document.documentElement.namespaceURI === xhtml
        ? document.createElement(name)
        : document.createElementNS(uri, name);
  };
}

function creatorFixed(fullname) {
  return function() {
    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
  };
}

function creator(name) {
  var fullname = namespace(name);
  return (fullname.local
      ? creatorFixed
      : creatorInherit)(fullname);
}

function none() {}

function selector(selector) {
  return selector == null ? none : function() {
    return this.querySelector(selector);
  };
}

function selection_select(select) {
  if (typeof select !== "function") select = selector(select);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
      }
    }
  }

  return new Selection(subgroups, this._parents);
}

function empty() {
  return [];
}

function selectorAll(selector) {
  return selector == null ? empty : function() {
    return this.querySelectorAll(selector);
  };
}

function selection_selectAll(select) {
  if (typeof select !== "function") select = selectorAll(select);

  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        subgroups.push(select.call(node, node.__data__, i, group));
        parents.push(node);
      }
    }
  }

  return new Selection(subgroups, parents);
}

function matcher(selector) {
  return function() {
    return this.matches(selector);
  };
}

function selection_filter(match) {
  if (typeof match !== "function") match = matcher(match);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new Selection(subgroups, this._parents);
}

function sparse(update) {
  return new Array(update.length);
}

function selection_enter() {
  return new Selection(this._enter || this._groups.map(sparse), this._parents);
}

function EnterNode(parent, datum) {
  this.ownerDocument = parent.ownerDocument;
  this.namespaceURI = parent.namespaceURI;
  this._next = null;
  this._parent = parent;
  this.__data__ = datum;
}

EnterNode.prototype = {
  constructor: EnterNode,
  appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
  insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
  querySelector: function(selector) { return this._parent.querySelector(selector); },
  querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
};

function constant(x) {
  return function() {
    return x;
  };
}

var keyPrefix = "$"; // Protect against keys like “__proto__”.

function bindIndex(parent, group, enter, update, exit, data) {
  var i = 0,
      node,
      groupLength = group.length,
      dataLength = data.length;

  // Put any non-null nodes that fit into update.
  // Put any null nodes into enter.
  // Put any remaining data into enter.
  for (; i < dataLength; ++i) {
    if (node = group[i]) {
      node.__data__ = data[i];
      update[i] = node;
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }

  // Put any non-null nodes that don’t fit into exit.
  for (; i < groupLength; ++i) {
    if (node = group[i]) {
      exit[i] = node;
    }
  }
}

function bindKey(parent, group, enter, update, exit, data, key) {
  var i,
      node,
      nodeByKeyValue = {},
      groupLength = group.length,
      dataLength = data.length,
      keyValues = new Array(groupLength),
      keyValue;

  // Compute the key for each node.
  // If multiple nodes have the same key, the duplicates are added to exit.
  for (i = 0; i < groupLength; ++i) {
    if (node = group[i]) {
      keyValues[i] = keyValue = keyPrefix + key.call(node, node.__data__, i, group);
      if (keyValue in nodeByKeyValue) {
        exit[i] = node;
      } else {
        nodeByKeyValue[keyValue] = node;
      }
    }
  }

  // Compute the key for each datum.
  // If there a node associated with this key, join and add it to update.
  // If there is not (or the key is a duplicate), add it to enter.
  for (i = 0; i < dataLength; ++i) {
    keyValue = keyPrefix + key.call(parent, data[i], i, data);
    if (node = nodeByKeyValue[keyValue]) {
      update[i] = node;
      node.__data__ = data[i];
      nodeByKeyValue[keyValue] = null;
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }

  // Add any remaining nodes that were not bound to data to exit.
  for (i = 0; i < groupLength; ++i) {
    if ((node = group[i]) && (nodeByKeyValue[keyValues[i]] === node)) {
      exit[i] = node;
    }
  }
}

function selection_data(value, key) {
  if (!value) {
    data = new Array(this.size()), j = -1;
    this.each(function(d) { data[++j] = d; });
    return data;
  }

  var bind = key ? bindKey : bindIndex,
      parents = this._parents,
      groups = this._groups;

  if (typeof value !== "function") value = constant(value);

  for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
    var parent = parents[j],
        group = groups[j],
        groupLength = group.length,
        data = value.call(parent, parent && parent.__data__, j, parents),
        dataLength = data.length,
        enterGroup = enter[j] = new Array(dataLength),
        updateGroup = update[j] = new Array(dataLength),
        exitGroup = exit[j] = new Array(groupLength);

    bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

    // Now connect the enter nodes to their following update node, such that
    // appendChild can insert the materialized enter node before this node,
    // rather than at the end of the parent node.
    for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
      if (previous = enterGroup[i0]) {
        if (i0 >= i1) i1 = i0 + 1;
        while (!(next = updateGroup[i1]) && ++i1 < dataLength);
        previous._next = next || null;
      }
    }
  }

  update = new Selection(update, parents);
  update._enter = enter;
  update._exit = exit;
  return update;
}

function selection_exit() {
  return new Selection(this._exit || this._groups.map(sparse), this._parents);
}

function selection_join(onenter, onupdate, onexit) {
  var enter = this.enter(), update = this, exit = this.exit();
  enter = typeof onenter === "function" ? onenter(enter) : enter.append(onenter + "");
  if (onupdate != null) update = onupdate(update);
  if (onexit == null) exit.remove(); else onexit(exit);
  return enter && update ? enter.merge(update).order() : update;
}

function selection_merge(selection) {

  for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }

  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }

  return new Selection(merges, this._parents);
}

function selection_order() {

  for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
    for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
      if (node = group[i]) {
        if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
        next = node;
      }
    }
  }

  return this;
}

function selection_sort(compare) {
  if (!compare) compare = ascending;

  function compareNode(a, b) {
    return a && b ? compare(a.__data__, b.__data__) : !a - !b;
  }

  for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        sortgroup[i] = node;
      }
    }
    sortgroup.sort(compareNode);
  }

  return new Selection(sortgroups, this._parents).order();
}

function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

function selection_call() {
  var callback = arguments[0];
  arguments[0] = this;
  callback.apply(null, arguments);
  return this;
}

function selection_nodes() {
  var nodes = new Array(this.size()), i = -1;
  this.each(function() { nodes[++i] = this; });
  return nodes;
}

function selection_node() {

  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
      var node = group[i];
      if (node) return node;
    }
  }

  return null;
}

function selection_size() {
  var size = 0;
  this.each(function() { ++size; });
  return size;
}

function selection_empty() {
  return !this.node();
}

function selection_each(callback) {

  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i]) callback.call(node, node.__data__, i, group);
    }
  }

  return this;
}

function attrRemove(name) {
  return function() {
    this.removeAttribute(name);
  };
}

function attrRemoveNS(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}

function attrConstant(name, value) {
  return function() {
    this.setAttribute(name, value);
  };
}

function attrConstantNS(fullname, value) {
  return function() {
    this.setAttributeNS(fullname.space, fullname.local, value);
  };
}

function attrFunction(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttribute(name);
    else this.setAttribute(name, v);
  };
}

function attrFunctionNS(fullname, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
    else this.setAttributeNS(fullname.space, fullname.local, v);
  };
}

function selection_attr(name, value) {
  var fullname = namespace(name);

  if (arguments.length < 2) {
    var node = this.node();
    return fullname.local
        ? node.getAttributeNS(fullname.space, fullname.local)
        : node.getAttribute(fullname);
  }

  return this.each((value == null
      ? (fullname.local ? attrRemoveNS : attrRemove) : (typeof value === "function"
      ? (fullname.local ? attrFunctionNS : attrFunction)
      : (fullname.local ? attrConstantNS : attrConstant)))(fullname, value));
}

function defaultView(node) {
  return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
      || (node.document && node) // node is a Window
      || node.defaultView; // node is a Document
}

function styleRemove(name) {
  return function() {
    this.style.removeProperty(name);
  };
}

function styleConstant(name, value, priority) {
  return function() {
    this.style.setProperty(name, value, priority);
  };
}

function styleFunction(name, value, priority) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.style.removeProperty(name);
    else this.style.setProperty(name, v, priority);
  };
}

function selection_style(name, value, priority) {
  return arguments.length > 1
      ? this.each((value == null
            ? styleRemove : typeof value === "function"
            ? styleFunction
            : styleConstant)(name, value, priority == null ? "" : priority))
      : styleValue(this.node(), name);
}

function styleValue(node, name) {
  return node.style.getPropertyValue(name)
      || defaultView(node).getComputedStyle(node, null).getPropertyValue(name);
}

function propertyRemove(name) {
  return function() {
    delete this[name];
  };
}

function propertyConstant(name, value) {
  return function() {
    this[name] = value;
  };
}

function propertyFunction(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) delete this[name];
    else this[name] = v;
  };
}

function selection_property(name, value) {
  return arguments.length > 1
      ? this.each((value == null
          ? propertyRemove : typeof value === "function"
          ? propertyFunction
          : propertyConstant)(name, value))
      : this.node()[name];
}

function classArray(string) {
  return string.trim().split(/^|\s+/);
}

function classList(node) {
  return node.classList || new ClassList(node);
}

function ClassList(node) {
  this._node = node;
  this._names = classArray(node.getAttribute("class") || "");
}

ClassList.prototype = {
  add: function(name) {
    var i = this._names.indexOf(name);
    if (i < 0) {
      this._names.push(name);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  remove: function(name) {
    var i = this._names.indexOf(name);
    if (i >= 0) {
      this._names.splice(i, 1);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  contains: function(name) {
    return this._names.indexOf(name) >= 0;
  }
};

function classedAdd(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n) list.add(names[i]);
}

function classedRemove(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n) list.remove(names[i]);
}

function classedTrue(names) {
  return function() {
    classedAdd(this, names);
  };
}

function classedFalse(names) {
  return function() {
    classedRemove(this, names);
  };
}

function classedFunction(names, value) {
  return function() {
    (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
  };
}

function selection_classed(name, value) {
  var names = classArray(name + "");

  if (arguments.length < 2) {
    var list = classList(this.node()), i = -1, n = names.length;
    while (++i < n) if (!list.contains(names[i])) return false;
    return true;
  }

  return this.each((typeof value === "function"
      ? classedFunction : value
      ? classedTrue
      : classedFalse)(names, value));
}

function textRemove() {
  this.textContent = "";
}

function textConstant(value) {
  return function() {
    this.textContent = value;
  };
}

function textFunction(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.textContent = v == null ? "" : v;
  };
}

function selection_text(value) {
  return arguments.length
      ? this.each(value == null
          ? textRemove : (typeof value === "function"
          ? textFunction
          : textConstant)(value))
      : this.node().textContent;
}

function htmlRemove() {
  this.innerHTML = "";
}

function htmlConstant(value) {
  return function() {
    this.innerHTML = value;
  };
}

function htmlFunction(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.innerHTML = v == null ? "" : v;
  };
}

function selection_html(value) {
  return arguments.length
      ? this.each(value == null
          ? htmlRemove : (typeof value === "function"
          ? htmlFunction
          : htmlConstant)(value))
      : this.node().innerHTML;
}

function raise() {
  if (this.nextSibling) this.parentNode.appendChild(this);
}

function selection_raise() {
  return this.each(raise);
}

function lower() {
  if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
}

function selection_lower() {
  return this.each(lower);
}

function selection_append(name) {
  var create = typeof name === "function" ? name : creator(name);
  return this.select(function() {
    return this.appendChild(create.apply(this, arguments));
  });
}

function constantNull() {
  return null;
}

function selection_insert(name, before) {
  var create = typeof name === "function" ? name : creator(name),
      select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
  return this.select(function() {
    return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
  });
}

function remove() {
  var parent = this.parentNode;
  if (parent) parent.removeChild(this);
}

function selection_remove() {
  return this.each(remove);
}

function selection_cloneShallow() {
  var clone = this.cloneNode(false), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}

function selection_cloneDeep() {
  var clone = this.cloneNode(true), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}

function selection_clone(deep) {
  return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
}

function selection_datum(value) {
  return arguments.length
      ? this.property("__data__", value)
      : this.node().__data__;
}

var filterEvents = {};

exports.event = null;

if (typeof document !== "undefined") {
  var element = document.documentElement;
  if (!("onmouseenter" in element)) {
    filterEvents = {mouseenter: "mouseover", mouseleave: "mouseout"};
  }
}

function filterContextListener(listener, index, group) {
  listener = contextListener(listener, index, group);
  return function(event) {
    var related = event.relatedTarget;
    if (!related || (related !== this && !(related.compareDocumentPosition(this) & 8))) {
      listener.call(this, event);
    }
  };
}

function contextListener(listener, index, group) {
  return function(event1) {
    var event0 = exports.event; // Events can be reentrant (e.g., focus).
    exports.event = event1;
    try {
      listener.call(this, this.__data__, index, group);
    } finally {
      exports.event = event0;
    }
  };
}

function parseTypenames(typenames) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    return {type: t, name: name};
  });
}

function onRemove(typename) {
  return function() {
    var on = this.__on;
    if (!on) return;
    for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
      if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.capture);
      } else {
        on[++i] = o;
      }
    }
    if (++i) on.length = i;
    else delete this.__on;
  };
}

function onAdd(typename, value, capture) {
  var wrap = filterEvents.hasOwnProperty(typename.type) ? filterContextListener : contextListener;
  return function(d, i, group) {
    var on = this.__on, o, listener = wrap(value, i, group);
    if (on) for (var j = 0, m = on.length; j < m; ++j) {
      if ((o = on[j]).type === typename.type && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.capture);
        this.addEventListener(o.type, o.listener = listener, o.capture = capture);
        o.value = value;
        return;
      }
    }
    this.addEventListener(typename.type, listener, capture);
    o = {type: typename.type, name: typename.name, value: value, listener: listener, capture: capture};
    if (!on) this.__on = [o];
    else on.push(o);
  };
}

function selection_on(typename, value, capture) {
  var typenames = parseTypenames(typename + ""), i, n = typenames.length, t;

  if (arguments.length < 2) {
    var on = this.node().__on;
    if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
      for (i = 0, o = on[j]; i < n; ++i) {
        if ((t = typenames[i]).type === o.type && t.name === o.name) {
          return o.value;
        }
      }
    }
    return;
  }

  on = value ? onAdd : onRemove;
  if (capture == null) capture = false;
  for (i = 0; i < n; ++i) this.each(on(typenames[i], value, capture));
  return this;
}

function customEvent(event1, listener, that, args) {
  var event0 = exports.event;
  event1.sourceEvent = exports.event;
  exports.event = event1;
  try {
    return listener.apply(that, args);
  } finally {
    exports.event = event0;
  }
}

function dispatchEvent(node, type, params) {
  var window = defaultView(node),
      event = window.CustomEvent;

  if (typeof event === "function") {
    event = new event(type, params);
  } else {
    event = window.document.createEvent("Event");
    if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
    else event.initEvent(type, false, false);
  }

  node.dispatchEvent(event);
}

function dispatchConstant(type, params) {
  return function() {
    return dispatchEvent(this, type, params);
  };
}

function dispatchFunction(type, params) {
  return function() {
    return dispatchEvent(this, type, params.apply(this, arguments));
  };
}

function selection_dispatch(type, params) {
  return this.each((typeof params === "function"
      ? dispatchFunction
      : dispatchConstant)(type, params));
}

var root = [null];

function Selection(groups, parents) {
  this._groups = groups;
  this._parents = parents;
}

function selection() {
  return new Selection([[document.documentElement]], root);
}

Selection.prototype = selection.prototype = {
  constructor: Selection,
  select: selection_select,
  selectAll: selection_selectAll,
  filter: selection_filter,
  data: selection_data,
  enter: selection_enter,
  exit: selection_exit,
  join: selection_join,
  merge: selection_merge,
  order: selection_order,
  sort: selection_sort,
  call: selection_call,
  nodes: selection_nodes,
  node: selection_node,
  size: selection_size,
  empty: selection_empty,
  each: selection_each,
  attr: selection_attr,
  style: selection_style,
  property: selection_property,
  classed: selection_classed,
  text: selection_text,
  html: selection_html,
  raise: selection_raise,
  lower: selection_lower,
  append: selection_append,
  insert: selection_insert,
  remove: selection_remove,
  clone: selection_clone,
  datum: selection_datum,
  on: selection_on,
  dispatch: selection_dispatch
};

function select(selector) {
  return typeof selector === "string"
      ? new Selection([[document.querySelector(selector)]], [document.documentElement])
      : new Selection([[selector]], root);
}

function create(name) {
  return select(creator(name).call(document.documentElement));
}

var nextId = 0;

function local() {
  return new Local;
}

function Local() {
  this._ = "@" + (++nextId).toString(36);
}

Local.prototype = local.prototype = {
  constructor: Local,
  get: function(node) {
    var id = this._;
    while (!(id in node)) if (!(node = node.parentNode)) return;
    return node[id];
  },
  set: function(node, value) {
    return node[this._] = value;
  },
  remove: function(node) {
    return this._ in node && delete node[this._];
  },
  toString: function() {
    return this._;
  }
};

function sourceEvent() {
  var current = exports.event, source;
  while (source = current.sourceEvent) current = source;
  return current;
}

function point(node, event) {
  var svg = node.ownerSVGElement || node;

  if (svg.createSVGPoint) {
    var point = svg.createSVGPoint();
    point.x = event.clientX, point.y = event.clientY;
    point = point.matrixTransform(node.getScreenCTM().inverse());
    return [point.x, point.y];
  }

  var rect = node.getBoundingClientRect();
  return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
}

function mouse(node) {
  var event = sourceEvent();
  if (event.changedTouches) event = event.changedTouches[0];
  return point(node, event);
}

function selectAll(selector) {
  return typeof selector === "string"
      ? new Selection([document.querySelectorAll(selector)], [document.documentElement])
      : new Selection([selector == null ? [] : selector], root);
}

function touch(node, touches, identifier) {
  if (arguments.length < 3) identifier = touches, touches = sourceEvent().changedTouches;

  for (var i = 0, n = touches ? touches.length : 0, touch; i < n; ++i) {
    if ((touch = touches[i]).identifier === identifier) {
      return point(node, touch);
    }
  }

  return null;
}

function touches(node, touches) {
  if (touches == null) touches = sourceEvent().touches;

  for (var i = 0, n = touches ? touches.length : 0, points = new Array(n); i < n; ++i) {
    points[i] = point(node, touches[i]);
  }

  return points;
}

exports.clientPoint = point;
exports.create = create;
exports.creator = creator;
exports.customEvent = customEvent;
exports.local = local;
exports.matcher = matcher;
exports.mouse = mouse;
exports.namespace = namespace;
exports.namespaces = namespaces;
exports.select = select;
exports.selectAll = selectAll;
exports.selection = selection;
exports.selector = selector;
exports.selectorAll = selectorAll;
exports.style = styleValue;
exports.touch = touch;
exports.touches = touches;
exports.window = defaultView;

Object.defineProperty(exports, '__esModule', { value: true });

}));

},{}]},{},[38]);
