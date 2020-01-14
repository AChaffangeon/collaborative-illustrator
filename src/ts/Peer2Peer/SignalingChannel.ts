const io = require('socket.io-client');
import { Socket } from "socket.io-client";

interface MSG { id: string; }

export class SignalingChannel {
    socket;

    constructor() {
        this.socket = new io('http://127.0.0.1:3000');
        this.socket.on('connect', () => {
            console.log("Signaling Channel ready");
        });
    }

    send(msg: any): void {
        this.socket.emit("msg", msg);
    }
}