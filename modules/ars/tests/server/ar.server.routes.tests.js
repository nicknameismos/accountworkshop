'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Ar = mongoose.model('Ar'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  ar;

/**
 * Ar routes tests
 */
describe('Ar CRUD tests', function () {

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

    // Save a user to the test db and create new Ar
    user.save(function () {
      ar = {
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
      };

      done();
    });
  });

  it('should be able to save a Ar if logged in', function (done) {
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

        // Save a new Ar
        agent.post('/api/ars')
          .send(ar)
          .expect(200)
          .end(function (arSaveErr, arSaveRes) {
            // Handle Ar save error
            if (arSaveErr) {
              return done(arSaveErr);
            }

            // Get a list of Ars
            agent.get('/api/ars')
              .end(function (arsGetErr, arsGetRes) {
                // Handle Ars save error
                if (arsGetErr) {
                  return done(arsGetErr);
                }

                // Get Ars list
                var ars = arsGetRes.body;

                // Set assertions
                (ars[0].user._id).should.equal(userId);
                (ars[0].docno).should.match('ar123');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Ar if not logged in', function (done) {
    agent.post('/api/ars')
      .send(ar)
      .expect(403)
      .end(function (arSaveErr, arSaveRes) {
        // Call the assertion callback
        done(arSaveErr);
      });
  });

  it('should not be able to save an Ar if no docno is provided', function (done) {
    // Invalidate docno field
    ar.docno = '';

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

        // Save a new Ar
        agent.post('/api/ars')
          .send(ar)
          .expect(400)
          .end(function (arSaveErr, arSaveRes) {
            // Set message assertion
            (arSaveRes.body.message).should.match('Please fill Ar Docno');

            // Handle Ar save error
            done(arSaveErr);
          });
      });
  });

  // docdate
  it('should not be able to save an Ar if no docdate is provided', function (done) {
    // Invalidate docdate field
    ar.docdate = '';

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

        // Save a new Ar
        agent.post('/api/ars')
          .send(ar)
          .expect(400)
          .end(function (arSaveErr, arSaveRes) {
            // Set message assertion
            (arSaveRes.body.message).should.match('Please  fill Ar DocDate');

            // Handle Ar save error
            done(arSaveErr);
          });
      });
  });
  //contact
  it('should not be able to save an Ar if no contact is provided', function (done) {
    // Invalidate contact field
    ar.contact = '';

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

        // Save a new Ar
        agent.post('/api/ars')
          .send(ar)
          .expect(400)
          .end(function (arSaveErr, arSaveRes) {
            // Set message assertion
            (arSaveRes.body.message).should.match('Please fill Ar Contact');

            // Handle Ar save error
            done(arSaveErr);
          });
      });
  });
  // items
  it('should not be able to save an Ar if no items is provided', function (done) {
    // Invalidate items field
    ar.items = null;

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

        // Save a new Ar
        agent.post('/api/ars')
          .send(ar)
          .expect(400)
          .end(function (arSaveErr, arSaveRes) {
            // Set message assertion
            (arSaveRes.body.message).should.match('Please fill Ar Items');

            // Handle Ar save error
            done(arSaveErr);
          });
      });
  });

  it('should be able to update an Ar if signed in', function (done) {
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

        // Save a new Ar
        agent.post('/api/ars')
          .send(ar)
          .expect(200)
          .end(function (arSaveErr, arSaveRes) {
            // Handle Ar save error
            if (arSaveErr) {
              return done(arSaveErr);
            }

            // Update Ar docno
            ar.docno = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Ar
            agent.put('/api/ars/' + arSaveRes.body._id)
              .send(ar)
              .expect(200)
              .end(function (arUpdateErr, arUpdateRes) {
                // Handle Ar update error
                if (arUpdateErr) {
                  return done(arUpdateErr);
                }

                // Set assertions
                (arUpdateRes.body._id).should.equal(arSaveRes.body._id);
                (arUpdateRes.body.docno).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Ars if not signed in', function (done) {
    // Create new Ar model instance
    var arObj = new Ar(ar);

    // Save the ar
    arObj.save(function () {
      // Request Ars
      request(app).get('/api/ars')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Ar if not signed in', function (done) {
    // Create new Ar model instance
    var arObj = new Ar(ar);

    // Save the Ar
    arObj.save(function () {
      request(app).get('/api/ars/' + arObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('docno', ar.docno);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Ar with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/ars/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Ar is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Ar which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Ar
    request(app).get('/api/ars/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Ar with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Ar if signed in', function (done) {
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

        // Save a new Ar
        agent.post('/api/ars')
          .send(ar)
          .expect(200)
          .end(function (arSaveErr, arSaveRes) {
            // Handle Ar save error
            if (arSaveErr) {
              return done(arSaveErr);
            }

            // Delete an existing Ar
            agent.delete('/api/ars/' + arSaveRes.body._id)
              .send(ar)
              .expect(200)
              .end(function (arDeleteErr, arDeleteRes) {
                // Handle ar error error
                if (arDeleteErr) {
                  return done(arDeleteErr);
                }

                // Set assertions
                (arDeleteRes.body._id).should.equal(arSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Ar if not signed in', function (done) {
    // Set Ar user
    ar.user = user;

    // Create new Ar model instance
    var arObj = new Ar(ar);

    // Save the Ar
    arObj.save(function () {
      // Try deleting Ar
      request(app).delete('/api/ars/' + arObj._id)
        .expect(403)
        .end(function (arDeleteErr, arDeleteRes) {
          // Set message assertion
          (arDeleteRes.body.message).should.match('User is not authorized');

          // Handle Ar error error
          done(arDeleteErr);
        });

    });
  });

  it('should be able to get a single Ar that has an orphaned user reference', function (done) {
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

          // Save a new Ar
          agent.post('/api/ars')
            .send(ar)
            .expect(200)
            .end(function (arSaveErr, arSaveRes) {
              // Handle Ar save error
              if (arSaveErr) {
                return done(arSaveErr);
              }

              // Set assertions on new Ar
              (arSaveRes.body.docno).should.equal(ar.docno);
              should.exist(arSaveRes.body.user);
              should.equal(arSaveRes.body.user._id, orphanId);

              // force the Ar to have an orphaned user reference
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

                    // Get the Ar
                    agent.get('/api/ars/' + arSaveRes.body._id)
                      .expect(200)
                      .end(function (arInfoErr, arInfoRes) {
                        // Handle Ar error
                        if (arInfoErr) {
                          return done(arInfoErr);
                        }

                        // Set assertions
                        (arInfoRes.body._id).should.equal(arSaveRes.body._id);
                        (arInfoRes.body.docno).should.equal(ar.docno);
                        should.equal(arInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });



  it('middleware read ar', function (done) {
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

        // Save a new Ap
        agent.post('/api/ars')
          .send(ar)
          .expect(200)
          .end(function (arSaveErr, arSaveRes) {
            // Handle Ap save error
            if (arSaveErr) {
              return done(arSaveErr);
            }

            // Get a list of Aps
            agent.get('/api/reportars')
              .end(function (arsGetErr, arsGetRes) {
                // Handle Aps save error
                if (arsGetErr) {
                  return done(arsGetErr);
                }

                // Get Aps list
                var ars = arsGetRes.body;

                // Set assertions
                // (aps[0].user._id).should.equal(userId);
                (ars.length).should.match(1);
                (ars[0].debit[0].docref).should.match(ar.docno);
                (ars[0].debit[0].docdate).should.match(ar.docdate);
                (ars[0].debit[0].accname).should.match(ar.contact);
                (ars[0].debit[0].amount).should.match(ar.amount);
                

                (ars[0].credit[0].docref).should.match(ar.docno);
                (ars[0].credit[0].docdate).should.match(ar.docdate);
                (ars[0].credit[0].accname).should.match(ar.items[0].productname);
                (ars[0].credit[0].amount).should.match(ar.items[0].amount);


                // Call the assertion callback
                done();
              });
          });
      });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Ar.remove().exec(done);
    });
  });
});
