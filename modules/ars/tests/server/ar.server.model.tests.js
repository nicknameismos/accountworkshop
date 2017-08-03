'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Ar = mongoose.model('Ar');

/**
 * Globals
 */
var user,
  ar;

/**
 * Unit tests
 */
describe('Ar Model Unit Tests:', function () {
  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function () {
      ar = new Ar({
        docno: 'ar123',
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

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(0);
      return ar.save(function (err) {
        should.not.exist(err);
        done();
      });
    });
    // docno save test
    it('should be able to show an error when try to save without docno', function (done) {
      ar.docno = '';

      return ar.save(function (err) {
        should.exist(err);
        done();
      });
    });
// docdate  save test
 it('should be able to show an error when try to save without docdate', function (done) {
      ar.docdate = Date;

      return ar.save(function (err) {
        should.exist(err);
        done();
      });
    });
// contact save test
it('should be able to show an error when try to save without contact', function (done) {
      ar.contact = '';

      return ar.save(function (err) {
        should.exist(err);
        done();
      });
    });
// items save test
it('should be able to show an error when try to save without items', function (done) {
      ar.items = [{
        productname: 'longan',
        unitprice: 50,
        qty: 10,
        amount: 500
      }];

      return ar.save(function (err) {
        should.not.exist(err);
        done();
      });
    });







  });

  afterEach(function (done) {
    Ar.remove().exec(function () {
      User.remove().exec(function () {
        done();
      });
    });
  });
});
