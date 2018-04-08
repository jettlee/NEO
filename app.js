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
app.use('/images/favicon.ico', express.favicon(__dirname + '/images/favicon.ico'));

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname + '/views/index.html'));
});


server.listen(8080, function(){
    console.log("server running on port 8080...");
});


var particles = [];
var pMaterials = [];

// Add the WebSocket handlers
io.on('connection', function(socket) {
    socket.on('add', function(data){
        particles.push(data.particle);
        pMaterials.push(data.pMaterial);
        console.log(particles.length);
        io.sockets.emit('planet', data);
    });
});


// setInterval(function() {
//     io.sockets.emit('planets', planets);
// }, 2000);
