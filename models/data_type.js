const record = require('./record.js');

class datatype extends record {

    static fetch(args, success, error) {
        args['name'] = 'Data_types';
        super.fetch(args, success, error);
    }

}

module.exports = datatype;