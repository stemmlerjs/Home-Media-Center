/**
 * Created by Khalil on 2015-10-13.
 */
    //Start a socket (connect)
    var socket = io('http://localhost:3000');
    var songSelection = "None";
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var source;
    var nowPlaying = document.querySelector("#currentSongInfo");

    socket.on('message', function(inMessage){
       alert(inMessage.user + " send a message saying " + inMessage.text);
    });

    socket.on('getTrackInfo', function(trackInfo){
        var artist = trackInfo.artist;
        var song = trackInfo.song;
        console.log(song + artist);
        nowPlaying.innerHTML ='"' + song + ' by ' + artist +'"';
    });


    //http://stackoverflow.com/questions/16932235/play-an-mp3-after-jquery-get
    //https://nodejs.org/api/stream.html
    //http://www.jplayer.org/latest/developer-guide/#jPlayer-server-response
    function songSelect(rowElement, key){
        if(songSelection === rowElement){   //double click
            console.log("Play this song " + key);

            //Start streaming/playing song
            var songReq = 'stream?key=' + key;
            streamSong(songReq, function(){
                source.start(0);
            });

            //Update Now Playing Content
            socket.emit('getTrackInfo', {
                key: key
            });

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

//https://github.com/mdn/decode-audio-data/blob/gh-pages/index.html
function streamSong(songReq, callback) {
    source = audioCtx.createBufferSource();
    var request = new XMLHttpRequest();
    request.open('GET', songReq, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
        var audioData = request.response;
        audioCtx.decodeAudioData(audioData, function(buffer) {
                source.buffer = buffer;
                source.connect(audioCtx.destination);
                source.loop = true;
            },
            function(e){"Error with decoding audio data" + e.err});
    };
    request.send();
    callback();
}




