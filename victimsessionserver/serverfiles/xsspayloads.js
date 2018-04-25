exports.store = function(payload)
{
    db.storePayload(payload);
}

exports.list = function(res,callback)
{
    db.getAllPayloads(function(rowstrings){
        for (var i in rowstrings) {
            res.write(rowstrings[i] + '\n<br/>\n');
        }
        callback();
    });
}

exports.clear = function()
{
    db.deletePayloads();
}