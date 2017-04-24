var express = require('express');
var router = express.Router();

var auth = require('../middlewares/authentication');
var datapoint = require('../models/data_point');

router.post('/new', [
    function (req, res, next) {
        let our_datapoint = new datapoint(req.body.location_name, req.body.date_time, req.body.data_value, req.body.data_type);
        our_datapoint.make(
            function(res) {
                res.status(200).end();
            },
            function(err) {
                log.debug(err);
                res.status(500).end();
            }
        )
    }
]);

router.post('/list', [
    function (req, res, next) {
        datapoint.fetch({vals: {city: req.session.city, state: req.session.state}, order: req.body.order, like: req.body.like}, function (results) {
            res.results = results;
	    console.log(results);
            next();
        }, function (err) {
            log.debug(err);
            res.end();
        });
    },
    function (req, res) {
        res.json(res.results);
	res.send(res.results);
        res.status(200).end();
    }
]);

module.exports = router;
