const record = require('./record.js');

class city_state extends record {
    constructor(city, state) {
        super('City_states', ['city', 'state'], [city, state]);
    }
}

module.exports = city_state;