'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Contact = mongoose.model('Contact');

/**
 * Globals
 */
var user,
    contact;

/**
 * Unit tests
 */
describe('Contact Model Unit Tests:', function() {
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
            contact = new Contact({
                name: 'Contact name',
                govermentId: '123458999',
                email: 'account@gmail.com',
                tel: '0894447208',
                address: {
                    address: '55/9',
                    subdistrict: 'lumlukka',
                    district: 'lumlukka',
                    province: 'prathumtani',
                    postcode: '12150'
                },
                user: user
            });

            done();
        });
    });

    describe('Method Save', function() {
        it('should be able to save without problems', function(done) {
            this.timeout(0);
            return contact.save(function(err) {
                should.not.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save without name', function(done) {
            contact.name = '';

            return contact.save(function(err) {
                should.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save without govermentId', function(done) {
            contact.govermentId = '';

            return contact.save(function(err) {
                should.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save duplicate govermentId', function(done) {
            var contact2 = new Contact(contact);

            return contact.save(function(err) {
                should.not.exist(err);
                contact2.save(function(err) {
                    should.exist(err);
                    done();
                });
            });
        });

    });

    afterEach(function(done) {
        Contact.remove().exec(function() {
            User.remove().exec(function() {
                done();
            });
        });
    });
});