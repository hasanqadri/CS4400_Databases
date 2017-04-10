/**
 * Created by Mark on 4/5/2017.
 */

const mysql = require('mysql');

const host = process.env.DB_HOST || 'localhost';
const user = process.env.DB_USER || 'SLS017';
const password = process.env.DB_PASS || 'GROUP17_SPR16';
const database = 'SLS017';

module.exports = {
    query: function (querystring, res) {
        try {
            this.con = mysql.createConnection({
                host: host,
                user: user,
                password: password,
                database: database
            });
            this.con.query(querystring, res)
        } finally {
            this.con.end();
        }
    }
};


