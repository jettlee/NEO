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
var vertex = [];
var materials = [];
var defaultNeuroglancerURL = "http://localhost:8080/#!{'layers':{'image':{'type':'image'_'source':'precomputed://gs://neuroglancer/s1_v0.1/image'}_'segmentation_0.2':{'type':'segmentation'_'source':'precomputed://gs://neuroglancer/s1_v0.1/segmentation_0.2'_'chunkedGraph':null_'segments':['5317835'_'9251648']}}_'navigation':{'pose':{'position':{'voxelSize':[6_6_30]_'voxelCoordinates':[6379.88037109375_5254.72705078125_1017.9990234375]}}_'zoomFactor':6}_'perspectiveOrientation':[0_-0.8134157061576843_0_0.5816833972930908]_'perspectiveZoom':665.1416330443624_'showSlices':false}";
var currentNeoroglancerURL = defaultNeuroglancerURL;

// Add the WebSocket handlers
io.on('connection', function(socket) {
    socket.on('new player', function(){
        players[socket.id] = {
            energy: 100,
            darkPower: 100
        };

        planets = {
            vertex: vertex,
            materials: materials
        };

        // send existing planets to a new client
        socket.emit('planets', planets);
        console.log("a new player connecting..., " + "player id: " + socket.id + ", current player number: " + Object.keys(players).length);
        console.log(players);
    });

    socket.on('add', function(data){
        // store new generated planets information into server array
        vertex.push(data.vertex);
        materials.push(data.texturePath);

        players[socket.id].energy -= 10;
        console.log("player id: " + socket.id + " exploring..." + " consuming energy 10, and remaining energy: " + players[socket.id].energy + " darkPower: " + players[socket.id].darkPower);
        io.emit('planet', data);
    });
});

// Keep updating clients' neuroglancer squareUrl
setInterval(function(){
    io.emit('neuroglancerUrl', currentNeoroglancerURL);
}, 1000);
