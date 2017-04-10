/**
 * Created by Mark on 4/5/2017.
 */

const db = require('../db.js');

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

        return db.query({sql: sql, values: values},
            function (error, results, fields) {
                if (error) {
                    //sql error callback
                    err(error);
                } else {
                    //success callback
                    success(results);
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

// var fetch = function fetch(name, fields = '*', condition = null, limit = null) {
//     let sql = 'SELECT ' + fields + ' FROM ' + name + (condition ? condition : '') + (limit ? ' LIMIT ' + limit : '') + ';';
//
//     return db.query(sql,
//         function (error, results, fields) {
//             if (error) {
//                 throw error;
//             } else {
//                 var objects = [];
//             }
//         }
//     );
// };

module.exports = record;