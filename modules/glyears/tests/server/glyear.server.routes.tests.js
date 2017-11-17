'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Glyear = mongoose.model('Glyear'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  glyear;

/**
 * Glyear routes tests
 */
describe('Glyear CRUD tests', function () {

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

    // Save a user to the test db and create new Glyear
    user.save(function () {
      glyear = {
        name: 'Glyear name'
      };

      done();
    });
  });

  it('should be able to save a Glyear if logged in', function (done) {
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

        // Save a new Glyear
        agent.post('/api/glyears')
          .send(glyear)
          .expect(200)
          .end(function (glyearSaveErr, glyearSaveRes) {
            // Handle Glyear save error
            if (glyearSaveErr) {
              return done(glyearSaveErr);
            }

            // Get a list of Glyears
            agent.get('/api/glyears')
              .end(function (glyearsGetErr, glyearsGetRes) {
                // Handle Glyears save error
                if (glyearsGetErr) {
                  return done(glyearsGetErr);
                }

                // Get Glyears list
                var glyears = glyearsGetRes.body;

                // Set assertions
                (glyears[0].user._id).should.equal(userId);
                (glyears[0].name).should.match('Glyear name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Glyear if not logged in', function (done) {
    agent.post('/api/glyears')
      .send(glyear)
      .expect(403)
      .end(function (glyearSaveErr, glyearSaveRes) {
        // Call the assertion callback
        done(glyearSaveErr);
      });
  });

  it('should not be able to save an Glyear if no name is provided', function (done) {
    // Invalidate name field
    glyear.name = '';

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

        // Save a new Glyear
        agent.post('/api/glyears')
          .send(glyear)
          .expect(400)
          .end(function (glyearSaveErr, glyearSaveRes) {
            // Set message assertion
            (glyearSaveRes.body.message).should.match('Please fill Glyear name');

            // Handle Glyear save error
            done(glyearSaveErr);
          });
      });
  });

  it('should be able to update an Glyear if signed in', function (done) {
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

        // Save a new Glyear
        agent.post('/api/glyears')
          .send(glyear)
          .expect(200)
          .end(function (glyearSaveErr, glyearSaveRes) {
            // Handle Glyear save error
            if (glyearSaveErr) {
              return done(glyearSaveErr);
            }

            // Update Glyear name
            glyear.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Glyear
            agent.put('/api/glyears/' + glyearSaveRes.body._id)
              .send(glyear)
              .expect(200)
              .end(function (glyearUpdateErr, glyearUpdateRes) {
                // Handle Glyear update error
                if (glyearUpdateErr) {
                  return done(glyearUpdateErr);
                }

                // Set assertions
                (glyearUpdateRes.body._id).should.equal(glyearSaveRes.body._id);
                (glyearUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Glyears if not signed in', function (done) {
    // Create new Glyear model instance
    var glyearObj = new Glyear(glyear);

    // Save the glyear
    glyearObj.save(function () {
      // Request Glyears
      request(app).get('/api/glyears')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Glyear if not signed in', function (done) {
    // Create new Glyear model instance
    var glyearObj = new Glyear(glyear);

    // Save the Glyear
    glyearObj.save(function () {
      request(app).get('/api/glyears/' + glyearObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', glyear.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Glyear with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/glyears/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Glyear is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Glyear which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Glyear
    request(app).get('/api/glyears/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Glyear with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Glyear if signed in', function (done) {
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

        // Save a new Glyear
        agent.post('/api/glyears')
          .send(glyear)
          .expect(200)
          .end(function (glyearSaveErr, glyearSaveRes) {
            // Handle Glyear save error
            if (glyearSaveErr) {
              return done(glyearSaveErr);
            }

            // Delete an existing Glyear
            agent.delete('/api/glyears/' + glyearSaveRes.body._id)
              .send(glyear)
              .expect(200)
              .end(function (glyearDeleteErr, glyearDeleteRes) {
                // Handle glyear error error
                if (glyearDeleteErr) {
                  return done(glyearDeleteErr);
                }

                // Set assertions
                (glyearDeleteRes.body._id).should.equal(glyearSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Glyear if not signed in', function (done) {
    // Set Glyear user
    glyear.user = user;

    // Create new Glyear model instance
    var glyearObj = new Glyear(glyear);

    // Save the Glyear
    glyearObj.save(function () {
      // Try deleting Glyear
      request(app).delete('/api/glyears/' + glyearObj._id)
        .expect(403)
        .end(function (glyearDeleteErr, glyearDeleteRes) {
          // Set message assertion
          (glyearDeleteRes.body.message).should.match('User is not authorized');

          // Handle Glyear error error
          done(glyearDeleteErr);
        });

    });
  });

  it('should be able to get a single Glyear that has an orphaned user reference', function (done) {
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

          // Save a new Glyear
          agent.post('/api/glyears')
            .send(glyear)
            .expect(200)
            .end(function (glyearSaveErr, glyearSaveRes) {
              // Handle Glyear save error
              if (glyearSaveErr) {
                return done(glyearSaveErr);
              }

              // Set assertions on new Glyear
              (glyearSaveRes.body.name).should.equal(glyear.name);
              should.exist(glyearSaveRes.body.user);
              should.equal(glyearSaveRes.body.user._id, orphanId);

              // force the Glyear to have an orphaned user reference
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

                    // Get the Glyear
                    agent.get('/api/glyears/' + glyearSaveRes.body._id)
                      .expect(200)
                      .end(function (glyearInfoErr, glyearInfoRes) {
                        // Handle Glyear error
                        if (glyearInfoErr) {
                          return done(glyearInfoErr);
                        }

                        // Set assertions
                        (glyearInfoRes.body._id).should.equal(glyearSaveRes.body._id);
                        (glyearInfoRes.body.name).should.equal(glyear.name);
                        should.equal(glyearInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Glyear.remove().exec(done);
    });
  });
});
