'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Contact = mongoose.model('Contact'),
    Ap = mongoose.model('Ap');

/**
 * Globals
 */
var user,
    contact,
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
                ap = new Ap({
                    docno: 'ap1234',
                    docdate: new Date(),
                    contact: contact,
                    items: [{
                        productname: 'longan',
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
        User.remove().exec(function() {
            Contact.remove().exec(function() {
                Ap.remove().exec(function() {
                    done();
                });
            });
        });
    });
});