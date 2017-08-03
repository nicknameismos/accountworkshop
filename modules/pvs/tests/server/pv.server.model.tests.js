'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Pv = mongoose.model('Pv');

/**
 * Globals
 */
var user,
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

    user.save(function () {
      pv = new Pv({
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
      pv.contact = '';
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
      User.remove().exec(function () {
        done();
      });
    });
  });
});
