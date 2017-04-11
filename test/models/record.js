/**
 * Created by Mark on 4/10/2017.
 */
const describe = require('mocha').describe;
const it = require('mocha').it;
const before = require('mocha').before;
const beforeEach = require('mocha').beforeEach;

const assert = require('assert');

process.env['DB_HOST'] = 'localhost';
process.env['DB_USER'] = 'SLS017_TEST';
process.env['DB_PASS'] = 'TEST';
process.env['DB_DB'] = 'SLS017_TEST_ENV';

const record = require('../../models/record.js');

global.log = require('loglevel');
log.setLevel(log.levels.DEBUG);


describe('Record', function () {
    describe('#constructor()', function () {
        it('should reject a null object type ', function (done) {
            try {
                let type = null;
                let fields = ['username', 'email', 'password', 'usertype'];
                let vals = ['john.doe', 'jd@example.com', 'password', 'admin'];
                let myRecord = new record(type, fields, vals);
            } catch (err) {
                assert.equal(err, 'Needs a type name to commit to table');
                done();
            }
        });

        it('should reject mismatched param lengths', function (done) {
            try {
                let type = 'Users';
                let fields = ['username', 'email', 'password', 'usertype'];
                let vals = ['john.doe', 'jd@example.com', 'password'];
                let myRecord = new record(type, fields, vals);
            } catch (err) {
                assert.equal(err, 'Field length and var length are not the same.');
                done();
            }
        });

        it('should set field variables as member variables', function (done) {
            let type = 'admin';
            let fields = ['username', 'email', 'password', 'usertype'];
            let vals = ['john.doe', 'jd@example.com', 'password', 'admin'];
            let myRecord = new record(type, fields, vals);

            assert.equal(myRecord.username, 'john.doe');
            assert.equal(myRecord.email, 'jd@example.com');
            assert.equal(myRecord.password, 'password');
            assert.equal(myRecord.usertype, 'admin');
            done();
        });
    });

    describe('#make()', function () {
        beforeEach(function () {
            var db = require('../../db.js');
            db.query({sql: 'DELETE FROM Users'});
            db.query({sql: 'DELETE FROM POIs'});
            db.query({sql: 'DELETE FROM City_states'});
            db.query({sql: 'DELETE FROM Data_points'});
            db.query({sql: 'DELETE FROM City_officials'});
        });

        it('should create a new user in the database', function (done) {
            let type = 'Users';
            let fields = ['username', 'email', 'password', 'usertype'];
            let vals = ['john.doe', 'jd@example.com', 'password', 'admin'];
            let myRecord = new record(type, fields, vals);
            myRecord.make(function (res) {
                assert.equal(res.affectedRows, 1);
                done();
            }, function (err) {
                throw err;
            });
        });

        it('should error on adding duplicate users', function (done) {
            let type = 'Users';
            let fields = ['username', 'email', 'password', 'usertype'];
            let vals = ['john.doe', 'jd@example.com', 'password', 'admin'];
            let myRecord = new record(type, fields, vals);
            myRecord.make();
            myRecord.make(function (res) {
            }, function (err) {
                assert.equal(err.message, 'ER_DUP_ENTRY: Duplicate entry \'john.doe\' for key \'PRIMARY\'');
                done();
            });
        });

        it('should update the database when make happens', function (done) {
            let type = 'Users';
            let fields = ['username', 'email', 'password', 'usertype'];
            let vals = ['john.doe', 'jd@example.com', 'password', 'admin'];
            let myRecord = new record(type, fields, vals);
            myRecord.make(function (res) {
                assert(res !== null, true);
                var fieldDict = {};
                for (let i = 0; i < fields.length; i++) {
                    fieldDict[fields[i]] = myRecord[fields[i]];
                }

                record.fetch({name: 'Users', vals: fieldDict, limit: 1}, function (res) {
                    assert(res.length, 1, 'more than one result in db.fetch!');

                    var db_result = res[0];

                    assert(db_result.hasOwnProperty('username'), true, 'username not a property of new record!');
                    assert(db_result.username, myRecord.username);

                    assert(db_result.hasOwnProperty('email'), true, 'email not a property of new record!');
                    assert(db_result.email, myRecord.email);

                    assert(db_result.hasOwnProperty('password'), true, 'password not a property of new record!');
                    assert(db_result.password, myRecord.password);

                    assert(db_result.hasOwnProperty('usertype'), true, 'usertype not a property of new record!');
                    assert(db_result.usertype, myRecord.usertype);
                    done();
                });
            });
        });
    });

    describe('#commit', function () {
        beforeEach(function () {
            var db = require('../../db.js');
            db.query({sql: 'DELETE FROM Users'});
            db.query({sql: 'DELETE FROM POIs'});
            db.query({sql: 'DELETE FROM City_states'});
            db.query({sql: 'DELETE FROM Data_Points'});
            db.query({sql: 'DELETE FROM City_officials'});
        });
        it('should update the database when commit happens', function (done) {
            let type = 'Users';
            let fields = ['username', 'email', 'password', 'usertype'];
            let vals = ['john.doe', 'jd@example.com', 'password', 'admin'];
            let myRecord = new record(type, fields, vals);
            myRecord.make(function (res) {
                assert(res !== null, true);
            });

            myRecord.email = 'john.doe@example.com';
            myRecord.commit(function (success, err) {
                record.fetch({
                    name: 'Users',
                    vals: {
                        username: 'john.doe',
                        email: 'john.doe@example.com',
                        password: 'password',
                        usertype: 'admin'
                    },
                    limit: 1
                }, function (res) {
                    assert(res.length, 1, 'more than one result in db.fetch!');

                    var db_result = res[0];

                    assert(db_result.hasOwnProperty('username'), true, 'username not a property of new record!');
                    assert(db_result.username, myRecord.username);

                    assert(db_result.hasOwnProperty('email'), true, 'email not a property of new record!');
                    assert(db_result.email, myRecord.email);

                    assert(db_result.hasOwnProperty('password'), true, 'password not a property of new record!');
                    assert(db_result.password, myRecord.password);

                    assert(db_result.hasOwnProperty('usertype'), true, 'usertype not a property of new record!');
                    assert(db_result.usertype, myRecord.usertype);
                    done();
                });
            });
        })
    })
});