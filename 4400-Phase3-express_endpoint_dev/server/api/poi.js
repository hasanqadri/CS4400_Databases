var express = require('express');
var router = express.Router();

var auth = require('../middlewares/authentication');
var poi = require('../models/poi');

router.post('/new', [
    function (req, res, next) {
        let our_poi = new poi(req.body.location_name, req.body.city, null, 0, req.body.state, req.body.zip);
        our_poi.make(
            function(res) {
                res.status(200).end();
            },
            function(err) {
                if (err.errno === 1062) {
                    res.status(409).end();
                } else {
                    res.status(500).end();
                }
            }
        )
    }
]);

router.post('/list', [
    function (req, res, next) {
        poi.fetch({order: req.body.order, like: req.body.like}, function (results) {
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
