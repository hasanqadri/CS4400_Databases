/**
 * Created by Mark on 4/5/2017.
 */

const mysql = require('mysql');

const host = process.env.DB_HOST || 'localhost';
const user = process.env.DB_USER || 'SLS017';
const password = process.env.DB_PASS || 'GROUP17_SPR17';
const database = process.env.DB_DB || 'SLS017';

const con = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database
});

module.exports = {
    query: function (options, cb) {
        try {
            var con = mysql.createConnection({
                host: host,
                user: user,
                password: password,
                database: database
            });
            con.query(options, cb)
        } finally {
            con.end();
        }
    },
    mysql: mysql
};


