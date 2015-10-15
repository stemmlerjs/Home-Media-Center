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
        var newPage;
        var host = "http://" + window.location.host + '/';

        $.ajax({
            // the URL for the request
            url : host,

            // whether this is a POST or GET request
            type : 'GET',

            // the type of data we expect back
            dataType : 'json',

            // code to run if the request succeeds;
            // the response is passed to the function
            success : function(json) {
                $('<h1/>').text(json.title).appendTo('body');
                $('<div class="content"/>')
                    .html(json.html).appendTo('body');
            },

            // code to run if the request fails;
            // the raw request and status codes are
            // passed to the function
            error : function(xhr, status) {
                alert('Sorry, there was a problem!');
            },

            // code to run regardless of success or failure
            complete : function(xhr, status) {
                alert('The request is complete!');
            }
        });

        //Clear the content currently on the page
        $(allContent).empty();

        //Repopulate the page with new data
    $('#bodyContent').load(page);
}