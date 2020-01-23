import { ActionEvent } from "./EventManager";
import { DisconectAction } from "../Actions/DisconectAction";

export class DisconectEvent implements ActionEvent {
    id: string = "disconect";
    action: DisconectAction;

    constructor(userId: string, timeStamp: number) {
        this.action = new DisconectAction(userId, timeStamp);
    }
}
