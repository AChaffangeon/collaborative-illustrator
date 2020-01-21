const server = require('http').createServer();
const { Server } = require('ws');

const wss = new Server({ server });

let rooms = {}
roomsNb = 0;
let signalingChannels = {}
signalingChannelsNb = 0;

wss.on('connection', (client) => {
    client.on('message', (message) => {
        let msg = JSON.parse(message);
        if (msg.id === "newRoom") {
            newRoom(client);
        } else if (msg.id === "joinRoom") {
            joinRoom(msg.data, client);
        } else if (msg.id === "msg") {
            relayMsg(msg.data, client);
        } else if (msg.id === "closeSC") {
            closeSC(msg.data);
        }
    })
});

function newRoom(client) {
    roomsNb += 1;
    let room = `room-${roomsNb}`;
    rooms[room] = [client];
    sendToClient(client, 
        "roomCreated", 
        {roomId: room});

    client.on('close', () => {
        rooms[room] = rooms[room].filter((val, i, a) => { return val !== client });
    });
}

function joinRoom(msg, client) {
    let room = msg.roomId;

    if(!rooms.hasOwnProperty(room)){
        sendToClient(client, "roomJoined", {status: 404});
        return;
    }

    rooms[room].forEach((c) => {
        signalingChannelsNb += 1;
        let signalingChannel = `sc-${signalingChannelsNb}`;
        signalingChannels[signalingChannel] = [c, client];

        sendToClient(c, 
            "newPeer", 
            {signalingChannel: signalingChannel});
        sendToClient(client, 
            "connectToPeer", 
            {signalingChannel: signalingChannel});
    })
    rooms[room].push(client);
    sendToClient(client, "roomJoined", {status: 200});
    client.on('close', () => {
        rooms[room] = rooms[room].filter((val, i, a) => { return val !== client });
    });
}

function relayMsg(msg, client){
    let signalingChannel = msg.signalingChannel;
    if (signalingChannels[signalingChannel] === undefined) {
        return;
    }
    signalingChannels[signalingChannel]
        .forEach((c) => {
            if(c !== client) {
                sendToClient(c, "msg", msg);
            }
        })
}

function closeSC(msg){
    let sc = msg.signalingChannel;
    if (signalingChannels.hasOwnProperty(sc)) {
        delete signalingChannels[sc];
    }
}

function sendToClient(client, id, msg) {
    client.send(JSON.stringify({id: id, data: msg}));
}

server.listen(3000);