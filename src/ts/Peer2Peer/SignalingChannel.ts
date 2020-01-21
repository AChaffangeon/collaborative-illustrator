const io = require('socket.io-client');

interface MSG { id: string; }

export class SignalingChannel {
    // tslint:disable-next-line: typedef
    socket;
    signalingChannel: string;
    onMSG: (msg: any) => void;

    // tslint:disable-next-line: typedef
    constructor(socket, signalingChannel: string) {
        this.signalingChannel = signalingChannel;
        this.socket = socket;
        this.onMSG = (msg) => { };

        this.setupOnMsg();
    }

    send(msg: any): void {
        this.socket.emit("msg", { signalingChannel: this.signalingChannel, msg: msg});
    }

    setupOnMsg(): void {
        this.socket.on("msg", (msg: { signalingChannel: string; msg: any; }) => {
            if (msg.signalingChannel !== this.signalingChannel) {
                return;
            }
            this.onMSG(msg.msg);
        });
    }

    setOnMSG(f: (msg: any) => void): void {
        this.onMSG = f;
    }

    close(): void {
        this.socket.emit("closeSC", { signalingChannel: this.signalingChannel});
    }
}
