var express = require('express');
var router = express.Router();

var auth = require('../middlewares/authentication');
var poi = require('../models/poi');

router.post('/new', [
    auth.scientist,
    function (req, res, next) {
        let our_poi = new poi(req.body.location_name, req.body.city, req.body.state, null, null, req.body.zip);
        our_poi.make(
            function (results) {
                res.status(200).end();
            },
            function (err) {
                if (err.errno === 1062) {
                    res.status(409).end();
                } else if (err.errno === 1452) {
                    res.status(400).end();
                } else {
                    res.status(500).end();
                }
            }
        )
    }
]);

router.post('/list', [
    auth.user,
    function (req, res, next) {
        poi.fetch({vals: req.body.vals, order: req.body.order, like: req.body.like}, function (results) {
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