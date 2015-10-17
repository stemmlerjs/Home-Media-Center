/**
 * Created by Khalil on 2015-10-11.
 */

//Initialize Variables
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var flow = require('nimble');
var fs = require('fs');

//Initialize database
var database = require('./app_modules/database/database.js');

//Start server
server.listen(3000, function () {
    console.log('Server listening at port ', 3000);
});

//Make public directory routable
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules/socket.io/lib'));

//BUILD LIBRARY PAGE
app.get('/library', function(req, res){
    var JSON_ARRAY;
    flow.series([
        //GET ARRAY FROM DB
        function(callback){
            setTimeout(function() {
                JSON_ARRAY = database.getLibrary();
                callback();
            },300);
    },
        //PASS BACK AS JSON
        function(callback){
            setTimeout(function() {
                app.set('json spaces', 40);
                res.json(JSON.stringify(JSON_ARRAY));
                callback();
            },350);
        }
    ]);
});

//BUILD MAIN PAGE
app.get('/index', function(req, res){
    res.write('./public/index.txt');

});

io.on('connection', function (socket) {
    var address = socket.handshake.address;
    console.log('New connection from ');

    //Do something when the client connects
    socket.on('disconnect', function () {
        console.log("socket disconnected");
        socket.disconnect();
    });
});
