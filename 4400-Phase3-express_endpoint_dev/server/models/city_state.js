const record = require('./record.js');

class city_state extends record {
    constructor(city, state) {
        super('City_states', ['city', 'state'], [city, state]);
    }

    static fetch(args, success, error) {
        args['name'] = 'City_states';
        super.fetch(args, success, error);
    }
}

module.exports = city_state;