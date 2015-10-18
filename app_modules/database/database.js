/**
 * Created by Khalil on 2015-10-14.
 */

//Initialize Variables
var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var file = './app_modules/database/mydb.db';
var flow = require('nimble');

//Initialize Database
setupLibrary();
//tempInsert();


//Setup the library
function setupLibrary(){
    var db = new sqlite3.Database(file);
    db.serialize(function () {
    var command = "CREATE TABLE if not exists MYLIBRARY( ";
    command += "TRACKID INT PRIMARY KEY NOT NULL, ";
    command += "SONG    TEXT            NOT NULL, ";
    command += "ALBUM   TEXT, ";
    command += "ARTIST  TEXT            NOT NULL, ";
    command += "YEAR    INT, ";
    command += "DATE_IMPORTED TEXT, ";
    command += "TRACK_LENGTH TEXT, ";
    command += "ALBUM_TRACK_NO INT, ";
    command += "TOTAL_TRACKS_ON_ALBUM INT); ";
    db.run(command);
        console.log("Database initialized");
    });
    db.close();
};

function getLibrary(){
    var db = new sqlite3.Database(file);
    var allRows = [];
        //Return every row
        flow.series([
            function (callback) {
                    setTimeout(function (){
                    db.each("SELECT * FROM MYLIBRARY ORDER BY ALBUM, ALBUM_TRACK_NO ", function(err, row) {
                        if(err) console.log("There was an error");
                         else allRows.push(row);
                    });
                    callback();
                    },100);
            }
        ]);
    //In JS, only Objects (this includes arrays) are pass by reference
    return allRows;
}



//Temporary Insert, demonstrate how to perform inserts
function tempInsert(){
    var db = new sqlite3.Database(file);
    db.serialize(function () {
        //var command = "INSERT INTO MYLIBRARY (TRACKID,SONG,ALBUM,ARTIST,YEAR,DATE_IMPORTED,ALBUM_TRACK_NO) VALUES ('2', 'Shes Hit', 'Junkyard', 'The Birthday Party', 1982, DateTime('now'), 2 ), ";
        //command += "(3, 'Dead Joe', 'Junkyard', 'The Birthday Party', 1982, DateTime('now'), 3 ), ";
        //command += "(4, 'The Dim Locator', 'Junkyard', 'The Birthday Party', 1982, DateTime('now'), 4 ), ";
        //command += "(5, 'Hamlet Pow Pow Pow', 'Junkyard', 'The Birthday Party', 1982, DateTime('now'), 5 ), ";
        //command += "(6, 'Several Sins', 'Junkyard', 'The Birthday Party', 1982, DateTime('now'), 6 ), ";
        //command += "(7, 'Big-Jesus-Trash-Can', 'Junkyard', 'The Birthday Party', 1982, DateTime('now'), 7 ), ";
        //command += "(1, 'Blast Off', 'Junkyard', 'The Birthday Party', 1982, DateTime('now'), 1 ), ";
        //command += "(8, 'Kiss Me Black', 'Junkyard', 'The Birthday Party', 1982, DateTime('now'), 8 ); ";

       //var command = "DROP TABLE LIBRARY ";
       // command += "SELECT 3 As 'TRACKID', 'Dead Joe' As 'SONG', 'Junkyard' As 'ALBUM', 'The Birthday Party' As 'ARTIST', 1982 As 'YEAR', DateTime('now') As 'DATE_IMPORTED', 3 As 'ALBUM_TRACK_NO' ";
       // command += "UNION ALL SELECT 4, 'The Dim Locator', 'Junkyard', 'The Birthday Party', 1982, DateTime('now'), 4 ";
        db.run(command);
    });
    db.close();
}

function getSongsTotal(){
    var db = new sqlite3.Database(file);
    var arr = [];
    db.serialize(function () {
        db.each("SELECT COUNT(*) FROM MYLIBRARY ", function(err, row) {
            if(err) console.log("There was an error");
            else arr.push(row);
        });
    });
    db.close();
    return arr;
}

//*********EXPORTS*************
exports.getLibrary = function() {
    return getLibrary();
};

exports.getSongsTotal = function(){
    return getSongsTotal();
};

