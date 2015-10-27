$(document).ready(function () {
    //Initial Things
    updateSongTotal();

    //Search Parameters
    var searchType;
    $('.search-song').click(function () {
        $('#myModalLabel').text("Search Song");
        searchType = "songsearch";
    });
    
    $('.search-artist').click(function () {
        $('#myModalLabel').text("Search Artist");
        searchType = "artistsearch";
    });
    
    $('.search-album').click(function () {
        $('#myModalLabel').text("Search Album");
        searchType = "albumsearch";
    });

    //Close the navbar when it is clicked
    $('.collapse-buttons').click(function (event) {
        var toggle = $(".navbar-toggle").is(":visible");
        if (toggle) {
            $(".navbar-collapse").collapse('hide');
        }
    });
});

//AJAX PAGE LOADING
    function loadPage(page){
        //Get the DOM object of the drawing section of the page
        var allContent = document.getElementById("bodyContent");

        //On every page load, check for library length changes
        updateSongTotal();

        //Clear the content currently on the page
        $(allContent).empty();

        if(page === 'library'){
            var toolbar = "<ul class='nav nav-pills' role='tablist'>";
            toolbar += "<li id='addMusic' role='presentation' style='background-color: #333; line-height: 1.42857143; border-radius:3px;'>";
            toolbar += "<a data-toggle='modal' data-target='#addMusicForm' href='javascript:void(0);'>Add Music</a></li>";
            toolbar += "</ul><div style='margin-bottom:10px;'></div>";
            $('#bodyContent').append(toolbar);

            //Turn on Loader
            $('#spinner').css("visibility", "visible");

        $.get("library").done(function( data ) {
                createTable(JSON.parse(data));

            });
            //[{"TRACKID":1,"SONG":"Albatross","ALBUM":"Metal Box","ARTIST":"Public Image Ltd","YEAR":1979, "DATE_IMPORTED":"Mon Oct 19 2015 20:47:38","TRACK_NO":1,"FILE_LOCATION":"C:/Users/Khalil/Desktop/trolling/Metal Box/01 Albatross.mp3"},
            //    {"TRACKID":2,"SONG":"Memories","ALBUM":"Metal Box","ARTIST":"Public Image Ltd","YEAR":1979,"DATE_IMPORTED":"Mon Oct 19 2015 20:47:38","TRACK_NO":2,"FILE_LOCATION":"C:/Users/Khalil/Desktop/trolling/Metal Box/02 Memories.mp3"},{"TRACKID":3,"SONG":"Swan Lake","ALBUM":"Metal Box","ARTIST":"Public Image Ltd","YEAR":1979,"DATE_IMPORTED":"Mon Oct 19 2015 20:47:38","TRACK_NO":3,"FILE_LOCATION":"C:/Users/Khalil/Desktop/trolling/Metal Box/03 Swan Lake.mp3"},
            //    {"TRACKID":4,"SONG":"Poptones","ALBUM":"Metal Box","ARTIST":"Public Image Ltd","YEAR":1979,"DATE_IMPORTED":"Mon Oct 19 2015 20:47:38","TRACK_NO":4,"FILE_LOCATION":"C:/Users/Khalil/Desktop/trolling/Metal Box/04 Poptones.mp3"},{"TRACKID":5,"SONG":"Careering","ALBUM":"Metal Box","ARTIST":"Public Image Ltd","YEAR":1979,"DATE_IMPORTED":"Mon Oct 19 2015 20:47:38","TRACK_NO":5,"FILE_LOCATION":"C:/Users/Khalil/Desktop/trolling/Metal Box/05 Careering.mp3"},{"TRACKID":6,"SONG":"No Birds","ALBUM":"Metal Box","ARTIST":"Public Image Ltd","YEAR":1979,"DATE_IMPORTED":"Mon Oct 19 2015 20:47:38","TRACK_NO":6,"FILE_LOCATION":"C:/Users/Khalil/Desktop/trolling/Metal Box/06 No Birds.mp3"},{"TRACKID":7,"SONG":"Graveyard","ALBUM":"Metal Box","ARTIST":"Public Image Ltd","YEAR":1979,"DATE_IMPORTED":"Mon Oct 19 2015 20:47:38","TRACK_NO":7,"FILE_LOCATION":"C:/Users/Khalil/Desktop/trolling/Metal Box/07 Graveyard.mp3"},{"TRACKID":8,"SONG":"The Suit","ALBUM":"Metal Box","ARTIST":"Public Image Ltd","YEAR":1979,"DATE_IMPORTED":"Mon Oct 19 2015 20:47:38","TRACK_NO":8,"FILE_LOCATION":"C:/Users/Khalil/Desktop/trolling/Metal Box/08 The Suit.mp3"},{"TRACKID":9,"SONG":"Bad Baby","ALBUM":"Metal Box","ARTIST":"Public Image Ltd","YEAR":1979,"DATE_IMPORTED":"Mon Oct 19 2015 20:47:38","TRACK_NO":9,"FILE_LOCATION":"C:/Users/Khalil/Desktop/trolling/Metal Box/09 Bad Baby.mp3"},{"TRACKID":10,"SONG":"Socialist","ALBUM":"Metal Box","ARTIST":"Public Image Ltd","YEAR":1979,"DATE_IMPORTED":"Mon Oct 19 2015 20:47:38","TRACK_NO":10,"FILE_LOCATION":"C:/Users/Khalil/Desktop/trolling/Metal Box/10 Socialist.mp3"},{"TRACKID":11,"SONG":"Chant","ALBUM":"Metal Box","ARTIST":"Public Image Ltd","YEAR":1979,"DATE_IMPORTED":"Mon Oct 19 2015 20:47:38","TRACK_NO":11,"FILE_LOCATION":"C:/Users/Khalil/Desktop/trolling/Metal Box/11 Chant.mp3"},{"TRACKID":12,"SONG":"Radio 4","ALBUM":"Metal Box","ARTIST":"Public Image Ltd","YEAR":1979,"DATE_IMPORTED":"Mon Oct 19 2015 20:47:38","TRACK_NO":12,"FILE_LOCATION":"C:/Users/Khalil/Desktop/trolling/Metal Box/12 Radio 4.mp3"}]
            //
        function createTable(tabledata){
            //CREATE THE LIBRARY TABLE
            var html = "<table id='tracklist-table'><tr class='track-row'><th>Song</th><th>Artist</th><th>Album</th><th>Year</th></tr>";
                html += "<tbody>";
            $.each(tabledata, function(key, value){
                html += "<tr class='track-row' onclick='songSelect(this," + value.TRACKID + ");' data-track-key='" + value.TRACKID + "'>";
                html += "<td class='name-time'><div class='play-track' style='cursor: pointer;'></div>" + value.SONG + "</td>";
                html += "<td>" + value.ARTIST + "</td>";
                html += "<td>" + value.ALBUM + "</td>";
                html += "<td>" + value.YEAR + "</td></tr>";
            });
            html += "</tbody>";

            //Put the table on the screen
            $('#bodyContent').append(html);

            //Reset Loader
            $("#spinner").fadeOut(500);
            resetLoader(500);
        }
        } else if(page === 'index'){
            $.ajax({
                url : "index",
                dataType: "text",
                success : function (data) {
                    $('#bodyContent').append(data);
                }
            });
            resetLoader(0);
        }
        function resetLoader(timeout){
            setTimeout(function() {
                $('#spinner').css("visibility", "hidden");
                $('#spinner').css("display", "");
            },timeout);
        }
}

