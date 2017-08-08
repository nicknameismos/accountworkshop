'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Expend = mongoose.model('Expend');

/**
 * Globals
 */
var user,
    expend;

/**
 * Unit tests
 */
describe('Expend Model Unit Tests:', function() {
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
            expend = new Expend({
                name: 'expend name',
                unitprice: 50,
                vat: 7,
                netamount: 57,
                user: user
            });

            done();
        });
    });

    describe('Method Save', function() {
        it('should be able to save without problems', function(done) {
            this.timeout(0);
            return expend.save(function(err) {
                should.not.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save without name', function(done) {
            expend.name = '';

            return expend.save(function(err) {
                should.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save without unitprice', function(done) {
            expend.unitprice = null;

            return expend.save(function(err) {
                should.exist(err);
                done();
            });
        });
    });

    afterEach(function(done) {
        Expend.remove().exec(function() {
            User.remove().exec(function() {
                done();
            });
        });
    });
});