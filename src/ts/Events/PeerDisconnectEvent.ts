import { Event } from "./EventManager";

/** A class to signal that a peer has been disconnected. */
export class PeerDisconnectEvent implements Event {
    id: string = "peerDisconnect";
    userId: string;

    constructor(userId: string) {
        this.userId = userId;
    }
}
