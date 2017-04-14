var express = require('express');
var router = express.Router();
var user = require('../models/user.js');


/* GET users listing. */
router.get('/', [
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
router.post('/new', function (req, res) {
    new user(req.body.username, req.body.email, req.body.password, req.body.usertype).make(
        function (back) {
            res.send("Added successfully!!")
        }, function (err) {
            log.debug(err);
            res.end();
        });
});

module.exports = router;
