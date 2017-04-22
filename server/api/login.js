var express = require('express');
var router = express.Router();
var user = require('../models/user');
var cityofficial = require('../models/city_official');

/* POST login */
router.post('/', [
    function (req, res, next) {
        let username = req.body.username;
        let password = req.body.password;

        user.fetch({vals: {username: username, password: password}},
            function (results) {
                if (results.length === 1 && results[0]['username'] === username) {
                    req.session.username = username;
                    req.session.usertype = results[0]['usertype'];

                    if (req.session.usertype === 'official') {
                        let official = cityofficial.fetch({vals: {username: username}},
                            function (official_results) {
                                if (official_results.length === 1) {
                                    //We want type coercion here because some versions of sql will return false
                                    if (official_results[0]['approved'] === 0
                                        || official_results[0]['approved'] === false
                                        || official_results[0]['approved'] === '0') {

                                        req.session = null;
                                        res.status(403).send('unapproved');
                                    } else {
                                        req.session.city = official_results[0]['city'];
                                        req.session.state = official_results[0]['state'];
                                        req.session.title = official_results[0]['title'];
                                        res.end();
                                    }
                                } else {
                                    res.status(403).end();
                                }
                            }, function (err) {
                                res.status(403).end();
                            }
                        );
                    } else {
                        res.end();
                    }
                } else {
                    res.status(403).end();
                }
            }, function (err) {
                res.status(403).end();
            })
    },
    function (req, res) {
        res.status(403).end();
    }
]);

/* GET logout */
router.get('/logout', function (req, res, next) {
    if (req.session) {
        req.session = null;
    }
    res.status(200).end();
});

module.exports = router;
