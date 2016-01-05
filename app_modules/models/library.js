
var mongoose    = require('mongoose');

var songSchema = mongoose.Schema({
        trackID        : Integer,
        song           : String,
        artist         : String,
        album          : String,
        tracklocation  : String,
        year           : Integer,
        dateimported   : String,
            albumartwork   : {
                data       : Buffer,
                contentType: String
         }
});

// create the model for users and expose it to our app

module.exports = mongoose.model('Song', songSchema);

