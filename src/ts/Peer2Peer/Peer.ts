import { SignalingChannel } from './SignalingChannel';
import { EventManager, Event } from '../Events/EventManager';
import { ShapeCreatedEvent } from '../Events/ShapeCreatedEvent';
import { FreeForm } from '../View/Shapes/FreeForm';
import { ActionManager } from '../Actions/ActionManager';
import { StrokeChangedEvent } from '../Events/StrokeChangedEvent';
import { StrokeWidthChangedEvent } from '../Events/StrokeWidthChangedEvent';
import { FillChangedEvent } from '../Events/FillChangedEvent';
import { TranslateShapeEvent } from '../Events/TranslateShapeEvent';

const configuration = {
    iceServers: [{
        urls: 'stun:stun.l.google.com:19302'
    }]
};

/** Based on the code from https://github.com/ScaleDrone/webrtc-text-chat-tutorial/blob/master/script.js */
export class Peer {
    connection: RTCPeerConnection;
    signalingChannel: SignalingChannel;
    dataChannel: RTCDataChannel;

    constructor(signalingChannel: SignalingChannel, isOfferer: boolean = false) {
        this.connection = new RTCPeerConnection(configuration);
        this.signalingChannel = signalingChannel;
        this.config(isOfferer);
    }

    config(isOfferer: boolean): void {
        this.connection.onicecandidate = (event) => {
            if (event.candidate) {
                console.log(`[SENT]: ICE candidate TO: ${this.signalingChannel.signalingChannel}`)
                this.signalingChannel.send({ id: "ICECandidate", candidate: event.candidate });
            }
        };

        if (isOfferer) {
            this.connection.onnegotiationneeded = () => {
                console.log(`Create Local Description: ${this.signalingChannel.signalingChannel}`);

                this.connection.createOffer().then((offer) => {
                    this.setLocalDescription(offer);
                }).catch((e) => console.log(`Error negotiations with: ${this.signalingChannel.signalingChannel}`, e));
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
                console.log(`[SENT] Local description TO: ${this.signalingChannel.signalingChannel}`)
                this.signalingChannel.send({ id: "SDP", description: this.connection.localDescription });
            })
            .catch((e) => console.log(`Error set local description with: ${this.signalingChannel.signalingChannel}: `, e));
    }

    listenToMsg(): void {
        let onMsg = (msg) => {
            console.log(`[Received]: ${msg.id} FROM ${this.signalingChannel.signalingChannel}`);
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
                        .catch((e) => console.log("Error set Remote description: ", e, msg, this.connection, this.signalingChannel.signalingChannel));
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
            console.log(`Datachannel is open with: ${this.signalingChannel.signalingChannel}`);
            this.signalingChannel.close();
            this.register();
        };

        this.dataChannel.onmessage = (event) => {
            let msg = JSON.parse(event.data);
            if (msg) {
                console.log(msg);
                if (msg.id === "shapeCreated") {
                    console.log(msg);
                    let shape = new FreeForm();
                    shape.addPoints(msg.data.path);
                    shape.id = msg.data.id;
                    let e = new ShapeCreatedEvent(shape);
                    e.action.userId = msg.userId;
                    EventManager.emit(e);
                } else if (msg.id === "strokeChanged") {
                    let e = new StrokeChangedEvent(msg.action.color, msg.action.objectId);
                    e.action.userId = msg.action.userId;
                    EventManager.emit(e);
                } else if (msg.id === "strokeWidthChanged") {
                    let e = new StrokeWidthChangedEvent(msg.action.width, msg.action.objectId);
                    e.action.userId = msg.action.userId;
                    EventManager.emit(e);
                } else if (msg.id === "fillChanged") {
                    let e = new FillChangedEvent(msg.action.color, msg.action.objectId);
                    e.action.userId = msg.action.userId;
                    EventManager.emit(e);
                } else if (msg.id === "translateShape") {
                    let e = new TranslateShapeEvent(msg.action.translate, msg.action.objectId);
                    e.action.userId = msg.action.userId;
                    EventManager.emit(e);
                }
            }
        };
    }

    send(msg: string): void {
        this.dataChannel.send(msg);
    }

    sendEvent(event: Event): void {
        if (event.action.userId === ActionManager.userId) {
            this.send(JSON.stringify(event));
        }
    }

    register(): void {
        EventManager.registerHandler("shapeCreated", (event: ShapeCreatedEvent) => {
            if (event.action.userId === ActionManager.userId) {
                this.send(JSON.stringify({ id: event.id, userId: event.action.userId, data: event.action.shape }));
            }
        });

        EventManager.registerHandler("strokeChanged", (event: StrokeChangedEvent) => {
            this.sendEvent(event);
        });

        EventManager.registerHandler("strokeWidthChanged", (event: StrokeWidthChangedEvent) => {
            this.sendEvent(event);
        });

        EventManager.registerHandler("fillChanged", (event: FillChangedEvent) => {
            this.sendEvent(event);
        });

        EventManager.registerHandler("translateShape", (event: TranslateShapeEvent) => {
            this.sendEvent(event);
        });
    }
}