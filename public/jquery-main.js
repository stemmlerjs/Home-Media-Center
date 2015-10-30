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

/********************************************************************************************************************/
/*********************************************** AJAX PAGE BUILDING **********************************************/
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
    //TEMP - Build Large media player to display Album Artwork
            html += "<img id='album-artwork' src=''>";

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