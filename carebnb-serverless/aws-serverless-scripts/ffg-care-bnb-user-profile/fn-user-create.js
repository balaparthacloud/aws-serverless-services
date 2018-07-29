'use strict';

var mysql = require('mysql');
var config = require('./db-config.json');
var pool  = mysql.createPool({
    host     : config.dbhost,
    user     : config.dbuser,
    password : config.dbpassword,
    database : config.dbname,
    port : 3306,
});

var debug=false;

module.exports.create =  (event, context, callback) => {
    //prevent timeout from waiting event loop
    context.callbackWaitsForEmptyEventLoop = false;

    pool.getConnection(function(err, connection) {
        // Use the connection
        if (err) {
            console.log("Error in connection database"+err);
            return;
        }
        if(debug)console.dir(connection);
        connection.query('SELECT * from user', function (error, results, fields) {

            // And done with the connection.
            connection.release();
            // Handle error after the release.
            if (error){
                callback(error);
            }else{
                callback(null,results);
            }
        });
    });
};