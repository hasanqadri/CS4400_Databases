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

        let out = '(' + this.username + ',' + this.approved + ',' + this.city + ',' + this.title + ')';

        //also insert City_officials data
        return db.query('INSERT INTO City_officials VALUES ' + out,
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
        }, err);


        db.query('UPDATE City_officials SET ' + out + ' WHERE username=\'' + this.username,
            function (error, results, fields) {
                if (error) {
                    //sql error callback
                    err(error);
                } else {
                    //Now that changes are in db, we have to update identifying values
                    let newvals = [];
                    for (let field in this._fields) {
                        newvals.append(this[field]);
                    }
                    this._vals = newvals;
                    //result callback
                    success(success);
                }
            }
        );
    }
}

module.exports = city_official;