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

        //also insert City_officials data
        return db.query('INSERT INTO City_officials SET ?', out,
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

            var out = {};
            out['username'] = this.username;
            out['approved'] = this.approved;
            out['city'] = this.city;
            out['state'] = this.state;
            out['title'] = this.title;

            db.query('UPDATE City_officials SET ? WHERE username=\'' + db.mysql.escape(this.username) + '\'', out,
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
}

module.exports = city_official;