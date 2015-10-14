$(document).ready(function () {
    
    //Cookie Functions
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
    
    //Audio Controls
    $(".audioDemo").trigger('load');
    $(".audioDemo").bind("load",function(){
        $(".alert-success").html("Audio Loaded succesfully");
    });
     
    //PLAY / PAUSE
    var buttonStatus = "stopped";
    $(".track-play-pause").click(function(){
        
        if(buttonStatus === "stopped"){
            $(".audioDemo").trigger('play');
            console.log("playing song");
            buttonStatus = "playing";
            
            //Set cookies
            setCookie("isPlaying", "true");
                      
            $("#playPause").toggleClass('glyphicon-play glyphicon-pause');
            //Notify the server

        } else {
             $(".audioDemo").trigger('pause');
            console.log("pausing song");
            buttonStatus = "stopped";
            
            //Set cookies
            setCookie("isPlaying", "false");
            
            $("#playPause").toggleClass('glyphicon-pause glyphicon-play');
            //Notify the server
            
        }  
    });
    
    //TRACK BACK
     $(".track-back").click(function(){
        console.log("track back");
         var cur_time = $(".audioDemo").currentTime;
          console.log(cur_time);
        $(".audioDemo").prop("currentTime", 0); 
    });
});