import { RoomServer } from "./roomServer";

export class SignalingChannel {
    // tslint:disable-next-line: typedef
    socket: RoomServer;
    signalingChannel: string;
    onMSG: (msg: any) => void;

    // tslint:disable-next-line: typedef
    constructor(socket: RoomServer, signalingChannel: string) {
        this.signalingChannel = signalingChannel;
        this.socket = socket;
        this.onMSG = (msg) => { };
        this.setupOnMsg();
    }

    send(msg: any): void {
        this.socket.emit("msg", { signalingChannel: this.signalingChannel, msg: msg});
    }

    setupOnMsg(): void {
        this.socket.register("msg", (data) => {
            if (data.signalingChannel !== this.signalingChannel) {
                return;
            }
            this.onMSG(data.msg);
        });
    }

    setOnMSG(f: (msg: any) => void): void {
        this.onMSG = f;
    }

    close(): void {
        this.socket.emit("closeSC", { signalingChannel: this.signalingChannel});
    }
}
