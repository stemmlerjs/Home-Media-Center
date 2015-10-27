/**
 * Created by Khalil on 2015-10-13.
 */
    //Start a socket (connect)
    var socket = io('http://localhost:3000');
    var songSelection = "None";

    socket.on('message', function(inMessage){
       alert(inMessage.user + " send a message saying " + inMessage.text);
    });


    //http://stackoverflow.com/questions/16932235/play-an-mp3-after-jquery-get
    //https://nodejs.org/api/stream.html
    //http://www.jplayer.org/latest/developer-guide/#jPlayer-server-response
    function songSelect(rowElement, key){
        if(songSelection === rowElement){   //double click
            console.log("Play this song " + key);
            //do song logic
            //$.get('stream?key=' + key).done(function(data) {
            //    console.log(data);
            //});

            $.ajax({
                url : 'stream?key=' + key,
                dataType: "text",
                success : function (fileLocation) {

                }
            });

            //socket.emit('playSong', {
            //    SONG_ID: key
            //});

            //reset
            $(rowElement).children().css('background-color', '#222222');
            songSelection = "None";

        } else if((songSelection !== rowElement) && (songSelection === 'None')){ //First select
            $(rowElement).children().css('background-color', 'blue');
            songSelection = rowElement;
        } else { //select a different song
            $(songSelection).children().css('background-color', '#222222');
            $(rowElement).children().css('background-color', 'blue');
            songSelection = rowElement;
        }
    }





