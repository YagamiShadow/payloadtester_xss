// Constants
const PORT=3000;

var express = require('express');
app = express();

setupTemplateEngine();
setupParserAndSessionManagement();
setupRoutes();
var __ret = setupDB();
db = __ret.db;

console.log("[Express] service started localhost:"+PORT);
app.listen(PORT);

function setupTemplateEngine() {
    app.set('view engine', 'pug');
    app.set('views', './views');
}

function setupRoutes() {
    var router = require('./router.js');
    app.use("/sessionxss", router);
    app.use(express.static('public'));
    app.use("/sessionxss", express.static('public'));

    app.get('*', function (req, res) {
        res.render('404', {
            host: "http://" + req.get('host') + "/sessionxss"
        });
    });
}

function setupParserAndSessionManagement() {
    // for forms
    // parse application/json and application/xwww-form-urlencoded
    var bodyParser = require('body-parser');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    var multer = require('multer');
    var upload = multer();
    // parse multipart/form-data
    app.use(upload.array());

/*    var cookieParser = require('cookie-parser');
    app.use(cookieParser());*/
    var auth = require('./auth');
    var session = require('express-session');
    app.use(session({
	    secret: auth.makeid(),
        resave: true,
        saveUninitialized: true,
        cookie: { httpOnly: false, secure: false }
    }));

}

function setupDB() {
    var db = require('./database');
    db.initDB();
    return {db: db};
}
