/**
 * Created by Khalil on 2015-10-26.
 */
function Client(socket){
    this.socket = socket;
    this.id = socket.id;
    this.IP_ADDRESS = socket.request.connection.remoteAddress;
    this.connectionStatus = true;
}

Client.prototype.connect = function(socket){
    this.socket = socket;
    connectionStatus = true;
};

module.exports = Client;
