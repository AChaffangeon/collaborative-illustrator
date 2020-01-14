import { SignalingChannel } from './SignalingChannel';
import { EventManager, Event } from '../Events/EventManager';
import { ShapeCreatedEvent } from '../Events/ShapeCreatedEvent';
import { ColorChangedEvent } from '../Events/ColorChangedEvent';
import { FreeForm } from '../View/Shapes/FreeForm';
import { ActionManager } from '../Actions/ActionManager';

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

    constructor(isOfferer: boolean = false) {
        this.connection = new RTCPeerConnection(configuration);
        this.signalingChannel = new SignalingChannel();
        this.config(isOfferer);
    }

    config(isOfferer: boolean): void {
        this.connection.onicecandidate = (event) => {
            if (event.candidate) {
                this.signalingChannel.send({ id: "ICECandidate", candidate: event.candidate });
            }
        };

        if (isOfferer) {
            this.connection.onnegotiationneeded = () => {
                this.connection.createOffer().then((offer) => {
                    this.setLocalDescirption(offer);
                }).catch((e) => console.log(e));
            };

            this.dataChannel = this.connection.createDataChannel('chat');
            this.setupDataChannel();
        } else {
            this.connection.ondatachannel = (event) => {
                console.log("data channel added");
                this.dataChannel = event.channel;
                this.setupDataChannel();
            };
        }

        this.listenToMsg();
    }

    setLocalDescirption(description: RTCSessionDescriptionInit): void {
        this.connection.setLocalDescription(description)
            .then(() => {
                this.signalingChannel.send({ id: "SDP", description: this.connection.localDescription });
            })
            .catch((e) => console.log(e));
    }

    listenToMsg(): void {
        let socket = this.signalingChannel.socket;
        socket.on("msg", (msg) => {
            console.log("Received: ", msg);
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
                                        this.setLocalDescirption(answer);
                                    });
                            }
                        });
                    break;
            
                default:
                    console.log("Unhandled MSG: ", msg);
                    break;
            }
        });
    }

    setupDataChannel(): void {
        this.dataChannel.onopen = (event) => {
            console.log("Datachannel is open!!!");
            this.register();
        };

        this.dataChannel.onmessage = (event) => {
            let msg = JSON.parse(event.data);
            if (msg) {
                if (msg.id === "shapeCreated") {
                    let shape = new FreeForm();
                    shape.addPoints(msg.data.path);
                    let e = new ShapeCreatedEvent(shape);
                    e.action.UserId = msg.userId;
                    EventManager.emit(e);
                }
            }
        };
    }

    send(msg: string): void {
        this.dataChannel.send(msg);
    }

    sendEvent(event: Event): void {
        if (event.action.UserId === ActionManager.UserId) {
            console.log("Shape sent");
            this.send(JSON.stringify(event));
        }
    }

    register(): void {
        EventManager.registerHandler("shapeCreated", (event: ShapeCreatedEvent) => {
            if (event.action.UserId === ActionManager.UserId) {
                console.log("Shape sent");
                this.send(JSON.stringify({ id: event.id, userId: event.action.UserId, data: event.action.shape }));
            }
        });

        EventManager.registerHandler("colorChanged", (event: ColorChangedEvent) => {
            this.sendEvent(event);
        });
    }
}