/**
 * Created by Khalil on 2015-10-11.
 */

//Initialize Variables
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

//Start server
server.listen(3000, function () {
    console.log('Server listening at port ', 3000);
});

//Make public directory routable
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules/socket.io/lib'));

io.on('connection', function (socket) {
    var address = socket.handshake.address;
    console.log('New connection from ' + address.address + ':' + address.port);

    //Do something when the client connects

    socket.on('disconnect', function () {
        console.log("socket disconnected");
    });
});