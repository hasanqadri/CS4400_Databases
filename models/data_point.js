const record = require('./record.js');

class datapoint extends record {

    constructor(location_name, date_time, data_value, data_type, accepted) {
        super('Data_points', ['location_name', 'date_time', 'data_value', 'data_type', 'accepted'], [location_name, date_time, data_value, data_type, accepted]);
    }

    static fetch(args, success, error) {
        args['name'] = 'Data_points';
        super.fetch(args, success, error);
    }

}

module.exports = datapoint;