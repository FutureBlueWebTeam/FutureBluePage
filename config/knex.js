/* MySQL Database Connection Pool
------------------------------------------------------ */
var fs = require('fs');

var configFilename = "./secret-config.js";
var config;

try {
    config = require(configFilename);
} catch (err) {
    config = {};
    console.log("ERROR: unable to read file '" + configFilename + "' : ", err);
}

var knex = require('knex')({
    client: 'mysql',
    connection: config.databaseConnection,
    pool: {
        min: 0,
        max: 20
    }
});

module.exports = knex;