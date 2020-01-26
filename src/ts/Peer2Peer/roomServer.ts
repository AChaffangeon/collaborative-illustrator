/** A class to represent the room server. */
export class RoomServer {
    /** Handlers for message from the room server. */
    msgHandlers: Record<string, ((data: any) => void)[]>;
    /** Websocket that represent the room server. */
    ws: WebSocket;

    constructor() {
        this.ws = new WebSocket('wss://collaborative-illustrator.herokuapp.com/');
        this.msgHandlers = { };
        this.keepAlive();
        this.ws.onopen = () => { console.log("Connected to room server"); };
        this.ws.onmessage = (msg) => { this.onMsg(msg.data); };
    }

    /**
     * Keeps the connection to the room server alive.
     */
    private keepAlive(): void {
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

    /**
     * Registers a handler for a type of message from the room server.
     * @param msgId Type of message.
     * @param f Handler.
     */
    register(msgId: string, f: (data: any) => void): void {
        if (!this.msgHandlers.hasOwnProperty(msgId)) {
            this.msgHandlers[msgId] = [];
        }

        this.msgHandlers[msgId].push(f);
    }

    /**
     * Emits a message to the room server.
     * @param id Type of message.
     * @param msg Message to send.
     */
    emit(id: string, msg: any): void {
        this.ws.send(JSON.stringify({ id: id, data: msg}));
    }

    /**
     * Dispatchs messages received from the room server to the corresponding handlers.
     * @param message 
     * @returns msg 
     */
    onMsg(message: string): void {
        let msg = JSON.parse(message);
        if (!this.msgHandlers.hasOwnProperty(msg.id)) {
            return;
        }
        this.msgHandlers[msg.id].forEach((f) => f(msg.data));
    }
}
