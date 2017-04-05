/**
 * Created by Mark on 4/5/2017.
 */

var mysql = require("mysql");

var con = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "SLS017",
    password: process.env.DB_PASS || "GROUP17_SPR16",
    database: "SLS017"
});

con.connect(function (e) {
    if (e) {
        log.error('Error connecting to DB', e);
    } else {
        log.debug('DB connected successfully');
    }
});

module.exports = {
    con: con,
    open: function() {
        this.con = mysql.createConnection({
            host: process.env.DB_HOST || "localhost",
            user: process.env.DB_USER || "SLS017",
            password: process.env.DB_PASS || "GROUP17_SPR16",
            database: "SLS017"
        });
    }
};