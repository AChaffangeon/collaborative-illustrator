import { Event } from "./EventManager";

export class PeerDisconnectEvent implements Event {
    id: string = "peerDisconnect";
    userId: string;

    constructor(userId: string) {
        this.userId = userId;
    }
}
