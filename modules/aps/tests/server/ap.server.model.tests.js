'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Ap = mongoose.model('Ap');

/**
 * Globals
 */
var user,
    ap;

/**
 * Unit tests
 */
describe('Ap Model Unit Tests:', function() {
    beforeEach(function(done) {
        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: 'username',
            password: 'password'
        });

        user.save(function() {
            ap = new Ap({
                docno: 'ap1234',
                docdate: new Date(),
                contact: 'c@net',
                items: [{
                    productname: 'longan',
                    unitprice: 50,
                    qty: 10,
                    amount: 500
                }],
                amount: 500,
                discount: 100,
                netamount: 400,
                user: user
            });

            done();
        });
    });

    describe('Method Save', function() {
        it('should be able to save without problems', function(done) {
            this.timeout(0);
            return ap.save(function(err) {
                should.not.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save without docno', function(done) {
            ap.docno = '';

            return ap.save(function(err) {
                should.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save duplicate docno', function(done) {
            var ap2 = new Ap(ap);
            ap.save(function(err) {
                should.not.exist(err);
                ap2.save(function(err) {
                    should.exist(err);
                    done();
                });
            });
        });

        it('should be able to show an error when try to save without docdate', function(done) {
            ap.docdate = null;

            return ap.save(function(err) {
                should.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save without contact', function(done) {
            ap.contact = null;

            return ap.save(function(err) {
                should.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save without items', function(done) {
            ap.items = null;

            return ap.save(function(err) {
                should.exist(err);
                done();
            });
        });
    });

    afterEach(function(done) {
        Ap.remove().exec(function() {
            User.remove().exec(function() {
                done();
            });
        });
    });
});