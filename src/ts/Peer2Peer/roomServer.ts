export class RoomServer {
    msgHandlers: Record<string, ((data: any) => void)[]>;
    ws: WebSocket;

    constructor() {
        this.ws = new WebSocket('wss://collaborative-illustrator.herokuapp.com/');
        this.msgHandlers = { };
        this.keepAlive();
        this.ws.onopen = () => { console.log("Connected to room server"); };
        this.ws.onmessage = (msg) => { this.onMsg(msg.data); };
    }

    keepAlive(): void {
        let timeout = 20000;
        let server = this.ws;
        let ping = () => {
            if (server.readyState === server.OPEN) {
                server.send(JSON.stringify({ id: "ping" }));
            }
            setTimeout(ping, timeout);
        };
        ping();
    }

    register(msgId: string, f: (data: any) => void): void {
        if (!this.msgHandlers.hasOwnProperty(msgId)) {
            this.msgHandlers[msgId] = [];
        }

        this.msgHandlers[msgId].push(f);
    }

    emit(id: string, msg: any): void {
        this.ws.send(JSON.stringify({ id: id, data: msg}));
    }

    onMsg(message: string): void {
        let msg = JSON.parse(message);
        if (!this.msgHandlers.hasOwnProperty(msg.id)) {
            return;
        }
        this.msgHandlers[msg.id].forEach((f) => f(msg.data));
    }
}