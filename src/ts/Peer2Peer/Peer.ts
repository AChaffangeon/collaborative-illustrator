import { SignalingChannel } from './SignalingChannel';
import { EventManager, Event, ActionEvent } from '../Events/EventManager';
import { ShapeCreatedEvent } from '../Events/ShapeCreatedEvent';
import { FreeForm } from '../View/Shapes/FreeForm';
import { ActionManager } from '../Actions/ActionManager';
import { StrokeChangedEvent } from '../Events/StrokeChangedEvent';
import { StrokeWidthChangedEvent } from '../Events/StrokeWidthChangedEvent';
import { FillChangedEvent } from '../Events/FillChangedEvent';
import { TranslateShapeEvent } from '../Events/TranslateShapeEvent';
import { DeleteShapeEvent } from '../Events/DeleteShapeEvent';
import { AddShapeAction } from '../Actions/AddShapeAction';
import { DeleteShapeAction } from '../Actions/DeleteShapeAction';
import { TranslateShapeAction } from '../Actions/TranslateShapeAction';
import { UpdateFillAction } from '../Actions/UpdateFillAction';
import { UpdateStrokeAction } from '../Actions/UpdateStrokeAction';
import { UpdateStrokeWidthAction } from '../Actions/UpdateStrokeWidthAction';
import { PeerDisplay } from "../View/InfoPanel/PeerDisplay";
import { PeerConnectEvent } from '../Events/PeerConnectEvent';
import { PeerDisconnectEvent } from '../Events/PeerDisconnectEvent';


const configuration = {
    iceServers: [
        {
            urls: 'stun:stun.l.google.com:19302'
        }]
};

/** Based on the code from https://github.com/ScaleDrone/webrtc-text-chat-tutorial/blob/master/script.js */
export class Peer {
    static colorList: string[] = ["#E69F00", "#56B4E9", "#009E73", "#F0E442", "#0072B2", "#D55E00", "#CC79A7", "#000000"];
    static index: number = 0;
    connection: RTCPeerConnection;
    signalingChannel: SignalingChannel;
    dataChannel: RTCDataChannel;
    isOfferer: boolean;
    actionManager: ActionManager;
    peerId: string;
    peerDisplay: PeerDisplay;
    color: string;

    constructor(signalingChannel: SignalingChannel, actionManager: ActionManager, isOfferer: boolean = false) {
        this.connection = new RTCPeerConnection(configuration);
        this.signalingChannel = signalingChannel;
        this.isOfferer = isOfferer;
        this.actionManager = actionManager;
        this.peerId = `Peer-${Peer.index}`;
        this.setupColor();
        this.config();

    }

    setupColor(): void {
        this.color = Peer.colorList[Peer.index % Peer.colorList.length];
        Peer.index = Peer.index + 1;
    }

