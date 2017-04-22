var express = require('express');
var session = require('express-session');

var auth = function isAuthenticated(req, res, next) {
    if (req.session.username) {
        return next();
    } else {
        res.status(403).end();
    }
};

var admin = function (req, res, next) {
    if (req.session.usertype !== 'admin') {
        res.status(403).end();
    } else {
        next();
    }
};

module.exports = {admin, auth};
