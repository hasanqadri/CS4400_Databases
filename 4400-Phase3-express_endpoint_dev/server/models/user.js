const record = require('./record.js');

class user extends record {
    constructor(username, email, password, usertype) {
        super('Users', ['username', 'email', 'password', 'usertype'], [username, email, password, usertype]);
    }

    static fetch(args, success, error) {
        args['name'] = 'Users';
        super.fetch(args, success, error);
    }
}

module.exports = user;