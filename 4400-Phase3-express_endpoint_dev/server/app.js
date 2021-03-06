var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var cors = require('cors');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());


var cookiesign = process.env.SESSION_KEY || '11i3$H0cw:OWS)25iI25A`,e0@I>vR';
app.use(session({
    secret: cookiesign,
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 300000}
}));

app.use(cors());

app.use(express.static(path.join(__dirname, 'dist')));

app.use('/api/login', require('./api/login'));
app.use('/api/users', require('./api/users'));
app.use('/api/citystate', require('./api/citystate'));
app.use('/api/poi', require('./api/poi'));
app.use('/api/datapoint', require('./api/datapoint'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// logging configuration
global.log = require('loglevel');
log.setLevel(app.get('env') === 'development' ? log.levels.DEBUG : log.levels.ERROR);

module.exports = app;
