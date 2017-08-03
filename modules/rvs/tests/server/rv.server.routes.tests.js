'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Rv = mongoose.model('Rv'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  rv;

/**
 * Rv routes tests
 */
describe('Rv CRUD tests', function () {

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

    // Save a user to the test db and create new Rv
    user.save(function () {
      rv = {
        //name: 'Rv name',
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
      };

      done();
    });
  });

  it('should be able to save a Rv if logged in', function (done) {
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

        // Save a new Rv
        agent.post('/api/rvs')
          .send(rv)
          .expect(200)
          .end(function (rvSaveErr, rvSaveRes) {
            // Handle Rv save error
            if (rvSaveErr) {
              return done(rvSaveErr);
            }

            // Get a list of Rvs
            agent.get('/api/rvs')
              .end(function (rvsGetErr, rvsGetRes) {
                // Handle Rvs save error
                if (rvsGetErr) {
                  return done(rvsGetErr);
                }

                // Get Rvs list
                var rvs = rvsGetRes.body;

                // Set assertions
                (rvs[0].user._id).should.equal(userId);
                (rvs[0].docno).should.match('ap1234');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Rv if not logged in', function (done) {
    agent.post('/api/rvs')
      .send(rv)
      .expect(403)
      .end(function (rvSaveErr, rvSaveRes) {
        // Call the assertion callback
        done(rvSaveErr);
      });
  });

  it('should not be able to save an Rv if no docno is provided', function (done) {
    // Invalidate name field
    rv.docno = '';

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

        // Save a new Rv
        agent.post('/api/rvs')
          .send(rv)
          .expect(400)
          .end(function (rvSaveErr, rvSaveRes) {
            // Set message assertion
            (rvSaveRes.body.message).should.match('Please fill Rv docno');

            // Handle Rv save error
            done(rvSaveErr);
          });
      });
  });

  it('should not be able to save an Rv if no docdate is provided', function (done) {
    // Invalidate name field
    rv.docdate = '';

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

        // Save a new Rv
        agent.post('/api/rvs')
          .send(rv)
          .expect(400)
          .end(function (rvSaveErr, rvSaveRes) {
            // Set message assertion
            (rvSaveRes.body.message).should.match('Please fill Rv docdate');

            // Handle Rv save error
            done(rvSaveErr);
          });
      });
  });

  it('should not be able to save an Rv if no contact is provided', function (done) {
    // Invalidate name field
    rv.contact = '';

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

        // Save a new Rv
        agent.post('/api/rvs')
          .send(rv)
          .expect(400)
          .end(function (rvSaveErr, rvSaveRes) {
            // Set message assertion
            (rvSaveRes.body.message).should.match('Please fill Rv contact');

            // Handle Rv save error
            done(rvSaveErr);
          });
      });
  });

  it('should not be able to save an Rv if no items is provided', function (done) {
    // Invalidate name field
    rv.items = [];

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

        // Save a new Rv
        agent.post('/api/rvs')
          .send(rv)
          .expect(400)
          .end(function (rvSaveErr, rvSaveRes) {
            // Set message assertion
            (rvSaveRes.body.message).should.match('Please fill Rv items');

            // Handle Rv save error
            done(rvSaveErr);
          });
      });
  });
  

  it('should be able to update an Rv if signed in', function (done) {
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

        // Save a new Rv
        agent.post('/api/rvs')
          .send(rv)
          .expect(200)
          .end(function (rvSaveErr, rvSaveRes) {
            // Handle Rv save error
            if (rvSaveErr) {
              return done(rvSaveErr);
            }

            // Update Rv name
            rv.docno = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Rv
            agent.put('/api/rvs/' + rvSaveRes.body._id)
              .send(rv)
              .expect(200)
              .end(function (rvUpdateErr, rvUpdateRes) {
                // Handle Rv update error
                if (rvUpdateErr) {
                  return done(rvUpdateErr);
                }

                // Set assertions
                (rvUpdateRes.body._id).should.equal(rvSaveRes.body._id);
                (rvUpdateRes.body.docno).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Rvs if not signed in', function (done) {
    // Create new Rv model instance
    var rvObj = new Rv(rv);

    // Save the rv
    rvObj.save(function () {
      // Request Rvs
      request(app).get('/api/rvs')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Rv if not signed in', function (done) {
    // Create new Rv model instance
    var rvObj = new Rv(rv);

    // Save the Rv
    rvObj.save(function () {
      request(app).get('/api/rvs/' + rvObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('docno', rv.docno);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Rv with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/rvs/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Rv is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Rv which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Rv
    request(app).get('/api/rvs/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Rv with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Rv if signed in', function (done) {
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

        // Save a new Rv
        agent.post('/api/rvs')
          .send(rv)
          .expect(200)
          .end(function (rvSaveErr, rvSaveRes) {
            // Handle Rv save error
            if (rvSaveErr) {
              return done(rvSaveErr);
            }

            // Delete an existing Rv
            agent.delete('/api/rvs/' + rvSaveRes.body._id)
              .send(rv)
              .expect(200)
              .end(function (rvDeleteErr, rvDeleteRes) {
                // Handle rv error error
                if (rvDeleteErr) {
                  return done(rvDeleteErr);
                }

                // Set assertions
                (rvDeleteRes.body._id).should.equal(rvSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Rv if not signed in', function (done) {
    // Set Rv user
    rv.user = user;

    // Create new Rv model instance
    var rvObj = new Rv(rv);

    // Save the Rv
    rvObj.save(function () {
      // Try deleting Rv
      request(app).delete('/api/rvs/' + rvObj._id)
        .expect(403)
        .end(function (rvDeleteErr, rvDeleteRes) {
          // Set message assertion
          (rvDeleteRes.body.message).should.match('User is not authorized');

          // Handle Rv error error
          done(rvDeleteErr);
        });

    });
  });

  it('should be able to get a single Rv that has an orphaned user reference', function (done) {
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

          // Save a new Rv
          agent.post('/api/rvs')
            .send(rv)
            .expect(200)
            .end(function (rvSaveErr, rvSaveRes) {
              // Handle Rv save error
              if (rvSaveErr) {
                return done(rvSaveErr);
              }

              // Set assertions on new Rv
              (rvSaveRes.body.docno).should.equal(rv.docno);
              should.exist(rvSaveRes.body.user);
              should.equal(rvSaveRes.body.user._id, orphanId);

              // force the Rv to have an orphaned user reference
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

                    // Get the Rv
                    agent.get('/api/rvs/' + rvSaveRes.body._id)
                      .expect(200)
                      .end(function (rvInfoErr, rvInfoRes) {
                        // Handle Rv error
                        if (rvInfoErr) {
                          return done(rvInfoErr);
                        }

                        // Set assertions
                        (rvInfoRes.body._id).should.equal(rvSaveRes.body._id);
                        (rvInfoRes.body.docno).should.equal(rv.docno);
                        should.equal(rvInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

     it('middleware read rv', function (done) {
        agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function (signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                    return done(signinErr);
                }

                // Get the userId
                // var userId = user.id;

                // Save a new Ap
                agent.post('/api/rvs')
                    .send(rv)
                    .expect(200)
                    .end(function (rvSaveErr, rvSaveRes) {
                        // Handle Ap save error
                        if (rvSaveErr) {
                            return done(rvSaveErr);
                        }

                        // Get a list of Aps
                        agent.get('/api/reportrvs')
                            .end(function (rvsGetErr, rvsGetRes) {
                                // Handle Aps save error
                                if (rvsGetErr) {
                                    return done(rvsGetErr);
                                }

                                // Get Aps list
                                var rvs = rvsGetRes.body;

                                // Set assertions
                                // (aps[0].user._id).should.equal(userId);
                                (rvs.length).should.match(1);
                                //รับเงิน
                                (rvs[0].debit[0].docdate).should.match(rv.docdate);
                                (rvs[0].debit[0].docref).should.match(rv.docno);
                                (rvs[0].debit[0].accname).should.match(rv.contact); //who??
                                (rvs[0].debit[0].amount).should.match(rv.amount);
                                
                                //เสียเงิน
                                (rvs[0].credit[0].docdate).should.match(rv.docdate);
                                (rvs[0].credit[0].docref).should.match(rv.docno);
                                (rvs[0].credit[0].accname).should.match(rv.items[0].productname); //who??
                                (rvs[0].credit[0].amount).should.match(rv.items[0].amount);

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

  afterEach(function (done) {
    User.remove().exec(function () {
      Rv.remove().exec(done);
    });
  });
});
