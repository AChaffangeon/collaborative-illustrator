import { Action, ActionManager } from "./ActionManager";
import { Canvas } from "../View/Canvas";
import {PeerDisplay} from "../View/InfoPanel/PeerDisplay"


export class DisconectAction implements Action {
    type: string;
    userId: string;
    timeStamp: number;
    objectId: string;

    constructor(userId: string, timeStamp: number) {
        this.type = "disconect";
        this.userId = userId;
        this.timeStamp = timeStamp;
    }

    do(canvas: Canvas): void {
        PeerDisplay.removePeer(this.userId);
    }

    undo(canvas: Canvas): void {
        console.log("reco");
    }
}
