var sessionid = "";

exports.checkCredentials = function(user,pass,callback)
{
    db.searchCredentials(user, pass, function(res) {
        callback(res == 0);
    });
}

exports.makeid = function () {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}