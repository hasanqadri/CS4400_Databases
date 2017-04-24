const record = require('./record.js');

class datapoint extends record {
    /*
     "location_name VARCHAR(255) NOT NULL, " +
     "date_time DATETIME NOT NULL, " +
     "data_value BIGINT NOT NULL, " +
     "data_type VARCHAR(255) NOT NULL, " +
     "accepted TINYINT(1) DEFAULT 0 NOT NULL," +
     */
    constructor(location_name, date_time, data_value, data_type) {
        super('Data_points', ['location_name', 'date_time', 'data_value', 'data_type'], [location_name, date_time, data_value, data_type]);
    }
    static fetch(args, success, error) {
        args['name'] = 'Data_points';
        super.fetch(args, success, error);
    }

}

module.exports = datapoint;