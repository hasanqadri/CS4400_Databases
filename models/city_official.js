const db = require('../db.js');

const record = require('./record.js');

const user = require('./user.js');

class city_official extends user {
    constructor(username, email, password, usertype, approved, city, state, title) {
        super(username, email, password, usertype);

        this.username = username;
        this.approved = approved;
        this.city = city;
        this.state = state;
        this.title = title;
    }

    make(success, err) {
        var out = {};
        out['username'] = this.username;
        out['approved'] = this.approved;
        out['city'] = this.city;
        out['state'] = this.state;
        out['title'] = this.title;
        //call super with a dummy success function
        super.make(function (res) {
            let sql = 'INSERT INTO City_officials SET ?';
            //also insert City_officials data
            return db.query({sql: sql, values: out},
                function (error, results, fields) {
                    if (error) {
                        err(error);
                    } else {
                        //success callback
                        success(results);
                    }
                });
        }, err);
    }

    commit(success, err) {
        //throws if required field doesn't exist in this object
        var values = {};
        values['approved'] = this.approved;
        values['city'] = this.city;
        values['state'] = this.state;
        values['title'] = this.title;
        values['username'] = this.username;

        let sql = 'UPDATE City_officials SET ? WHERE username=?';

        db.query({sql: sql, values: values},
            function (error, results, fields) {
                if (error) {
                    //sql error callback
                    err(error);
                } else {
                    //result callback
                    success(success);
                }
            }
        );
    }

    static fetch(args, success, error) {
        args['name'] = 'City_officials';
        if (args['fields']) {
            args['fields'] = union_arrays(args['fields'], ['City_officials.username', 'email', 'city', 'state', 'title']);
        } else {
            args['fields'] =['City_officials.username', 'email', 'city', 'state', 'title'];
        }
        args['join'] = {table: 'Users', colA: 'username', colB: 'username'};
        record.fetch(args, success, error);
    }
}

function union_arrays (x, y) {
    var obj = {};
    for (var i = x.length-1; i >= 0; -- i)
        obj[x[i]] = x[i];
    for (var i = y.length-1; i >= 0; -- i)
        obj[y[i]] = y[i];
    var res = []
    for (var k in obj) {
        if (obj.hasOwnProperty(k))  // <-- optional
            res.push(obj[k]);
    }
    return res;
}

module.exports = city_official;