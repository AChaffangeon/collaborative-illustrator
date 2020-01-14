const server = require('http').createServer();
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    console.log('addr: ' + add);
})
const io = require('socket.io')(server);

let clients = [];

io.on('connection', client => {
    clients.push(client);
    console.log("Client added");
    client.on("msg", (msg) => sendMsg(msg, client));
    client.on('disconnect', () => { 

    });
});

function sendMsg(msg, client){
    console.log("Transmits msg: ", msg)
    clients.forEach((c) => {
        if (c === client) {
            return;
        }

        c.emit("msg", msg);
    })
}

server.listen(3000);