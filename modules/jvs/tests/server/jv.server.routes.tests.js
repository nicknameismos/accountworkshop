'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Jv = mongoose.model('Jv'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  jv;

/**
 * Jv routes tests
 */
describe('Jv CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Jv
    user.save(function () {
      jv = {
        docno: 'jv1234',
        docdate: new Date(),
        debits: [{
          accname: 'c@net',
          description: 'test',
          amount: 200
        }],
        credits: [{
          accname: 'product',
          description: 'test2',
          amount: 0
        }],
        debitamount: 200,
        creditamount: 0,
        remark: 'remark'
      };

      done();
    });
  });

  it('should be able to save a Jv if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Jv
        agent.post('/api/jvs')
          .send(jv)
          .expect(200)
          .end(function (jvSaveErr, jvSaveRes) {
            // Handle Jv save error
            if (jvSaveErr) {
              return done(jvSaveErr);
            }

            // Get a list of Jvs
            agent.get('/api/jvs')
              .end(function (jvsGetErr, jvsGetRes) {
                // Handle Jvs save error
                if (jvsGetErr) {
                  return done(jvsGetErr);
                }

                // Get Jvs list
                var jvs = jvsGetRes.body;

                // Set assertions
                (jvs[0].user._id).should.equal(userId);
                (jvs[0].docno).should.match('jv1234');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Jv if not logged in', function (done) {
    agent.post('/api/jvs')
      .send(jv)
      .expect(403)
      .end(function (jvSaveErr, jvSaveRes) {
        // Call the assertion callback
        done(jvSaveErr);
      });
  });

  it('should not be able to save an Jv if no docno is provided', function (done) {
    // Invalidate name field
    jv.docno = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Jv
        agent.post('/api/jvs')
          .send(jv)
          .expect(400)
          .end(function (jvSaveErr, jvSaveRes) {
            // Set message assertion
            (jvSaveRes.body.message).should.match('Please fill Jv docno');

            // Handle Jv save error
            done(jvSaveErr);
          });
      });
  });

  it('should not be able to save an Jv if no docdate is provided', function (done) {
    // Invalidate name field
    jv.docdate = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Jv
        agent.post('/api/jvs')
          .send(jv)
          .expect(400)
          .end(function (jvSaveErr, jvSaveRes) {
            // Set message assertion
            (jvSaveRes.body.message).should.match('Please fill Jv docdate');

            // Handle Jv save error
            done(jvSaveErr);
          });
      });
  });

  it('should not be able to save an Jv if no debits is provided', function (done) {
    // Invalidate name field
    jv.debits = null;

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Jv
        agent.post('/api/jvs')
          .send(jv)
          .expect(400)
          .end(function (jvSaveErr, jvSaveRes) {
            // Set message assertion
            (jvSaveRes.body.message).should.match('Please fill Jv debit');

            // Handle Jv save error
            done(jvSaveErr);
          });
      });
  });

  it('should not be able to save an Jv if no credits is provided', function (done) {
    // Invalidate name field
    jv.credits = null;

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Jv
        agent.post('/api/jvs')
          .send(jv)
          .expect(400)
          .end(function (jvSaveErr, jvSaveRes) {
            // Set message assertion
            (jvSaveRes.body.message).should.match('Please fill Jv credit');

            // Handle Jv save error
            done(jvSaveErr);
          });
      });
  });

  it('should be able to update an Jv if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Jv
        agent.post('/api/jvs')
          .send(jv)
          .expect(200)
          .end(function (jvSaveErr, jvSaveRes) {
            // Handle Jv save error
            if (jvSaveErr) {
              return done(jvSaveErr);
            }

            // Update Jv name
            jv.docno = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Jv
            agent.put('/api/jvs/' + jvSaveRes.body._id)
              .send(jv)
              .expect(200)
              .end(function (jvUpdateErr, jvUpdateRes) {
                // Handle Jv update error
                if (jvUpdateErr) {
                  return done(jvUpdateErr);
                }

                // Set assertions
                (jvUpdateRes.body._id).should.equal(jvSaveRes.body._id);
                (jvUpdateRes.body.docno).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Jvs if not signed in', function (done) {
    // Create new Jv model instance
    var jvObj = new Jv(jv);

    // Save the jv
    jvObj.save(function () {
      // Request Jvs
      request(app).get('/api/jvs')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Jv if not signed in', function (done) {
    // Create new Jv model instance
    var jvObj = new Jv(jv);

    // Save the Jv
    jvObj.save(function () {
      request(app).get('/api/jvs/' + jvObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('docno', jv.docno);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Jv with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/jvs/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Jv is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Jv which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Jv
    request(app).get('/api/jvs/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Jv with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Jv if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Jv
        agent.post('/api/jvs')
          .send(jv)
          .expect(200)
          .end(function (jvSaveErr, jvSaveRes) {
            // Handle Jv save error
            if (jvSaveErr) {
              return done(jvSaveErr);
            }

            // Delete an existing Jv
            agent.delete('/api/jvs/' + jvSaveRes.body._id)
              .send(jv)
              .expect(200)
              .end(function (jvDeleteErr, jvDeleteRes) {
                // Handle jv error error
                if (jvDeleteErr) {
                  return done(jvDeleteErr);
                }

                // Set assertions
                (jvDeleteRes.body._id).should.equal(jvSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Jv if not signed in', function (done) {
    // Set Jv user
    jv.user = user;

    // Create new Jv model instance
    var jvObj = new Jv(jv);

    // Save the Jv
    jvObj.save(function () {
      // Try deleting Jv
      request(app).delete('/api/jvs/' + jvObj._id)
        .expect(403)
        .end(function (jvDeleteErr, jvDeleteRes) {
          // Set message assertion
          (jvDeleteRes.body.message).should.match('User is not authorized');

          // Handle Jv error error
          done(jvDeleteErr);
        });

    });
  });

  it('should be able to get a single Jv that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Jv
          agent.post('/api/jvs')
            .send(jv)
            .expect(200)
            .end(function (jvSaveErr, jvSaveRes) {
              // Handle Jv save error
              if (jvSaveErr) {
                return done(jvSaveErr);
              }

              // Set assertions on new Jv
              (jvSaveRes.body.docno).should.equal(jv.docno);
              should.exist(jvSaveRes.body.user);
              should.equal(jvSaveRes.body.user._id, orphanId);

              // force the Jv to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Jv
                    agent.get('/api/jvs/' + jvSaveRes.body._id)
                      .expect(200)
                      .end(function (jvInfoErr, jvInfoRes) {
                        // Handle Jv error
                        if (jvInfoErr) {
                          return done(jvInfoErr);
                        }

                        // Set assertions
                        (jvInfoRes.body._id).should.equal(jvSaveRes.body._id);
                        (jvInfoRes.body.docno).should.equal(jv.docno);
                        should.equal(jvInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('JV report', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Jv
        agent.post('/api/jvs')
          .send(jv)
          .expect(200)
          .end(function (jvSaveErr, jvSaveRes) {
            // Handle Jv save error
            if (jvSaveErr) {
              return done(jvSaveErr);
            }

            // Get a list of Jvs
            agent.get('/api/reportjvs')
              .end(function (jvsGetErr, jvsGetRes) {
                // Handle Jvs save error
                if (jvsGetErr) {
                  return done(jvsGetErr);
                }

                // Get Jvs list
                var jvs = jvsGetRes.body;

                // Set assertions
                // (jvs).should.match('');

                // (jvs[0].user._id).should.equal(userId);
                (jvs[0].debit[0].docdate).should.match(jv.docdate);
                (jvs[0].debit[0].docref).should.match(jv.docno);
                (jvs[0].debit[0].accname).should.match(jv.debits[0].accname);
                (jvs[0].debit[0].amount).should.match(jv.debits[0].amount);

                (jvs[0].credit[0].docdate).should.match(jv.docdate);
                (jvs[0].credit[0].docref).should.match(jv.docno);
                (jvs[0].credit[0].accname).should.match(jv.credits[0].accname);
                (jvs[0].credit[0].amount).should.match(jv.credits[0].amount);


                // Call the assertion callback
                done();
              });
          });
      });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Jv.remove().exec(done);
    });
  });
});
