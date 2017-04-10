var express = require('express');
var router = express.Router();
var user = require('../models/user.js');


/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

/* POST new user */
router.post('/new', function (req, res) {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var usertype = req.body.usertype;

    var newuser = new user(username, email, password, usertype);
    newuser.make(
        function (back) {
            res.send("Added successfully!!")
        }, function (err) {
            log.debug(err);
            res.end();
        });
});


module.exports = router;
