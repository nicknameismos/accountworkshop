'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Contact = mongoose.model('Contact'),
    Ar = mongoose.model('Ar');

/**
 * Globals
 */
var user,
    contact,
    ar;

/**
 * Unit tests
 */
describe('Ar Model Unit Tests:', function() {
    beforeEach(function(done) {
        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: 'username',
            password: 'password'
        });

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
            }
        });

        user.save(function() {
            contact.save(function() {
                ar = new Ar({
                    docno: 'ar123',
                    docdate: new Date(),
                    contact: contact,
                    items: [{
                        name: 'longan',
                        unitprice: 50,
                        qty: 10,
                        amount: 500,
                        vat: 7
                    }],
                    amount: 500,
                    discount: 100,
                    netamount: 400,
                    user: user
                });
                done();
            });
        });
    });

    describe('Method Save', function() {
        it('should be able to save without problems', function(done) {
            this.timeout(0);
            return ar.save(function(err) {
                should.not.exist(err);
                done();
            });
        });
        // docno save test
        it('should be able to show an error when try to save without docno', function(done) {
            ar.docno = '';

            return ar.save(function(err) {
                should.exist(err);
                done();
            });
        });
        it('should be able to show an error when try to save duplicate docno', function(done) {
            var ar2 = new Ar(ar);
            ar.save(function(err) {
                should.not.exist(err);
                ar2.save(function(err) {
                    should.exist(err);
                    done();
                });
            });
        });
        // docdate  save test
        it('should be able to show an error when try to save without docdate', function(done) {
            ar.docdate = Date;

            return ar.save(function(err) {
                should.exist(err);
                done();
            });
        });
        // contact save test
        it('should be able to show an error when try to save without contact', function(done) {
            ar.contact = null;

            return ar.save(function(err) {
                should.exist(err);
                done();
            });
        });
        // items save test
        it('should be able to show an error when try to save without items', function(done) {
            ar.items = [{
                name: 'longan',
                unitprice: 50,
                qty: 10,
                amount: 500
            }];

            return ar.save(function(err) {
                should.not.exist(err);
                done();
            });
        });

    });

    afterEach(function(done) {
        User.remove().exec(function() {
            Contact.remove().exec(function() {
                Ar.remove().exec(function() {
                    done();
                });
            });
        });
    });
});