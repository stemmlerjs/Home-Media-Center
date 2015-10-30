/**
 * Created by Khalil on 2015-10-13.
 */
    //Start a socket (connect)
    var socket = io('http://localhost:3000');
    var songSelection = "None";
    var audioCtx = new (window.AudioContext || window.webkitAudioContext || window.oAudioContent || window.msAudioContext)();
    var source;
    var nowPlaying = document.querySelector("#currentSongInfo");
    var playButton = document.querySelector("#playPause");
    var loadingText = document.querySelector("#loading-text");
    var SONG_IS_LOADING = false;

    var globalBuffer;               //Buffer that gets updated with the last song loaded from server
    var currentSong;
    var currentArtist;
    var currentAlbum;
    var currentAlbumArtwork;

/********************************************************************************************************************/
/*********************************************** SOCKET EVENT HANDLING **********************************************/

    socket.on('message', function(inMessage){
       alert(inMessage.user + " send a message saying " + inMessage.text);
    });

    socket.on('trackInfo', function(trackInfo){
        console.log("received: something-----" + JSON.stringify(trackInfo.album_artwork));

        setAlbumArtwork(trackInfo);
        console.log(trackInfo);
        currentSong = trackInfo.song;
        currentArtist = trackInfo.artist;
        currentAlbum = trackInfo.album;

        nowPlaying.innerHTML = '"' + currentSong + " by " + currentArtist + '"';
    });

/********************************************************************************************************************/
/*********************************************** AUDIO CONTROLS  **********************************************/

    var playStatus = 'stopped';
    $(".track-play-pause").click(function() {
        if (playStatus === 'playing') {
            audioCtx.suspend().then(function () {
                playStatus = 'stopped';
                $("#playPause").toggleClass('glyphicon-pause glyphicon-play');
            });
        } else if (playStatus === 'stopped') {
            audioCtx.resume().then(function () {
                playStatus = 'playing';
                $("#playPause").toggleClass('glyphicon-play glyphicon-pause');
            });
        }
    });

    //TRACK BACK
    $(".track-back").click(function(){
        source.stop();
        playFromBeginning(globalBuffer);
    });

/********************************************************************************************************************/
/*********************************************** FUNCTIONS **********************************************/

    function songSelect(rowElement, key){
        if(songSelection === rowElement){   //double click
            console.log("Play this song " + key);

            //Start streaming/playing song
            var songReq = 'stream?key=' + key;
            loadSong(songReq, function(){
                source.start(0);
                playStatus = 'playing';
                $("#playPause").toggleClass('glyphicon-pause glyphicon-pause');
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
function loadSong(songReq, callback) {
    if(source !== undefined) {
        source.stop();
    }
    source = audioCtx.createBufferSource();
    var request = new XMLHttpRequest();
    request.open('GET', songReq, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
        var audioData = request.response;
        audioCtx.decodeAudioData(audioData, function(buffer) {
                //Song starts playing now
                $('#footer').fadeOut("slow", function(){
                    $('#footer').css("display", "");
                    $('#footer').css("visibility", "hidden");
                });
                SONG_IS_LOADING = false;
                globalBuffer = buffer;
                source.buffer = buffer;
                source.connect(audioCtx.destination);
                source.loop = true;
            },
            function(e){"Error with decoding audio data" + e.err});
    };
    request.send();
    loadProcess();
    callback();
}

function playFromBeginning(buffer) {
    source = audioCtx.createBufferSource();    // creates a sound source
    source.buffer = buffer;                    // tell the source which sound to play
    source.connect(audioCtx.destination);       // connect the source to the context's destination (the speakers)
    source.start(0);                           // play the source now
                                               // note: on older systems, may have to use deprecated noteOn(time);
}

//Set Cookie
function setCookie(key, value) {
    var expires = new Date();
    expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
    document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
}

//Get Cookie
function getCookie(key) {
    var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    return keyValue ? keyValue[2] : null;
}

function songLoadingAnimation(){
    var loadingText = "Loading";
    if(SONG_IS_LOADING){
        console.log(loadingText);
        setTimeout(songLoadingAnimation, 1000);
    } else {
        console.log("Loaded");
    }
}

function loadProcess(){
    $('#footer').css('visibility', 'visible');
    loadingText.innerHTML = "Loading...";
    SONG_IS_LOADING = true;
    songLoadingAnimation();
}

function setAlbumArtwork(trackInfo){
    var arrayBuffer = trackInfo.album_artwork.data;
    var mimetype = trackInfo.album_artwork.mime;
    var bytes = new Uint8Array(arrayBuffer);
    var blob = new Blob([bytes], {'type': mimetype});
    var url = URL.createObjectURL(blob); //different prefixes for different vendors
    var image = document.getElementById('album-artwork');
    image.src = url;
}

/*************************************************************************************************************/
/*********************************************** TEST FUNCTIONS **********************************************/
/************** (All functions are to start here before they are moved into their appropriate section) *******/



