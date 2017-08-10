'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Account = mongoose.model('Account');

/**
 * Globals
 */
var user,
    account;

/**
 * Unit tests
 */
describe('Account Model Unit Tests:', function() {
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
            account = new Account({
                name: 'Account name',
                accountno: '10000',
                parent: 0,
                user: user
            });

            done();
        });
    });

    describe('Method Save', function() {
        it('should be able to save without problems', function(done) {
            this.timeout(0);
            return account.save(function(err) {
                should.not.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save without name', function(done) {
            account.name = '';

            return account.save(function(err) {
                should.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save duplicate name', function(done) {
            var account2 = new Account(account);

            return account.save(function(err) {
                should.not.exist(err);
                account2.save(function(err) {
                    should.exist(err);
                    done();
                });
            });
        });

        it('should be able to show an error when try to save without accountno', function(done) {
            account.accountno = '';

            return account.save(function(err) {
                should.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save duplicate accountno', function(done) {
            var account2 = new Account(account);

            return account.save(function(err) {
                should.not.exist(err);
                account2.save(function(err) {
                    should.exist(err);
                    done();
                });
            });
        });
    });

    afterEach(function(done) {
        Account.remove().exec(function() {
            User.remove().exec(function() {
                done();
            });
        });
    });
});