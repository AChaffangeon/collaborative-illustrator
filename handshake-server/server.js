const server = require('http').createServer();
const { Server } = require('ws');

const wss = new Server({ server });
const PORT = process.env.PORT || 3000;

let rooms = {}
let roomsNb = 0;
let signalingChannels = {}
let signalingChannelsNb = 0;
let userNb = 0;

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
    userNb += 1;
    let userId = `U_${userNb}`;

    rooms[room] = [{id: userId, client: client}];
    sendToClient(client, 
        "roomCreated", 
        {roomId: room, userId: userId});

    client.on('close', () => {
        rooms[room] = rooms[room].filter((val, i, a) => { return val.id !== userId });
    });
}

function joinRoom(msg, client) {
    let room = msg.roomId;
    userNb += 1;
    let userId = `U_${userNb}`;

    if(!rooms.hasOwnProperty(room)){
        sendToClient(client, "roomJoined", {status: 404});
        return;
    }

    rooms[room].forEach((user) => {
        signalingChannelsNb += 1;
        let signalingChannel = `sc-${signalingChannelsNb}`;
        signalingChannels[signalingChannel] = [user.client, client];
        sendToClient(user.client, 
            "newPeer", 
            {signalingChannel: signalingChannel, userId: userId});
        sendToClient(client, 
            "connectToPeer", 
            {signalingChannel: signalingChannel, userId: user.id});
    })

    rooms[room].push({id: userId, client: client});
    sendToClient(client, "roomJoined", { status: 200, userId: userId });

    client.on('close', () => {
        rooms[room] = rooms[room].filter((val, i, a) => { return val.id !== userId });
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

server.listen(PORT);