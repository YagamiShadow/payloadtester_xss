var express = require('express');
var router = express.Router();
var mainroutename = "/sessionxss";
var auth = require('./auth');
var xsspayloads = require('./xsspayloads');

const COOKIEIMGWIDTH="200px";

router.get('/', function(req, res) {
    res.redirect(mainroutename+'/login');
});

router.get('/login',function(req,res){
    res.render('login');
});

function checkVerified(req, res,next) {
    if (req.session === undefined) res.redirect(mainroutename+"/login");
    if (req.session.user) next();
    else res.redirect(mainroutename+"/login");
}

function writeStandardPageTop(res){
    res.setHeader("X-XSS-Protection","0");
    res.write("" +
        "<html>" +
        "<head>" +
        "<title>Protected Page</title>" +
        "</head>" +
        "<body>" +
        "<header>" +
        "<p style=\"text-align:center;\"><img src=\"logo.png\" alt=\"Logo\"/></p>" +
        "</header>" +
        "<p style=\"text-align:center;\"><img src=\"cookie.gif\" width=\""+COOKIEIMGWIDTH+"\" alt=\"Cookie\"/></p>" +
        "</br>"+
        "<div id=\"xsscontent\">");
}

function writeStandardPageBottom(res){
    res.write("</div>" +
        "<form>\n" +
        "  <input type=\"button\" value=\"Go back\" onclick=\"history.back()\">\n" +
        "</form>" +
        "</br>"+
        "<form action=\"" + mainroutename + "/logout\" method=\"POST\">" +
        "<button type=\"submit\">Logout</button>" +
        "</form>" +
        "</body>" +
        "</html>");
    res.end();
}

router.post('/show', checkVerified, function(req,res){
    writeStandardPageTop(res);
    res.write(req.body.xssfield);
    writeStandardPageBottom(res);
});

router.post('/list', checkVerified, function(req,res){
    writeStandardPageTop(res);
    xsspayloads.list(res, function() {
        writeStandardPageBottom(res);
    });
});

router.post('/store', checkVerified, function(req,res){
    writeStandardPageTop(res);
    xsspayloads.store(req.body.xssfield);
    res.write("Payload successfully stored");
    writeStandardPageBottom(res);
});

router.post('/clear', checkVerified, function(req,res){
    writeStandardPageTop(res);
    xsspayloads.clear();
    res.write("Payload successfully cleared");
    writeStandardPageBottom(res);
});

router.get('/protected', checkVerified, function(req,res){
   res.render('protected',{widthcookie: COOKIEIMGWIDTH});
});

router.post('/login', function(req,res) {
    if (!req.body.user || !req.body.pass){
        res.render('login',{message: "Please enter both id and password"});
    }
    else {
        auth.checkCredentials(req.body.user, req.body.pass,function(found) {
        if (found) {

            function doRedirect(){
                res.redirect(mainroutename+"/protected");
            }

            console.log ("[Router] Correct creds in router");

            // Refresh session to prevent session fixation.
             req.session.regenerate(function(err) {
                req.session.user = req.body.user;
                req.session.save(function(err) {
                    doRedirect();
                });
            });

        }
        else
        {
            console.log("[Router] Incorrect creds in router");
            res.render('login',{message: "Invalid credentials"});
        }});
    }
});

router.post('/logout',function(req,res){
    req.session.destroy(function(){
        console.log("user logged out.")
    });
    res.redirect(mainroutename+'/login');
});

exports.mainroutename = mainroutename;

module.exports = router;