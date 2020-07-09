const http = require('http');
const server = http.createServer();
const port = 4000;

const url = require('url');

const WebSocket = require('ws');
const wss = new WebSocket.Server({
    server,
    // noServer: true,
    clientTracking: true
});

const {uuid} = require('uuidv4');
const { debug } = require('console');

wss.on('connection', function connection(ws, request) {
    ws.binaryType = "arraybuffer";
    console.log(new Date() + ' | A new client has connected')
    ws.id = uuid();
    console.log(new Date() + ' | id: ' + ws.id);
    const buf = new ArrayBuffer(12);
    const view = new Uint16Array(buf);
    view[0] = 0; // 0 = id request
    ws.send(view);


    // const registerObj = {
    //     req: 'register',
    //     message: 'register'
    // }
    // ws.send(JSON.stringify(registerObj));
    
    ws.on('message', data => {
        const view = new Uint16Array(data);
        console.log('id response: ' + view[0]);
        if(view[0] == 0){
            unitySocket = ws;
            // clientMap.addGame(ws);
        }
        if(view[0] == 1){
            webSocket = ws;
            ws.removeEventListener("message");
            ws.on('message', data =>{
                unitySocket.send(data);
            });
        }
        // if (data[0] === 0) {
        //     const id = clientMap.addGame(ws);
            
        // }

        // const view = new Uint16Array(data);
        // console.log(view[0])
        // currentData = view;
        // ws.send(data); // or view?
    });
    // ws.on('close', function (connection) {
    //     console.log(new Date() + ' | Closing a client connection');
    // })
});

// server.on('upgrade', function upgrade(request, socket, head) {
//     console.log( new Date() + ' | Upgrading http connection to wss: url = ' + request.url);
//     var parsedUrl = url.parse(request.url, true, true);
//     const pathname = parsedUrl.pathname;
//     console.log( new Date() + ' | Pathname = ' + pathname);
//     if (pathname === '/') {
//         wss.handleUpgrade(request, socket, head, function done(ws) {
//             wss.emit('connection', ws, request);
//         });
//     } else {
//         socket.destroy();
//     }
// });

server.listen(port, function() {
    console.log(new Date() + ' | Server is listening on port ' + port);
});


let unitySocket = null;

const clientMap = (()=>{
    map = {};
    players = {};
    return {
        addGame: function(ws){
            const id = ws.id
            const newMap = {...map};
            newMap[id] = {screenWebSocket: ws, players: {}};
            map = newMap;
        },
        addPlayer: function(gameId, playerId){
            
        },
        getMap: function(){
            return map;
        }
    }
})();
