var express = require("express");
var path = require('path');
var socketIO = require('socket.io');
var http = require('http');

var app = express();
var server = http.Server(app);
var io = socketIO(server, {transports: ['websocket']});


//app.set("view engine", "ejs");
app.use('/clouds/backgrounds', express.static(__dirname + '/clouds/backgrounds'));
app.use('/sound', express.static(__dirname + '/sound'));
app.use('/data', express.static(__dirname + '/data'));
app.use('/images', express.static(__dirname + '/images'));
app.use('/src', express.static(__dirname + '/src'));
app.use('/src/bootstrap/css', express.static(__dirname + '/src/bootstrap/css'));
app.use('/src/THREE-plugins', express.static(__dirname + '/src/THREE-plugins'));

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname + '/views/index.html'));
});


server.listen(8080, function(){
    console.log("server running on port 8080...");
});

var players = {};

// Add the WebSocket handlers
io.on('connection', function(socket) {
    socket.on('new player', function(){
        players[socket.id] = {
            energy: 100,
            darkPower: 100
        };
        console.log("a new player connecting..., " + "player id: " + socket.id + ", current player number: " + Object.keys(players).length);
        console.log(players);
    });

    socket.on('add', function(data){
        console.log(socket.id);
        players[socket.id].energy -= 10;
        console.log("player id: " + socket.id + " exploring..." + " consuming energy 10, and remaining energy: " + players[socket.id].energy + " darkPower: " + players[socket.id].darkPower);
        io.sockets.emit('planet', data);
    });
});
