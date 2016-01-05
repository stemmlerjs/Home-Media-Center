var Listener = function(socket){
    this.id = socket.id;
    this.name = "random";
    this.status = 'INITIALIZED';
    this.pushed = false;
    this.currenttrack = {
        key: "",
        song: "",
        artist: "",
        album: "",
        artwork: {},
        time_elapsed: "",
        completed_percentage: ""
    }
};

Listener.prototype.STATUS_INITIALIZED = "INITIALIZED";
Listener.prototype.STATUS_PLAYING = "PLAYING";
Listener.prototype.STATUS_PAUSED = "PAUSED";
Listener.prototype.STATUS_DISCONNECTED = "DISCONNECTED";

Listener.prototype.getName = function(){
    return this.name;
};

Listener.prototype.setName = function(name){
    this.name = name;
};

Listener.prototype.getCurrentTrack = function(){
    return this.currenttrack;
};

Listener.prototype.setCurrentTrack = function(currenttrack){
    this.currenttrack = currenttrack;
};

Listener.prototype.setPushed = function(){
    this.pushed = true;
};

Listener.prototype.setStatus = function(status){
    this.status = status;
};

Listener.prototype.setTimeElapsed = function(time){
    this.currenttrack.time_elapsed = time;
};

Listener.prototype.setCompletedPercentage = function(complete){
    this.currenttrack.completed_percentage = complete;
};

module.exports = Listener;