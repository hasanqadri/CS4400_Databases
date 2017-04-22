var express = require('express');
var router = express.Router();
var user = require('../models/user');
var cityofficial = require('../models/city_official');

var auth = require('../middlewares/authentication');


router.get('/me', function (req, res, next) {
    res.json([req.session.username, req.session.usertype]);
    res.status(200).end();
});

/* GET users listing. */
router.get('/list', [
    auth.admin,
    function (req, res, next) {
        user.fetch({}, function (results) {
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

/* POST new user */
router.post('/new',
    auth.admin,
    function (req, res) {
        if (req.body.usertype === 'official') {
            new cityofficial(req.body.username, req.body.email, req.body.password, req.body.usertype,
                req.body.approved, req.body.city, req.body.state, req.body.title);
        } else {
            new user(req.body.username, req.body.email, req.body.password, req.body.usertype).make(
                function (back) {
                    res.send("Added successfully!!")
                }, function (err) {
                    log.debug(err);
                    res.end();
                });
        }
    });

module.exports = router;
