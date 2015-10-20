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
var async = require('async');

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
    filesystem.createReadStream('./public/src/index.txt').pipe(res);
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

//GET Total Number of Songs
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

/* addMultipleSongs - This function takes a directory of songs as a parameter, then gets information
 *      about each song before throwing it into an insert statement and running it against the database.
 *
 * IMPORTANT: This function implements the async method: eachSeries which does not run the single iterations in parallel, but in serial.
 * async.eachSeries(array of items to iterate over, iterator function to perform on each item, an optional callback that is performed
 * when all items have been iterated over OR when the callback() throws an error like callback(new Error()).
 */

function addMultipleSongs(dirOfSongs) {
    var insertCommand = "INSERT INTO MYLIBRARY (TRACKID,SONG,ALBUM,ARTIST,YEAR,DATE_IMPORTED,TRACK_NO,FILE_LOCATION) VALUES ";
    var TRACK_ID = config.configReader.database.id_increment_count;
    var absCount = 1;

    _getAllFilesFromFolder(dirOfSongs, function parseArray(absFilesArray) {
        async.eachSeries(absFilesArray, function getID3ForEach(inputAudioFileLocation, callback) {
            id3({file: inputAudioFileLocation, type: id3.OPEN_LOCAL}, function (err, tags) {
                if (err) {
                    console.log("Could not get id3 tags for: " + inputAudioFileLocation);
                } else {
                    //We want to create a database INSERT
                    var title = tags.title;
                    var artist = tags.artist;
                    var album = tags.album;
                    var year = tags.year;
                    var trackNo = tags.v1.track;

                    if(typeof title === undefined) title = "";
                    if(typeof artist === undefined) artist = "";
                    if(typeof album === undefined) album = "";
                    if(typeof year === undefined) year = "";
                    if(typeof trackNo === undefined) trackNo = "";

                    var date = new Date().toString();
                    var inputDate = date.substring(0, date.lastIndexOf(":") + 3);
                    var value = "(" + TRACK_ID + ", '" + title + "', '" + album + "', '" + artist + "', " + year + ", '" + inputDate + "', " + trackNo + ", '" + inputAudioFileLocation + "')";
                    if(absCount < absFilesArray.length){
                        value += ", ";
                    }
                    console.log(value);
                    insertCommand += value;
                    absCount++;
                    TRACK_ID++;
                    callback(); //required for async library
                }
            });
        }, function insert (err) {
                if (err) { throw err; }
                database.insertToDB(insertCommand);
                config.configWriter.set('database:id_increment_count', TRACK_ID);
                config.configWriter.save(function(err){
                    if(err) console.log("Could not write to config file");
                    else console.log("Wrote changes to config file");
                });
            }
        );
    });
}

//TEST
//addMultipleSongs("C:/Users/Khalil/Desktop/trolling/Metal Box");

/* Recursively finds all of the files from a directory
 * @return: Array of absolute file paths.
 */

function _getAllFilesFromFolder(dir, fn) {
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
    fn(results);
}
