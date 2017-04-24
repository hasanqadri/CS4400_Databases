var express = require('express');
var session = require('express-session');

var user = function isAuthenticated(req, res, next) {
    if (req.session.hasOwnProperty('username')) {
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

var official = function (req, res, next) {
    if (req.session.usertype !== 'official') {
        res.status(403).end();
    } else {
        next();
    }
};

var scientist = function (req, res, next) {
    if (req.session.usertype !== 'scientist') {
        res.status(403).end();
    } else {
        next();
    }
};

module.exports = {user, admin, official, scientist};
