'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Glmonth = mongoose.model('Glmonth'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  glmonth;

/**
 * Glmonth routes tests
 */
describe('Glmonth CRUD tests', function () {

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

    // Save a user to the test db and create new Glmonth
    user.save(function () {
      glmonth = {
        name: 'Glmonth name'
      };

      done();
    });
  });

  it('should be able to save a Glmonth if logged in', function (done) {
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

        // Save a new Glmonth
        agent.post('/api/glmonths')
          .send(glmonth)
          .expect(200)
          .end(function (glmonthSaveErr, glmonthSaveRes) {
            // Handle Glmonth save error
            if (glmonthSaveErr) {
              return done(glmonthSaveErr);
            }

            // Get a list of Glmonths
            agent.get('/api/glmonths')
              .end(function (glmonthsGetErr, glmonthsGetRes) {
                // Handle Glmonths save error
                if (glmonthsGetErr) {
                  return done(glmonthsGetErr);
                }

                // Get Glmonths list
                var glmonths = glmonthsGetRes.body;

                // Set assertions
                (glmonths[0].user._id).should.equal(userId);
                (glmonths[0].name).should.match('Glmonth name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Glmonth if not logged in', function (done) {
    agent.post('/api/glmonths')
      .send(glmonth)
      .expect(403)
      .end(function (glmonthSaveErr, glmonthSaveRes) {
        // Call the assertion callback
        done(glmonthSaveErr);
      });
  });

  it('should not be able to save an Glmonth if no name is provided', function (done) {
    // Invalidate name field
    glmonth.name = '';

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

        // Save a new Glmonth
        agent.post('/api/glmonths')
          .send(glmonth)
          .expect(400)
          .end(function (glmonthSaveErr, glmonthSaveRes) {
            // Set message assertion
            (glmonthSaveRes.body.message).should.match('Please fill Glmonth name');

            // Handle Glmonth save error
            done(glmonthSaveErr);
          });
      });
  });

  it('should be able to update an Glmonth if signed in', function (done) {
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

        // Save a new Glmonth
        agent.post('/api/glmonths')
          .send(glmonth)
          .expect(200)
          .end(function (glmonthSaveErr, glmonthSaveRes) {
            // Handle Glmonth save error
            if (glmonthSaveErr) {
              return done(glmonthSaveErr);
            }

            // Update Glmonth name
            glmonth.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Glmonth
            agent.put('/api/glmonths/' + glmonthSaveRes.body._id)
              .send(glmonth)
              .expect(200)
              .end(function (glmonthUpdateErr, glmonthUpdateRes) {
                // Handle Glmonth update error
                if (glmonthUpdateErr) {
                  return done(glmonthUpdateErr);
                }

                // Set assertions
                (glmonthUpdateRes.body._id).should.equal(glmonthSaveRes.body._id);
                (glmonthUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Glmonths if not signed in', function (done) {
    // Create new Glmonth model instance
    var glmonthObj = new Glmonth(glmonth);

    // Save the glmonth
    glmonthObj.save(function () {
      // Request Glmonths
      request(app).get('/api/glmonths')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Glmonth if not signed in', function (done) {
    // Create new Glmonth model instance
    var glmonthObj = new Glmonth(glmonth);

    // Save the Glmonth
    glmonthObj.save(function () {
      request(app).get('/api/glmonths/' + glmonthObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', glmonth.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Glmonth with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/glmonths/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Glmonth is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Glmonth which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Glmonth
    request(app).get('/api/glmonths/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Glmonth with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Glmonth if signed in', function (done) {
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

        // Save a new Glmonth
        agent.post('/api/glmonths')
          .send(glmonth)
          .expect(200)
          .end(function (glmonthSaveErr, glmonthSaveRes) {
            // Handle Glmonth save error
            if (glmonthSaveErr) {
              return done(glmonthSaveErr);
            }

            // Delete an existing Glmonth
            agent.delete('/api/glmonths/' + glmonthSaveRes.body._id)
              .send(glmonth)
              .expect(200)
              .end(function (glmonthDeleteErr, glmonthDeleteRes) {
                // Handle glmonth error error
                if (glmonthDeleteErr) {
                  return done(glmonthDeleteErr);
                }

                // Set assertions
                (glmonthDeleteRes.body._id).should.equal(glmonthSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Glmonth if not signed in', function (done) {
    // Set Glmonth user
    glmonth.user = user;

    // Create new Glmonth model instance
    var glmonthObj = new Glmonth(glmonth);

    // Save the Glmonth
    glmonthObj.save(function () {
      // Try deleting Glmonth
      request(app).delete('/api/glmonths/' + glmonthObj._id)
        .expect(403)
        .end(function (glmonthDeleteErr, glmonthDeleteRes) {
          // Set message assertion
          (glmonthDeleteRes.body.message).should.match('User is not authorized');

          // Handle Glmonth error error
          done(glmonthDeleteErr);
        });

    });
  });

  it('should be able to get a single Glmonth that has an orphaned user reference', function (done) {
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

          // Save a new Glmonth
          agent.post('/api/glmonths')
            .send(glmonth)
            .expect(200)
            .end(function (glmonthSaveErr, glmonthSaveRes) {
              // Handle Glmonth save error
              if (glmonthSaveErr) {
                return done(glmonthSaveErr);
              }

              // Set assertions on new Glmonth
              (glmonthSaveRes.body.name).should.equal(glmonth.name);
              should.exist(glmonthSaveRes.body.user);
              should.equal(glmonthSaveRes.body.user._id, orphanId);

              // force the Glmonth to have an orphaned user reference
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

                    // Get the Glmonth
                    agent.get('/api/glmonths/' + glmonthSaveRes.body._id)
                      .expect(200)
                      .end(function (glmonthInfoErr, glmonthInfoRes) {
                        // Handle Glmonth error
                        if (glmonthInfoErr) {
                          return done(glmonthInfoErr);
                        }

                        // Set assertions
                        (glmonthInfoRes.body._id).should.equal(glmonthSaveRes.body._id);
                        (glmonthInfoRes.body.name).should.equal(glmonth.name);
                        should.equal(glmonthInfoRes.body.user, undefined);

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
      Glmonth.remove().exec(done);
    });
  });
});
