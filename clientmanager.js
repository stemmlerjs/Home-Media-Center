/**
 * Created by Khalil on 2015-10-26.
 */
var Client = require('./client.js');

function ClientManager(){
    this.clients = {};
    this.numberOfClients = 0;
}

ClientManager.prototype.getNumberTotalClients = function(){
    return this.numberOfClients;
};

ClientManager.prototype.addClient = function(Client){
    this.clients[Client.id] = Client;
};

ClientManager.prototype.removeClient = function(clientid){
    delete this.clients[clientid];
};

module.exports = ClientManager;
