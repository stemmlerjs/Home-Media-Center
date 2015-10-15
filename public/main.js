/**
 * Created by Khalil on 2015-10-13.
 */
$(function() {
    //Start a socket (connect)
    var socket = io('http://localhost:3000');


    socket.on('message', function(inMessage){
       alert(inMessage.user + " send a message saying " + inMessage.text);
    });

});