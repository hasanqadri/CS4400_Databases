const record = require('./record.js');

class poi extends record {
    constructor(location_name, city, date_flagged, flag, state, zip) {
        super('POIs', ['location_name', 'city', 'date_flagged', 'flag', 'state', 'zip_code'], [location_name, city, date_flagged, flag, state, zip]);
    }
}

module.exports = poi;