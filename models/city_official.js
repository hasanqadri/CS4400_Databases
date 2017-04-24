const db = require('../db.js');

const record = require('./record.js');

const user = require('./user.js');

class city_official extends user {
    constructor(username, email, password, usertype, approved, city, state, title) {
        super(username, email, password, usertype);

        this.approved = approved;
        this.city = city;
        this.state = state;
        this.title = title;
    }

    make(success, err) {
        //call super with a dummy success function
        super.make(function () {
        }, err);

        var out = {};
        out['username'] = this.username;
        out['approved'] = this.approved;
        out['city'] = this.city;
        out['state'] = this.state;
        out['title'] = this.title;

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
    }

    commit(success, err) {
        //throws if required field doesn't exist in this object
        super.commit(function () {

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
        }, err);
    }

    static fetch(args, success, error) {
        args['type'] = 'City_officials';
        // super.fetch(args, success, error);
        super.super.fetch(args, success, error);
    }
}

module.exports = city_official;