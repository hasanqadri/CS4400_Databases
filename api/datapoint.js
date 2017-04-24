var express = require('express');
var router = express.Router();

var auth = require('../middlewares/authentication');
var datapoint = require('../models/data_point');
var datatype = require('../models/data_type');

router.post('/new', [
    auth.scientist,
    function (req, res, next) {
        let our_datapoint = new datapoint(req.body.location_name, req.body.date_time, req.body.data_value, req.body.data_type, 0);
        our_datapoint.make(
            function (results) {
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
    auth.admin,
    function (req, res, next) {
        datapoint.fetch({
            // join: {table: 'POIs', colA: 'location_name', colB: 'location_name'},
            // vals: {city: req.session.city, state: req.session.state},
            between: req.body.between ? {
                name: req.body.between['name'],
                min: req.body.between['min'],
                max: req.body.between['max']
            } : null,
            vals: req.body.vals,
            order: req.body.order,
            like: req.body.like
        }, function (results) {
            res.results = results;
            next();
        }, function (err) {
            log.debug(err);
            res.status(500).end();
        });
    },
    function (req, res) {
        res.json(res.results);
        res.status(200).end();
    }
]);

router.post('/update', [
    auth.admin,
    function (req, res, next) {
        datapoint.fetch({vals: {location_name: req.body.location_name, date_time: req.body.date_time}},
            function (results) {
                res.results = results;
                next();
            }, function (error) {
                log.debug(err);
                res.status(500).end();
            });
    },
    function (req, res) {
        let our_datapoint = new datapoint(res.results[0].location_name, res.results[0].date_time, res.results[0].data_value, res.results[0]);
        our_datapoint.accepted = req.body.accepted;
        our_datapoint.commit(function (suc) {
            res.status(200).end()
        }, function (err) {
            log.debug(err);
            res.status(500).end()
        })
    }
]);

router.get('/datatypes', [
    auth.user,
    function (req, res, next) {
        datatype.fetch({},
            function (results) {
                res.results = results;
                next();
            },
            function (error) {
                log.debug(err);
                res.status(500).end();
            }
        );
    },
    function (req, res) {
        res.json(res.results);
        res.status(200).end();
    }
]);

module.exports = router;