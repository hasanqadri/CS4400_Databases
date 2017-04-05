/**
 * Created by Mark on 4/5/2017.
 */
db = require('../db.js');

class record {
    constructor(name, fields, vars) {
        //Dont create rows with implicit null
        if (fields.length !== vars.length) {
            throw "Field length and var length are not the same.";
        }
        //Identifying information used for update and delete, private
        this._name = name;
        this._fields = fields;
        this._vars = vars;

        //Member variables that can be changed, public
        this.fields = fields;
        this.vars = vars;
    }

    create(err) {
        function conc(fields, vars) {
            let out = "(";
            for (let i = 0; i < fields.length; i++) {
                out = out + fields[i] + ",";
            }
            out = out.slice(0, -1) + ") VALUES (";
            for (let i = 0; i < vars.length; i++) {
                out = out + vars[i] + ",";
            }
            return out.slice(0, 1) + ")";
        }

        return db.con.query("INSERT INTO " + this._name
                + conc(fields, vars) + ";",
            function(error, results, fields) {
                if (error) {
                    err(error);
                } else {
                    return true;
                }
        });
    }

    update(err) {
        function conc(fields, vars) {
            let out = "";
            for (let i = 0; i < fields.length; i++) {
                out = out + fields[i] + "=" + vars[i] + ",";
            }
            return out.slice(0, -1);
        }
        return db.con.query("UPDATE " + this._name
            + " SET "
                + conc(this.fields, this.vars)
            + " WHERE "
                + conc(this._fields, this._vars)
            + ";",
            function(error, results, fields) {
                if (error) {
                   throw error;
                } else {
                    return true;
                }
            }
        );
    }
}

function fetch(name, fields = "*", condition = null, limit = null) {
    let sql = "SELECT " + fields + " FROM " + name + (condition ? condition : "") + (limit ? " LIMIT " + limit: "") + ";";

    return db.con.query(sql,
        function(error, results, fields) {
            if (error) {
                throw error;
            } else {
                var objects = [];
            }
        }
    );
}