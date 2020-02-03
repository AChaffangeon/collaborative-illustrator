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
//# sourceMappingURL=Peer.js.map