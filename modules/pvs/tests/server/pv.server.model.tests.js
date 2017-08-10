'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Contact = mongoose.model('Contact'),
    Ap = mongoose.model('Ap'),
    Pv = mongoose.model('Pv');

/**
 * Globals
 */
var user,
    contact,
    ap,
    pv;

/**
 * Unit tests
 */
describe('Pv Model Unit Tests:', function () {
    beforeEach(function (done) {
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

        ap = new Ap({
            docno: 'ap1234',
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
            totalamount: 535,
            discount: 100,
            netamount: 435
        });

        user.save(function () {
            contact.save(function () {
                ap.save(function () {
                    pv = new Pv({
                        docno: 'ap1234',
                        docdate: new Date(),
                        contact: contact,
                        items: [{
                            aps: ap
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
    });

    describe('Method Save', function () {
        it('should be able to save without problems', function (done) {
            this.timeout(0);
            return pv.save(function (err) {
                should.not.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save without docno', function (done) {
            pv.docno = '';

            return pv.save(function (err) {
                should.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save without docdate', function (done) {
            pv.docdate = '';
            return pv.save(function (err) {
                should.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save without contact', function (done) {
            pv.contact = null;
            return pv.save(function (err) {
                should.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save without items', function (done) {
            pv.items = [];
            return pv.save(function (err) {
                should.exist(err);
                done();
            });
        });

        it('should be able to show an error when try to save duplicate docno', function (done) {
            var pv2 = new Pv(pv);
            pv.save(function (err) {
                should.not.exist(err);
                pv2.save(function (err) {
                    should.exist(err);
                    done();
                });
            });
        });
    });

    afterEach(function (done) {
        Pv.remove().exec(function () {
            Ap.remove().exec(function () {
                Contact.remove().exec(function () {
                    User.remove().exec(function () {
                        done();
                    });
                });
            });
        });
    });
});
