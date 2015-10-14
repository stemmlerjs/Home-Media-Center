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
        var allContent = document.getElementById("bodyContent");
        $(allContent).empty();
        
    $('#bodyContent').load(page);
}