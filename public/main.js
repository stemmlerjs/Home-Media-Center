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

    var nextKey = "";
    var prevKey = "";
    var rowSelection;

    var _currentAudioPosition = 0;
    var _interval;

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

    socket.on('setNextPrev', function(nextPrevInfo){
        nextSongKey = nextPrevInfo.nextKey;
        prevSongKey = nextPrevInfo.prevKey;
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
        _currentAudioPosition = 0;
        playFromBeginning(globalBuffer);
    });

    //TRACK Forward
    $(".track-forward").click(function(){
        if((nextKey !== "") && (nextKey !== undefined) && (rowSelection !== undefined)){
            //Stop timer
            _stopTimer();

            //Start streaming/playing song
            var songReq = 'stream?key=' + nextKey;
            loadSong(songReq, function(){
                source.start(0);
                playStatus = 'playing';
                $("#playPause").toggleClass('glyphicon-pause glyphicon-pause');
            });

            //Update Now Playing Content
            socket.emit('getTrackInfo', {
                key: nextKey
            });

            //Set Next / Prev songs
            getNextPrev(rowSelection);

            //reset
            $(rowSelection).children().css('background-color', '#222222');
            songSelection = "None";
        }
    });

/********************************************************************************************************************/
/*********************************************** FUNCTIONS **********************************************/

    function songSelect(rowElement, key){
        rowSelection = rowElement;
        if(songSelection === rowElement){   //double click
            _stopTimer();
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

            //Set Next / Prev songs
            getNextPrev(rowElement);

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
                startTrackingAudioPosition();
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
    getNextPrev(rowSelection);
    songLoadingAnimation();
}

function setAlbumArtwork(trackInfo){
    var arrayBuffer = trackInfo.album_artwork.data;
    var mimetype = trackInfo.album_artwork.mime;
    var bytes = new Uint8Array(arrayBuffer);
    var blob = new Blob([bytes], {'type': mimetype});
    var url = URL.createObjectURL(blob); //different prefixes for different vendors
    var image = document.getElementById('small-album-artwork');
    image.src = url;
}

function getNextPrev(rowElement){
    nextKey = $(rowElement).next().attr('data-track-key');
    prevKey = $(rowElement).prev().attr('data-track-key');
}

/*************************************************************************************************************/
/*********************************************** TEST FUNCTIONS **********************************************/
/************** (All functions are to start here before they are moved into their appropriate section) *******/



var startTrackingAudioPosition = function() {
    _currentAudioPosition = 0;
    _interval = setInterval(_timer, 10);
};

var _timer = function(){
    if(audioCtx.state === 'running'){
        _currentAudioPosition += 0.10;
        //$('.progress-bar').attr("style", "width:" + audioCtx.duration / _currentAudioPosition + "%");
        console.log("Current Time - " + (_currentAudioPosition / 10) + " -  : Length - " + source.buffer.duration);
    }

    if((_currentAudioPosition / 10) >= source.buffer.duration){
        console.log("NEXT SONG!!");
        _stopTimer();
        loadNextTrack();
    }
};

    var _stopTimer = function(){
        _currentAudioPosition = 0;
        if (_interval) {
            clearInterval(_interval);
            _interval = null;
        }
    };

var loadNextTrack = function(){
    if((nextKey !== "") && (nextKey !== undefined)){
        //Start streaming/playing song
        var songReq = 'stream?key=' + nextKey;
        loadSong(songReq, function(){
            source.start(0);
            playStatus = 'playing';
            $("#playPause").toggleClass('glyphicon-pause glyphicon-pause');
        });

        //Update Now Playing Content
        socket.emit('getTrackInfo', {
            key: nextKey
        });

        //Set Next / Prev songs
        getNextPrev(rowElement);

        //reset
        $(rowElement).children().css('background-color', '#222222');
        songSelection = "None";
    }
};

//Current Issue
/**
 * rowSelection = rowElement;
 * rowSelection is not globally updated after it moves to the next song automatically, so when it goes to play another
 * song after it automatically finishes, it just repeats the LAST song.
 *
 * This should be easy to fix, just move things around and make methods clear and simple
 */



