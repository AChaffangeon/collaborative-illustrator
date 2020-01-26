import { RoomServer } from "./roomServer";

/** A class for signaling channel for two peers to exchange messages. Used during the ICE framework. */
export class SignalingChannel {
    /** The room server where the channel is hosted. */
    socket: RoomServer;
    /** Id of the channel hosted on the room server. */
    signalingChannel: string;
    /** Function to do when receiving a message through the channel. */
    onMSG: (msg: any) => void;

    constructor(socket: RoomServer, signalingChannel: string) {
        this.signalingChannel = signalingChannel;
        this.socket = socket;
        this.onMSG = (msg) => { };
        this.setupOnMsg();
    }

    /**
     * Sends a message through the signaling channel.
     * @param msg Message to send.
     */
    send(msg: any): void {
        this.socket.emit("msg", { signalingChannel: this.signalingChannel, msg: msg});
    }

    /**
     * Setups what to do when receiving a message through the signalingChannel.
     */
    private setupOnMsg(): void {
        this.socket.register("msg", (data) => {
            if (data.signalingChannel !== this.signalingChannel) {
                return;
            }
            this.onMSG(data.msg);
        });
    }

    /**
     * Sets onMsg function.
     * @param f Function to use as onMsg.
     */
    setOnMSG(f: (msg: any) => void): void {
        this.onMSG = f;
    }

    /**
     * Closes the signaling channel.
     */
    close(): void {
        this.socket.emit("closeSC", { signalingChannel: this.signalingChannel});
    }
}
