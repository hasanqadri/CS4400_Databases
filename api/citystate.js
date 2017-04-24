var express = require('express');
var router = express.Router();

var auth = require('../middlewares/authentication');
var citystate = require('../models/city_state');

router.post('/new', [
    auth.admin,
    function (req, res, next) {
        let our_city = new citystate(req.body.city, req.body.state);
        our_city.make(
            function (res) {
                res.status(200).end();
            },
            function (err) {
                log.debug(err);
                res.status(500).end();
            }
        )
    }
]);

router.post('/list', [
    auth.user,
    function (req, res, next) {
        citystate.fetch({order: req.body.order, like: req.body.like}, function (results) {
            res.results = results;
            next();
        }, function (err) {
            log.debug(err);
            res.end();
        });
    },
    function (req, res) {
        res.json(res.results);
        res.status(200).end();
    }
]);

module.exports = router;