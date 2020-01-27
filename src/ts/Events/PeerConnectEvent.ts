import { Event } from "./EventManager";
import { ActionManager } from "../Actions/ActionManager";


/** A class to signal that a peer has been connected. */
export class PeerConnectEvent implements Event {
    id: string = "peerConnect";
    userId: string;
    color: string;

    constructor(userId: string, color: string) {
        this.userId = userId;
        this.color = color;
        ActionManager.addNewPeer(this.userId);    
    }
}
