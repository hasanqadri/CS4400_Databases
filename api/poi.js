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
        poi.fetch({
            between: req.body.between,
            vals: req.body.vals,
            order: req.body.order,
            like: req.body.like
        }, function (results) {
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

router.post('/report', [
    auth.official,
    function (req, res, next) {
        let db = require('../db');
        db.query({
            sql: "SELECT  POIs.location_name,  POIs.city,  POIs.state,  MIN(mold.data_value),  AVG(mold.data_value),  MAX(mold.data_value),  MIN(air.data_value),  AVG(air.data_value),  MAX(air.data_value) FROM POIs LEFT JOIN Data_points mold on POIs.location_name=mold.location_name and mold.data_type='mold' LEFT JOIN Data_points air on POIs.location_name=air.location_name and air.data_type='mold'"
        }, function(results) {
            res.json(results);
            res.status(200).end();
        }, function(err) {
            log.all(err);
            res.status(500).end();
        })
        // res.json([
        //     {
        //         location_name: "Georgia Tech",
        //         city: "Placeholder",
        //         state: "Georgia",
        //         mold_min: "123",
        //         mold_avg: "2",
        //         mold_max: "123",
        //         aq_min: "1",
        //         aq_avg: "2",
        //         aq_max: "3",
        //         dp_count: "2",
        //         flagged: false
        //     },
        //     {
        //         location_name: "UGA",
        //         city: "Athens",
        //         state: "Z-land",
        //         mold_min: "50000",
        //         mold_avg: "1",
        //         mold_max: "12",
        //         aq_min: "200",
        //         aq_avg: "-1",
        //         aq_max: "900",
        //         dp_count: "20",
        //         flagged: true
        //     }
        // ]);
        // res.status(200).end();
    }
]);

module.exports = router;