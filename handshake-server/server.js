const server = require('http').createServer();
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    console.log('addr: ' + add);
})
const io = require('socket.io')(server);

let rooms = {}
roomsNb = 0;
let signalingChannels = {}
signalingChannelsNb = 0;

io.on('connection', client => {
    client.on("newRoom", () => newRoom(client));
    client.on("joinRoom", (msg) => joinRoom(msg, client));
    client.on("msg", (msg) => sendMsg(msg, client));
    client.on("closeSC", (msg) => closeSC(msg))
});

function newRoom(client) {
    roomsNb += 1;
    let room = `room-${roomsNb}`;
    rooms[room] = [client];
    client.emit("roomCreated", {roomId: room})

    client.on('disconnect', () => {
        rooms[room] = rooms[room].filter((val, i, a) => { return val !== client });
    });
}

function joinRoom(msg, client) {
    let room = msg.roomId;

    if(!rooms.hasOwnProperty(room)){
        client.emit("roomJoined", {status: 404});
        return;
    }

    rooms[room].forEach((c) => {
        signalingChannelsNb += 1;
        let signalingChannel = `sc-${signalingChannelsNb}`;
        signalingChannels[signalingChannel] = [c, client];

        c.emit("newPeer", {signalingChannel: signalingChannel})
        client.emit("connectToPeer", {signalingChannel: signalingChannel})
    })
    rooms[room].push(client);
    client.emit("roomJoined", {status: 200})
}

function sendMsg(msg, client){
    let signalingChannel = msg.signalingChannel;
    if (signalingChannels[signalingChannel] === undefined) {
        return;
    }
    signalingChannels[signalingChannel]
        .forEach((c) => {
            if(c !== client) {
                c.emit("msg", msg);
            }
        })
}

function closeSC(msg){
    let sc = msg.signalingChannel;
    if (signalingChannels.hasOwnProperty(sc)) {
        console.log("Signaling channel closed: ", sc);
        delete signalingChannels[sc];
    }
}

server.listen(3000);