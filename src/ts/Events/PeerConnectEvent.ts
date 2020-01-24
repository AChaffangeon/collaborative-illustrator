import { Event } from "./EventManager";

export class PeerConnectEvent implements Event {
    id: string = "peerConnect";
    userId: string;
    color: string;

    constructor(userId: string, color: string) {
        this.userId = userId;
        this.color = color;
    }
}
