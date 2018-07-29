'use strict';

// Added to handle injection
const vandium = require( 'vandium' );
var mysql = require('mysql');
var config = require('./db-config.json');
var pool  = mysql.createPool({
    host     : config.dbhost,
    user     : config.dbuser,
    password : config.dbpassword,
    database : config.dbname,
    port : 3306,
});

module.exports.update  =  vandium.generic().handler( (event, context, callback) => {
    //prevent timeout from waiting event loop
    context.callbackWaitsForEmptyEventLoop = false;

pool.getConnection(function(err, connection) {
    // Use the connection
    if (err) {
        console.log("Error in connection database"+err);
        return;
    }


    var selectSql = "SELECT * From user where ";
    selectSql =selectSql + " id = "+connection.escape(event.id);


    var insertSql = "INSERT INTO user(id,nric)";
    insertSql = insertSql + " VALUES("+connection.escape(event.id)+","+connection.escape(event.nric)+")";


    var updateSql = "UPDATE user set "
    updateSql = updateSql + "name = " + connection.escape(event.nric) + " WHERE id = " + connection.escape(event.id);


    connection.query(selectSql, function (error, results, fields) {

        // And done with the connection.
        //connection.release();
        // Handle error after the release.
        if (error){
            connection.release();
            callback(error);
        }else{
            if(results && Object.keys(results).length !== 0){
                connection.query(updateSql, function (error, updateResults, fields) {
                    // And done with the connection.
                    connection.release();
                    // Handle error after the release.
                    if (error){
                        callback(error);
                    }else{
                        callback(null,updateResults);
                    }

                });
            }else{
                connection.query(insertSql, function (error, insertResults, fields) {
                    // And done with the connection.
                    connection.release();
                    // Handle error after the release.
                    if (error){
                        callback(error);
                    }else{
                        callback(null,insertResults);
                    }

                });
            }
            //callback(null,results);
        }
    });
});
});