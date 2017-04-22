/**
 * Created by Mark on 4/5/2017.
 */

const db = require('../db.js');
const stream = require('stream');

class record {
    constructor(name, fields, vals) {
        //we need a name to commit data
        if (name === null) {
            throw 'Needs a type name to commit to table';
        }
        //Dont create rows with implicit null
        if (fields.length !== vals.length) {
            throw 'Field length and var length are not the same.';
        }
        //Identifying information used for update and delete, private
        this._name = name;
        this._fields = fields;
        this._vals = vals;

        //Member variables that can be changed, public
        for (let i = 0; i < fields.length; i++) {
            this[fields[i]] = vals[i];
        }
    }

    make(success, err) {
        this._validate();

        let values = {};
        for (let field of this._fields) {
            values[field] = this[field];
        }

        let sql = 'INSERT INTO ' + this._name + ' SET ? ';

        db.query({sql: sql, values: values},
            function (error, results, fields) {
                if (error) {
                    if (err) {
                        //sql error callback
                        err(error);
                    } else {
                        throw err;
                    }
                } else {
                    if (success) {
                        //success callback
                        success(results);
                    }
                }
            });
    }

    commit(success, err) {
        //throws if required field doesn't exist in this object
        this._validate();

        let values = {};
        for (let field of this._fields) {
            values[field] = this[field];
        }

        let sql = 'UPDATE ' + this._name + ' SET ? WHERE ' + this._identity();
        db.query({sql: sql, values: values},
            function (error, results, fields) {
                if (error) {
                    //sql error callback
                    err(error);
                } else {
                    //Now that changes are in db, we have to update identity values
                    let newvals = [];
                    for (let field in this._fields) {
                        newvals.push(this[field]);
                    }
                    this._vals = newvals;
                    //result callback
                    success(success);
                }
            }
        );
    }

    static fetch(args, success_call, error_call) {
        var name = args['name'];
        var vals = args['vals'] || {};
        var limit = args['limit'];
        var fields = args['fields'];

        if (name === null) {
            throw "name cannot be null"
        }

        let sql = 'SELECT ?? from ' + db.mysql.escapeId(name);
        if (!args.hasOwnProperty('fields')) {
            sql = 'SELECT * from ' + db.mysql.escapeId(name);
        }

        if (Object.keys(vals).length > 0) {
            sql += ' WHERE ';
            for (var property in vals) {
                if (vals.hasOwnProperty(property)) {
                    sql += db.mysql.escapeId(property) + '=' + db.mysql.escape(vals[property]) + ' AND ';
                }
            }
            sql = sql.slice(0, -5);
        }
        if (limit !== null && parseInt(limit, 10) > 1) {
            sql += ' LIMIT ' + parseInt(limit, 10);
        }

        db.query({sql: sql, values: [fields, name]}, function (err, results, fields) {
            if (err) {
                if (error_call) {
                    //sql error callback
                    error_call(err);
                } else {
                    throw err;
                }
            } else {
                if (success_call) {
                    //success callback
                    success_call(results);
                }
            }
        });
    }

    //private helper methods
    _identity() {
        let out = '';
        for (let i = 0; i < this._fields.length; i++) {
            out = out + this._fields[i] + '= ' + db.mysql.escape(this._vals[i]) + ' AND ';
        }
        return out.slice(0, -5);
    }

    _validate() {
        for (let field of this._fields) {
            if (!this.hasOwnProperty(field) || this[field] === null) {
                throw 'Necessary field ' + field + ' not fulfilled';
            }
        }
    }
}

module.exports = record;