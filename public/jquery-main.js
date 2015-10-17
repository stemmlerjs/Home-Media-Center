$(document).ready(function () {

    //Search Parameters
    var searchType;
    $('.search-song').click(function () {
        console.log("Search parameter asked for");
        $('#myModalLabel').text("Search Song");
        searchType = "songsearch";
    });
    
    $('.search-artist').click(function () {
         console.log("Search parameter asked for");
        $('#myModalLabel').text("Search Artist");
        searchType = "artistsearch";
    });
    
    $('.search-album').click(function () {
         console.log("Search parameter asked for");
        $('#myModalLabel').text("Search Album");
        searchType = "albumsearch";
    });
    
});

//AJAX PAGE LOADING
    function loadPage(page){
        //Get the DOM object of the drawing section of the page
        var allContent = document.getElementById("bodyContent");

        //Clear the content currently on the page
        $(allContent).empty();

        if(page === 'library'){
        allContent.innerHTML = "<table id='table' data-toggle='table' data-cache='false' data-height='299'><thead></thead></table>";

        $.get( "library").done(function( data ) {
                createTable(JSON.parse(data));
            });

        function createTable(response){
            console.log(typeof response);
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
        }
        } else if(page === 'index'){
            $.ajax({
                url : "index",
                dataType: "text",
                success : function (data) {
                    allContent.html(data);
                }
            });
        }

        //Repopulate the page with new data
   // $('#bodyContent').load(page);
}