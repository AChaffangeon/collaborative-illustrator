"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SignalingChannel {
    constructor(socket, signalingChannel) {
        this.signalingChannel = signalingChannel;
        this.socket = socket;
        this.onMSG = (msg) => { };
        this.setupOnMsg();
    }
    send(msg) {
        this.socket.emit("msg", { signalingChannel: this.signalingChannel, msg: msg });
    }
    setupOnMsg() {
        this.socket.register("msg", (data) => {
            if (data.signalingChannel !== this.signalingChannel) {
                return;
            }
            this.onMSG(data.msg);
        });
    }
    setOnMSG(f) {
        this.onMSG = f;
    }
    close() {
        this.socket.emit("closeSC", { signalingChannel: this.signalingChannel });
    }
}
exports.SignalingChannel = SignalingChannel;
//# sourceMappingURL=SignalingChannel.js.map