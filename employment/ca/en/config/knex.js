/* MySQL Database Connection Pool
------------------------------------------------------ */
var fs = require('fs');

var configFilename = "../../../../config/secret-config.js";
var config;

try {
    config = require(configFilename);
} catch (err) {
    config = {};
    console.log("ERROR: unable to read file '" + configFilename + "' : ", err);
}

var knex = require('knex')({
    client: 'mysql',
    config.databaseConnection,
    pool: {
        min: 0,
        max: 20
    }
});

module.exports = knex;