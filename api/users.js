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
router.post('/list', [
    auth.admin,
    function (req, res, next) {
        user.fetch({vals: req.body.vals, order: req.body.order, like: req.body.like}, function (results) {
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

/* GET users listing. */
router.post('/list_officials', [
    auth.admin,
    function (req, res, next) {
        cityofficial.fetch({vals: req.body.vals, order: req.body.order, like: req.body.like}, function (results) {
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
    // function (req, res, next) {
    //     if (req.session.usertype === 'admin' || req.session.username === req.body.username) {
    //         next();
    //     } else {
    //         res.status(403).end();
    //     }
    // },
    function (req, res, next) {
        user.fetch({vals: {username: req.body.username}},
            function (results) {
                let user_data = results[0];
                let user_update = new user(user_data.username, user_data.email, user_data.password, user_data.usertype);

                user_update.email = req.body.email || user_update.email;
                user_update.password = req.body.password || user_update.password;

                if (user_update.usertype === 'official') {
                    let db = require('../db');
                    db.query({sql: 'UPDATE City_officials SET approved=' + db.mysql.escape(req.body.approved) + ' where username=' + db.mysql.escape(user_update.username)}, function(suc) {}, function(err){log.all(err)})
                }
                user_update.usertype = req.body.usertype || user_update.usertype;
                user_update.commit();

                res.status(200).end();
            },
            function (err) {
                log.debug(err);
                res.status(500).end();
            }
        );
    }
]);

/* POST new user */
router.post('/new',
    auth.admin,
    function (req, res) {
        if (req.body.usertype === 'official') {
            new cityofficial(req.body.username, req.body.email, req.body.password, req.body.usertype,
                req.body.approved, req.body.city, req.body.state, req.body.title).make(
                function (back) {
                    res.send("Added successfully!!")
                }, function (err) {
                    log.debug(err);
                    if (err.errno === 1062) {
                        res.status(409).end();
                    } else {
                        res.status(500).end();
                    }
                });
        } else {
            new user(req.body.username, req.body.email, req.body.password, req.body.usertype).make(
                function (back) {
                    res.send("Added successfully!!")
                }, function (err) {
                    log.debug(err);
                    if (err.errno === 1062) {
                        res.status(409).end();
                    } else {
                        res.status(500).end();
                    }
                });
        }
    });

module.exports = router;
