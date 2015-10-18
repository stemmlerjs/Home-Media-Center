/**
 * Created by Khalil on 2015-10-11.
 */

//Initialize Variables
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var flow = require('nimble');
var filesystem = require('fs');
var id3 = require('id3js');
var config = require('./config.js');

//Initialize database
var database = require('./app_modules/database/database.js');

//Start server
server.listen(config.configReader.network.port, function () {
    console.log('Server listening at port ', config.configReader.network.port);
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
    fs.createReadStream('./public/src/index.txt').pipe(res);
});

io.on('connection', function (socket) {
    var address = socket.handshake.address;
    console.log('New connection from ' + address);

    //Do something when the client connects
    socket.on('disconnect', function () {
        console.log("socket disconnected");
        socket.disconnect();
    });
});

//BUILD MAIN PAGE
app.get('/songsTotal', function(req, res){
    var numberOfSongsJSONArr;
    flow.series([
        function(callback){
            setTimeout(function(){
                numberOfSongsJSONArr = database.getSongsTotal();
                callback();
            },30);
        },
        function(callback){
            setTimeout(function(){
                res.json(JSON.stringify(numberOfSongsJSONArr));
                callback();
            },40);
        }
    ]);
});

function addMultipleSongs(dirOfSongs){
    var absFiles = [];
    var insertCommand = "INSERT INTO MYLIBRARY (TRACKID,SONG,ALBUM,ARTIST,YEAR,DATE_IMPORTED,TRACK_LENGTH,ALBUM_TRACK_NO,FILE_LOCATION) VALUES ";
    flow.series([
        function(callback) {
            setTimeout(function() {
                absFiles = _getAllFilesFromFolder(dirOfSongs);
            },500);
            callback();
        },
        function(callback) {
            setTimeout(function() {
                absFiles.forEach(function(inputAudioFileLocation){
                    //Get ID3TAGS
                    id3({ file: inputAudioFileLocation, type: id3.OPEN_LOCAL }, function(err, tags) {
                        if(err){
                            console.log("Could not get id3 tags for: " + inputAudioFileLocation);
                            return null;
                        } else {
                            //Tags are passed as an object in the following format
                            /*
                             {
                             "artist": "Song artist",
                             "title": "Song name",
                             "album": "Song album",
                             "year": "2013",
                             "v1": {
                             "title": "ID3v1 title",
                             "artist": "ID3v1 artist",
                             "album": "ID3v1 album",
                             "year": "ID3v1 year",
                             "comment": "ID3v1 comment",
                             "track": "ID3v1 track (e.g. 02)",
                             "version": 1.0
                             },
                             "v2": {
                             "artist": "ID3v2 artist",
                             "album": "ID3v2 album",
                             "version": [4, 0]
                             }
                             }
                             See documentation at: https://www.npmjs.com/package/id3js
                             */
                            //We want to create a database INSERT
                            console.log(tags);
                            console.log(tags.title);
                            console.log(tags.artist);
                            console.log(tags.album);
                            console.log(tags.year);
                            console.log(tags.v1.track);
                        }
                    });
                });
            }, 500);
            callback();
        }
    ])
}

//TEST
addMultipleSongs("C:/Users/Khalil/Desktop/trolling/Metal Box");


/* Return the ID3 tag for an mp3 at an absolute file location
 * @return: ID3 tag
 */

function getID3tag(inputAudioFileLocation){
    var returnTag;
    id3({ file: inputAudioFileLocation, type: id3.OPEN_LOCAL }, function(err, tags) {
        if(err){
            console.log("Could not get id3 tags for: " + inputAudioFileLocation);
            return null;
        } else {
            //Tags are passed as an object in the following format
            /*
            {
                "artist": "Song artist",
                "title": "Song name",
                "album": "Song album",
                "year": "2013",
                "v1": {
                "title": "ID3v1 title",
                    "artist": "ID3v1 artist",
                    "album": "ID3v1 album",
                    "year": "ID3v1 year",
                    "comment": "ID3v1 comment",
                    "track": "ID3v1 track (e.g. 02)",
                    "version": 1.0
            },
                "v2": {
                "artist": "ID3v2 artist",
                    "album": "ID3v2 album",
                    "version": [4, 0]
            }
            }
            See documentation at: https://www.npmjs.com/package/id3js
            */
            returnTag = tags;
        }
    });
    return returnTag;
};

/* Recursively finds all of the files from a directory
 * @return: Array of absolute file paths.
 */

function _getAllFilesFromFolder(dir) {
    var results = [];

    //Read each file in the current directory
    filesystem.readdirSync(dir).forEach(function(file) {

        file = dir+'/'+file;
        var stat = filesystem.statSync(file);

        if (stat && stat.isDirectory()) {
            results = results.concat(_getAllFilesFromFolder(file));
        } else{
            results.push(file);
        }

    });
    return results;
}

function asyncPrint(obj){
    console.log(obj);
}
