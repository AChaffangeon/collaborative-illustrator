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
import { PeerConnectEvent } from '../Events/PeerConnectEvent';
import { PeerDisconnectEvent } from '../Events/PeerDisconnectEvent';
import { SelectShapeEvent } from '../Events/SelectShapeEvent';
import { SelectShapeAction } from '../Actions/SelectShapeAction';
import { UnselectShapeEvent } from '../Events/UnselectShapeEvent';
import { UnselectShapeAction } from '../Actions/UnselectShapeAction';

/** configuration for RTCPeerConnection. */
const configuration = {
    iceServers: [
        {
            urls: 'stun:stun.l.google.com:19302'
        }]
};

/** A class to represent a Peer. Functions config(), setLocalDescription() and listenToMsg() are based on the code from https://github.com/ScaleDrone/webrtc-text-chat-tutorial/blob/master/script.js . */
export class Peer {
    /** List of possible color for the peers. */
    static colorList: string[] = ["#E69F00", "#009E73", "#F0E442", "#0072B2", "#D55E00", "#CC79A7", "#000000"];
    /** Current index in the list of color. */
    static index: number = 0;
    /** WebRTC connection to the peer. */
    connection: RTCPeerConnection;
    /** SignalingChannel to use during the ICE framework. */
    signalingChannel: SignalingChannel;
    /** Data channel between the two peers to send message. */
    dataChannel: RTCDataChannel;
    /** If isOfferer, this peer is the one asking to connect, i.e. is a new peer. */
    isOfferer: boolean;
    /** Action Manager that represent the user. */
    actionManager: ActionManager;
    /** Color to be used to represend this peer. */
    color: string;
    /** Id of the peer */
    peerId: string;

    constructor(signalingChannel: SignalingChannel, actionManager: ActionManager, peerId: string, isOfferer: boolean = false) {
        this.connection = new RTCPeerConnection(configuration);
        this.signalingChannel = signalingChannel;
        this.isOfferer = isOfferer;
        this.actionManager = actionManager;
        this.peerId = peerId;
        this.setupColor();
        this.config();
    }

    /**
     * Set the color of the peer.
     */
    private setupColor(): void {
        this.color = Peer.colorList[Peer.index % Peer.colorList.length];
        Peer.index = Peer.index + 1;
    }

    /**
     * Instanciate the WebRTC connection.
     */
    private config(): void {
        console.log(`Connect TO: ${this.peerId}`);
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

    /**
     * Create and set the local description for the RTCPeerConnection. Then send the description to the peer.
     * @param description RTCSessionDescriptionInit to use to create the local description.
     */
    private setLocalDescription(description: RTCSessionDescriptionInit): void {
        this.connection.setLocalDescription(description)
            .then(() => {
                console.log(`[SENT] Local description TO: ${this.peerId}`);
                this.signalingChannel.send({ id: "SDP", description: this.connection.localDescription });
            })
            .catch((e) => console.log(`Error set local description with: ${this.peerId}: `, e));
    }

    /**
     * Create and set the remote description for the RTCPeerConnection. If the description is an offer, then send an answer to the peer.
     * @param description RTCSessionDescriptionInit to use to create the remote description.
     */
    private setRemoteDescription(description: RTCSessionDescriptionInit): void {
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

    /**
     * Listen to messages received through the signaling channel.
     */
    private listenToMsg(): void {
        let onMsg = (msg) => {
            console.log(`[Received]: ${msg.id} FROM ${this.peerId}`);
            switch (msg.id) {
                case "ICECandidate":
                    if (msg.candidate) {
                      this.connection.addIceCandidate(msg.candidate);
                    }
                    break;

                case "SDP": // Received a description for remote connection
                    this.setRemoteDescription(msg.description);
                    break;

                default:
                    console.log("Unhandled MSG: ", msg);
                    break;
            }
        };
        this.signalingChannel.setOnMSG(onMsg);
    }

    /**
     * Setup the data channel to use for communication between the peers.
     */
    setupDataChannel(): void {
        this.dataChannel.onopen = (event) => {
            this.onDataChannelOpen();
        };


        this.dataChannel.onmessage = (event) => {
            this.onPeerMsg(event);
        };
    }

    /**
     * When the data channel is open, emit an event that a new user is connected and send the current state of the application.
     */
    private onDataChannelOpen(): void {
        console.log(`Datachannel is open with: ${this.peerId}`);
        this.signalingChannel.close();
        this.setupEventHandler();
        if (!this.isOfferer) {
            this.sendCurrentState();
        }
        EventManager.emit(new PeerConnectEvent(this.peerId, this.color));
    }

    /**
     * Reconstructs events receive from a peer then emit them.
     * @param event event to reconstruc.
     */
    private onPeerMsg(event: MessageEvent): void {
        let msg = JSON.parse(event.data);
        if (msg) {
            if (msg.id === "shapeCreated") {
                let shape = new FreeForm();
                shape.setPoints(msg.action.shape.path);
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
            } else if (msg.id === "selectShape") {
                let e = new SelectShapeEvent(msg.action.objectId, msg.action.userId, msg.action.timeStamp, this.color);
                EventManager.emit(e);
            } else if (msg.id === "unselectShape") {
                let e = new UnselectShapeEvent(msg.action.objectId, msg.action.userId, msg.action.timeStamp);
                EventManager.emit(e);
            }
        }
    }

    /**
     * Sends a message through the data channel to the peer.
     * @param msg Message to send.
     */
    private send(msg: string): void {
        this.dataChannel.send(msg);
    }

    /**
     * Sends an event through the data channel to the peer.
     * @param event Event to send.
     */
    private sendEvent(event: Event): void {
        this.send(JSON.stringify(event));
    }

    /**
     * Sends action event throught the data channel to the peer if the action was done by the user.
     * @param event Action event to send.
     */
    private sendActionEvent(event: ActionEvent): void {
        if (event.action.userId === ActionManager.userId) {
            this.sendEvent(event);
        }
    }

    /**
     * Setups action event handlers.
     */
    private setupEventHandler(): void {
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

        EventManager.registerHandler("selectShape", (event: SelectShapeEvent) => {
            this.sendActionEvent(event);
        });

        EventManager.registerHandler("unselectShape", (event: UnselectShapeEvent) => {
            this.sendActionEvent(event);
        });

        window.addEventListener("beforeunload", () => {
            this.sendEvent(new PeerDisconnectEvent(ActionManager.userId));
        });
    }

    /**
     * Sends current state of the application to newly connected peer.
     */
    private sendCurrentState(): void {
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
            } else if (action instanceof SelectShapeAction) {
                e = new SelectShapeEvent(action.objectId, action.userId, action.timeStamp, action.color);
            } else if (action instanceof UnselectShapeAction) {
                e = new UnselectShapeEvent(action.objectId, action.userId, action.timeStamp);
            }
            this.send(JSON.stringify(e));
        });
    }
}