function updateSongTotal(){
    $.ajax({
        url : "songsTotal",
        dataType: "json",
        success : function (numberOfSongs) {
            var parsedObj = JSON.parse(numberOfSongs);
            var value;
            for(var key in parsedObj) {
                value = parsedObj[key];
            }
            value = JSON.stringify(value);
            $('#librarySongCount').text(value.substring((value.indexOf(':') + 1), value.length - 1));
        }
    });
}

function readID3Tags(){
    //http://stackoverflow.com/questions/20212560/read-id3-v2-4-tags-with-native-chrome-javascript-filereader-dataview?lq=1
    //http://ericbidelman.tumblr.com/post/8343485440/reading-mp3-id3-tags-in-javascript
}

/* Function: songSelect
 * Purpose: Perform the steps to find the location for a selected song, and request it to be streamed.
 */

var songSelection = "None";
//
//function songSelect(rowElement, key){
//    if(songSelection === rowElement){   //double click
//        console.log("Play this song " + key);
//        //do song logic
//        $.get('stream?key=' + key).done(function(data) {
//
//        });
//        //reset
//        $(rowElement).children().css('background-color', '#222222');
//        songSelection = "None";
//
//    } else if((songSelection !== rowElement) && (songSelection === 'None')){ //First select
//        $(rowElement).children().css('background-color', 'blue');
//        songSelection = rowElement;
//    } else { //select a different song
//        $(songSelection).children().css('background-color', '#222222');
//        $(rowElement).children().css('background-color', 'blue');
//        songSelection = rowElement;
//    }
//}