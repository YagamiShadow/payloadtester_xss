/**
 * XSS Example application (stored & reflected).
 * @author Matthias Altmann
 */

var http = require('http');
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var qs = require('querystring');
var db = new sqlite3.Database(':memory:');

/**
 * Main method for server.
 * @param {object} request = HTTP Request.
 * @param {object} response = HTTP Response.
 */
var server = http.createServer(function (request, response) 
{
    if (request.method.toLowerCase() == 'get') 
    {
		displayEnterComment(response);
    } 
    else if (request.method.toLowerCase() == 'post') 
    {
        var body = '';

        request.on('data', function (data) {
            body += data;
        });

        request.on('end', function () {
            var post = qs.parse(body);
            
	    if ("enter_comment" in post)
	    {
	    	if (post.enter_comment.toLowerCase() == 'show')
				displayShowComment(response, post.comment_field);
	    	if (post.enter_comment.toLowerCase() == 'store')
		        displayStoreComment(response, post.comment_field);
	    	if (post.enter_comment.toLowerCase() == 'list')
				displayListComment(response);
            }
	    if (("show_comment" in post) || ("store_comment" in post))
	    {
			displayEnterComment(response);
		}
	    if ("list_comment" in post)
	    {
                if (post.list_comment.toLowerCase() == 'back')
		       displayEnterComment(response);
		if (post.list_comment.toLowerCase() == 'clear')
	        {
		       deleteRowsDB();
                       displayListComment(response);
		}
            }
	    
        });
    }
});

/**
 * Check error, if existent log it.
 * @param {object} err = Error object.
 */
function checkError(err)
{
	if (err)
	{	
		console.error(err.message);
	}
}

/** 
 * Initialize SQLite Database.
 */
function initDB()
{
	db.run('CREATE TABLE Comments(Content text)',function(err)
	{
		checkError();
	});
}

/**
 * Delete all rows of SQLite Table Comments.
 */
function deleteRowsDB()
{
	db.run('DELETE FROM Comments',function(err)
	{
		checkError();
	});
}

/**
 * Display List Comment Page.
 * @param {object} response = HTTP Response.
 */
function displayListComment(response)
{
	var sql = 'SELECT Content content FROM Comments';
	db.all(sql, [], (err,rows) =>
	{
        var htmlListString = "";
		if (err) 
		{
			return console.log(err.message);
		}
		rows.forEach((row) =>
		{
			htmlListString += row.content.toString() +'\n<br/>\n';
		});
    	displayFormFile("list_comment.html", response, "COMMENT_LIST", htmlListString);
	});
}

/**
 * Display Store Comment Page.
 * @param {object} response = HTTP Response.
 * @param {string} comment = Comment String.
 */
function displayStoreComment(response, comment)
{
	db.run('INSERT INTO Comments(Content) VALUES(?)', [comment], function(err) 
	{
 	   if (err)
	   {
      		return console.log(err.message);
           }   
    	});
	var htmlListString = comment +'<br/><br/>\nSuccessfully stored\n';
	displayFormFile("store_comment.html", response, "COMMENT_STORAGE", htmlListString);
}

/**
 * Display Enter Comment Page.
 * @param {object} response = HTTP Response.
 */
function displayEnterComment(response)
{
	displayFormFile("enter_comment.html",response);
}

/**
 * Display Show Comment Page.
 * @param {object} response = HTTP Response.
 * @param {string} comment = Comment String.
 */
function displayShowComment(response, comment)
{
    displayFormFile("show_comment.html", response, "COMMENT_OUTPUT", comment);
}

/**
 * Display Form File Page.
 * @param {string} formfile = String to form file to load.
 * @param {object} response = HTTP Response.
 * @param {string} stringToBeReplaced = String to be replaced. 
 * @param {string} replaceString = Replace String.
 */
function displayFormFile(formfile, response, stringToBeReplaced, replaceString ) 
{
    var hasToReplace = arguments.length >= 3;	
    var htmlSource = fs.readFile(formfile, function (err, data) 
    {
	if (hasToReplace) { data = data.toString().replace(stringToBeReplaced,replaceString);}

	response.writeHead(200, {
            'Content-Type': 'text/html',
            'X-XSS-Protection':'0',		
            'Content-Length': data.length,
        });
        response.write(data);
        response.end();
    });
    return htmlSource; 
}

// Entrypoint.
initDB();
server.listen(1185);
console.log("server listening on http://localhost:1185");
