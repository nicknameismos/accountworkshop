'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Jv = mongoose.model('Jv');

/**
 * Globals
 */
var user,
  jv;

/**
 * Unit tests
 */
describe('Jv Model Unit Tests:', function() {
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
      jv = new Jv({
        docno: 'jv1234',
        docdate: new Date(),
        debits: [{
          accname: 'c@net',
          description: 'test',
          amount: 200
        }],
        credits:[{
          accname: 'product',
          description: 'test2',
          amount: 0
        }],
        debitamount: 200,
        creditamount: 0,
        remark:'remark',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return jv.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without docno', function(done) {
      jv.docno = '';

      return jv.save(function(err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without docdate', function(done) {
      jv.docdate = '';

      return jv.save(function(err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without debits', function(done) {
      jv.debits = null;

      return jv.save(function(err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without credits', function(done) {
      jv.credits = null;

      return jv.save(function(err) {
        should.exist(err);
        done();
      });
    });

  });

  afterEach(function(done) {
    Jv.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});
