var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');

exports.initDB = function() {
    console.log("[SQLite3] Create Tables...");
    db.serialize(function(){
        db.run("CREATE TABLE IF NOT EXISTS users (user TEXT NOT NULL, pass TEXT NOT NULL)",function(err)
        {
            checkError(err);
        });
        db.run("CREATE TABLE xsspayloads(payload TEXT)",function(err)
        {
            checkError(err);
        });
        fillSampleUsers();
    });
};

var fillSampleUsers = function () {
    console.log("[SQLite3] Fill in sample users ...");
    var stmt = db.prepare("INSERT INTO users VALUES (?,?)");
    stmt.run("hugo","boss");stmt.run("boss","doe");
    stmt.run("admin","istrator");
    stmt.finalize();
};

exports.searchCredentials = function(username, password, callback) {
    console.log("[SQLite3] Search for credentials ...");
    db.serialize(function() {
    db.all("SELECT * FROM users", function (err, rows) {
        var found = false;
        rows.forEach(function(row) {
            if (row.user === username && row.pass === password)
            {
                found = true;
                callback(0);
            }
        });
        if (found == false) {callback(1);}
        });
    });
};

exports.deletePayloads = function()
{
    db.run('DELETE FROM xsspayloads',function(err)
    {
        checkError(err);
    });
}

exports.storePayload = function(xsspayload)
{
    db.run('INSERT INTO xsspayloads(payload) VALUES(?)', xsspayload, function(err)
    {
        if (err)
        {
            return console.log(err.message);
        }
    });
}

exports.getAllPayloads = function(callback)
{
    var rowstrings = [];
    console.log("[SQLite3] Get all payloads ...");
    db.serialize(function() {
        db.all("SELECT * FROM xsspayloads", [], function (err, rows) {
            checkError(err);
            rows.forEach(function(row) {
                rowstrings.push(row.payload.toString());
            });
            callback(rowstrings);
        });
    });
}
/**
 * Check error, if existent log it.
 * @param {object} err = Error object.
 */
var checkError = function(err)
{
    if (err)
    {
        console.error(err.message);
    }
}