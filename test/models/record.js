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
            db.query({sql: 'DELETE FROM Data_Points'});
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


    });
    //TODO: Mini mock MYSQL.
    // it('should create a new user in the database', function(done) {
    //     let type = 'admin';
    //     let fields = ['username', 'email', 'password', 'usertype'];
    //     let vals = ['john.doe', 'jd@example.com', 'password', 'admin'];
    //     let myRecord = new record(type, fields, vals);
    //     myRecord.make(function(msg) {
    //         assert.equal(msg, "i");
    //     });
    //     done();
    // });

});