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
            $('#bodyContent').append("<table class='table' id='table'><thead></thead></table>");

            //Turn on Loader
            $('#spinner').css("visibility", "visible");

        $.get( "library").done(function( data ) {
                createTable(JSON.parse(data));
            });

        function createTable(response){
            $('#table').bootstrapTable({
                columns: [{
                    field: 'TRACKID',
                    title: 'Track Id'
                }, {
                    field: 'ALBUM',
                    title: 'Album'
                }, {
                    field: 'SONG',
                    title: 'Song'
                }, {
                    field: 'ARTIST',
                    title: 'Artist'
                }],
                data: response
            });

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