    config(): void {
        this.connection.onicecandidate = (event) => {
            if (event.candidate) {
                console.log(`[SENT]: ICE candidate TO: ${this.peerId}`);
                this.signalingChannel.send({ id: "ICECandidate", candidate: event.candidate, userId: ActionManager.userId });
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
        } else {
            this.connection.ondatachannel = (event) => {
                this.dataChannel = event.channel;
                this.setupDataChannel();
            };
        }

        this.listenToMsg();
    }

    setLocalDescription(description: RTCSessionDescriptionInit): void {
        this.connection.setLocalDescription(description)
            .then(() => {
                console.log(`[SENT] Local description TO: ${this.peerId}`);
                this.signalingChannel.send({ id: "SDP", description: this.connection.localDescription });
            })
            .catch((e) => console.log(`Error set local description with: ${this.peerId}: `, e));
    }

    listenToMsg(): void {
        let onMsg = (msg) => {
            console.log(`[Received]: ${msg.id} FROM ${this.peerId}`);
            switch (msg.id) {
                case "ICECandidate":
                    if (msg.candidate) {
                        this.connection.addIceCandidate(msg.candidate);
                    }
                    break;

                case "SDP": // received a description for remote connection
                    this.connection.setRemoteDescription(msg.description)
                        .then(() => {
                            if (this.connection.remoteDescription.type === "offer") {
                                this.connection.createAnswer()
                                    .then((answer) => {
                                        this.setLocalDescription(answer);
                                    })
                                    .catch((e) => console.log("Error create answer: ", e));
                            }
                        })
                        .catch((e) => console.log("Error set Remote description: ", e, msg, this.connection, this.peerId));
                    break;

                default:
                    console.log("Unhandled MSG: ", msg);
                    break;
            }
        };
        this.signalingChannel.setOnMSG(onMsg);
    }

    setupDataChannel(): void {
        this.dataChannel.onopen = (event) => {
            console.log(`Datachannel is open with: ${this.peerId}`);
            this.signalingChannel.close();
            this.setupEventHandler();
            if (!this.isOfferer) {
                this.sendCurrentState();
            }
            EventManager.emit(new PeerConnectEvent(this.peerId, this.color));
        };

        this.dataChannel.onmessage = (event) => {
            let msg = JSON.parse(event.data);
            if (msg) {
                if (msg.id === "shapeCreated") {
                    let shape = new FreeForm();
                    shape.addPoints(msg.action.shape.path);
                    shape.id = msg.action.objectId;
                    shape.stroke = msg.action.shape.stroke;
                    shape.strokeWidth = msg.action.shape.strokeWidth;
                    shape.fill = msg.action.shape.fill;
                    let e = new ShapeCreatedEvent(shape, msg.action.userId, msg.action.timeStamp);
                    EventManager.emit(e);
                } else if (msg.id === "strokeChanged") {
                    let e = new StrokeChangedEvent(msg.action.color, msg.action.objectId, msg.action.userId, msg.action.timeStamp);
                    EventManager.emit(e);
                } else if (msg.id === "strokeWidthChanged") {
                    let e = new StrokeWidthChangedEvent(msg.action.width, msg.action.objectId, msg.action.userId, msg.action.timeStamp);
                    EventManager.emit(e);
                } else if (msg.id === "fillChanged") {
                    let e = new FillChangedEvent(msg.action.color, msg.action.objectId, msg.action.userId, msg.action.timeStamp);
                    EventManager.emit(e);
                } else if (msg.id === "translateShape") {
                    let e = new TranslateShapeEvent(msg.action.translate, msg.action.objectId, msg.action.userId, msg.action.timeStamp);
                    EventManager.emit(e);
                } else if (msg.id === "shapeDeleted") {
                    let e = new DeleteShapeEvent(msg.action.objectId, msg.action.userId, msg.action.timeStamp);
                    EventManager.emit(e);
                } else if (msg.id === "peerDisconnect") {
                    let e = new PeerDisconnectEvent(this.peerId);
                    EventManager.emit(e);
                }
            }
        };
    }

    send(msg: string): void {
        this.dataChannel.send(msg);
    }

    sendEvent(event: Event): void {
        this.send(JSON.stringify(event));
    }

    sendActionEvent(event: ActionEvent): void {
        if (event.action.userId === ActionManager.userId) {
            this.sendEvent(event);
        }
    }

    setupEventHandler(): void {
        EventManager.registerHandler("shapeCreated", (event: ShapeCreatedEvent) => {
            this.sendActionEvent(event);
        });

        EventManager.registerHandler("strokeChanged", (event: StrokeChangedEvent) => {
            this.sendActionEvent(event);
        });

        EventManager.registerHandler("strokeWidthChanged", (event: StrokeWidthChangedEvent) => {
            this.sendActionEvent(event);
        });

        EventManager.registerHandler("fillChanged", (event: FillChangedEvent) => {
            this.sendActionEvent(event);
        });

        EventManager.registerHandler("translateShape", (event: TranslateShapeEvent) => {
            this.sendActionEvent(event);
        });

        EventManager.registerHandler("shapeDeleted", (event: DeleteShapeEvent) => {
            this.sendActionEvent(event);
        });

        window.addEventListener("beforeunload", () => {
            this.sendEvent(new PeerDisconnectEvent(this.peerId));
        });
    }

    sendCurrentState(): void {
        let actions = this.actionManager.doneActions;
        actions.forEach((action) => {
            let e: Event;
            if (action instanceof AddShapeAction) {
                e = new ShapeCreatedEvent(action.shape, action.userId, action.timeStamp);
            } else if (action instanceof DeleteShapeAction) {
                e = new DeleteShapeEvent(action.objectId, action.userId, action.timeStamp);
            } else if (action instanceof TranslateShapeAction) {
                e = new TranslateShapeEvent(action.translate, action.objectId, action.userId, action.timeStamp);
            } else if (action instanceof UpdateFillAction) {
                e = new FillChangedEvent(action.color, action.objectId, action.userId, action.timeStamp);
            } else if (action instanceof UpdateStrokeAction) {
                e = new StrokeChangedEvent(action.color, action.objectId, action.userId, action.timeStamp);
            } else if (action instanceof UpdateStrokeWidthAction) {
                e = new StrokeWidthChangedEvent(action.width, action.objectId, action.userId, action.timeStamp);
            }
            this.send(JSON.stringify(event));
        });
    }
}
