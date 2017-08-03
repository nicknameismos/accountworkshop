'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Rv = mongoose.model('Rv');

/**
 * Globals
 */
var user,
  rv;

/**
 * Unit tests
 */
describe('Rv Model Unit Tests:', function () {
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
      rv = new Rv({
        //name: 'Rv Name',
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
      return rv.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without docno', function (done) {
      rv.docno = '';

      return rv.save(function (err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without docdate', function (done) {
      rv.docdate = '';

      return rv.save(function (err) {
        should.exist(err);
        done();
      });
    });


    it('should be able to show an error when try to save without contact', function (done) {
      rv.contact = '';

      return rv.save(function (err) {
        should.exist(err);
        done();
      });
    });

      it('should be able to show an error when try to save without items', function (done) {
      rv.items = [];

      return rv.save(function (err) {
        should.exist(err);
        done();
      });
    });


  });

  afterEach(function (done) {
    Rv.remove().exec(function () {
      User.remove().exec(function () {
        done();
      });
    });
  });
});
