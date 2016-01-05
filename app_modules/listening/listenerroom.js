var ListenerRoom = function(){
    this.listeners = [];
};

ListenerRoom.prototype.addOrUpdateListener = function(listener){
    this.listeners[listener.id] = listener;
};

ListenerRoom.prototype.removeListener = function(listener){
    delete this.listeners[listener.id];
};

ListenerRoom.prototype.getListener = function(listener, callback){
    callback(this.listeners[listener.id]);
};

ListenerRoom.prototype.getRoomSize = function(){
    return this.listeners.size();
};

ListenerRoom.prototype.getAllListeners = function(){
    return this.listeners;
};

module.exports = ListenerRoom;