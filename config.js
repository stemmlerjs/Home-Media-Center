/**
 * HANDLES ALL CONFIGURATION CHANGES
 *
 * configAccess.configWriter - WRITE changes to config with set() method
 * configAccess.configReader - READ keys and attributes
 *
 * Documentation: https://docs.nodejitsu.com/articles/file-system/how-to-store-local-config-data
 *
 * Created by Khalil on 2015-10-18.
 */


var configAccess = {};
var fs = require('fs');
var configWriter = require('nconf');
configAccess.configWriter = configWriter;

//Initialize READER and WRITER
var configFile = fs.readFileSync('./config.json');
configAccess.configReader = JSON.parse(configFile);
configWriter.use('file', { file: './config.json' });
configWriter.load();

//Config Methods
configAccess.saveConfig = function(){
    configWriter.save(function (err) {
        if (err) {
            console.error(err.message);
            return;
        }
        console.log('Configuration saved successfully.');
    });
};

module.exports = configAccess;