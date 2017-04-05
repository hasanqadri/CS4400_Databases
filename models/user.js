/**
 * Created by Mark on 4/5/2017.
 */
db = require('../db.js');
record = require('record.js');

class user extends record {
    usertypes = {
        admin: 'admin',
        official: 'official',
        scientist: 'scientist'
    };

    constructor(username, emailaddress, password, usertype) {
        super(['username, emailaddress, password, usertype'],
            [username, emailaddress, password, usertype]);
        this.username = username;
        this.emailaddress = emailaddress;
        this.password = password;
        this.usertype = usertype;
    }

    commit() {
        db.con.query("UPDATE Users SET emailaddress = {0}, password = {1}".format(this.emailaddress, this.password));
    }
}

function get(username) {
    return db.con.query("SELECT * FROM Users WHERE Username = ? LIMIT 1", [username],
        function(error, results, fields) {
            if (error) {
                log.debug("User not found", error);
                return null;
            } else {
                return user(username, results.emailaddress, results.password, results.usertype);
            }
        });
}