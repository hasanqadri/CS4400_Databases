const record = require('./record.js');

class poi extends record {
    constructor(location_name, city, state, date_flagged, flag, zip) {
        super('POIs', ['location_name', 'city', 'state', 'date_flagged', 'flag', 'zip_code'], [location_name, city, state, date_flagged, flag, zip]);
    }

    static fetch(args, success, error) {
        args['name'] = 'POIs';
        super.fetch(args, success, error);
    }
}

module.exports = poi;