'use strict';

var should = require('should'),
    request = require('supertest'),
    path = require('path'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Expend = mongoose.model('Expend'),
    express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
    agent,
    credentials,
    user,
    expend;

/**
 * Expend routes tests
 */
describe('Expend CRUD tests', function() {

    before(function(done) {
        // Get application
        app = express.init(mongoose);
        agent = request.agent(app);

        done();
    });

    beforeEach(function(done) {
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

        // Save a user to the test db and create new Expend
        user.save(function() {
            expend = {
                name: 'expend name',
                unitprice: 50,
                vat: 7,
                netamount: 57,
                user: user
            };

            done();
        });
    });

    it('should be able to save a Expend if logged in', function(done) {
        agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                    return done(signinErr);
                }

                // Get the userId
                var userId = user.id;

                // Save a new Expend
                agent.post('/api/expends')
                    .send(expend)
                    .expect(200)
                    .end(function(expendSaveErr, expendSaveRes) {
                        // Handle Expend save error
                        if (expendSaveErr) {
                            return done(expendSaveErr);
                        }

                        // Get a list of Expends
                        agent.get('/api/expends')
                            .end(function(expendsGetErr, expendsGetRes) {
                                // Handle Expends save error
                                if (expendsGetErr) {
                                    return done(expendsGetErr);
                                }

                                // Get Expends list
                                var expends = expendsGetRes.body;

                                // Set assertions
                                (expends[0].user._id).should.equal(userId);
                                (expends[0].name).should.match('expend name');

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should not be able to save an Expend if not logged in', function(done) {
        agent.post('/api/expends')
            .send(expend)
            .expect(403)
            .end(function(expendSaveErr, expendSaveRes) {
                // Call the assertion callback
                done(expendSaveErr);
            });
    });

    it('should not be able to save an Expend if no name is provided', function(done) {
        // Invalidate name field
        expend.name = '';

        agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                    return done(signinErr);
                }

                // Get the userId
                var userId = user.id;

                // Save a new Expend
                agent.post('/api/expends')
                    .send(expend)
                    .expect(400)
                    .end(function(expendSaveErr, expendSaveRes) {
                        // Set message assertion
                        (expendSaveRes.body.message).should.match('Please fill name');

                        // Handle Expend save error
                        done(expendSaveErr);
                    });
            });
    });

    it('should not be able to save an Expend if no unitprice is provided', function(done) {
        // Invalidate unitprice field
        expend.unitprice = null;

        agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                    return done(signinErr);
                }

                // Get the userId
                var userId = user.id;

                // Save a new Expend
                agent.post('/api/expends')
                    .send(expend)
                    .expect(400)
                    .end(function(expendSaveErr, expendSaveRes) {
                        // Set message assertion
                        (expendSaveRes.body.message).should.match('Please fill unitprice');

                        // Handle Expend save error
                        done(expendSaveErr);
                    });
            });
    });

    it('should be able to update an Expend if signed in', function(done) {
        agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                    return done(signinErr);
                }

                // Get the userId
                var userId = user.id;

                // Save a new Expend
                agent.post('/api/expends')
                    .send(expend)
                    .expect(200)
                    .end(function(expendSaveErr, expendSaveRes) {
                        // Handle Expend save error
                        if (expendSaveErr) {
                            return done(expendSaveErr);
                        }

                        // Update Expend name
                        expend.name = 'WHY YOU GOTTA BE SO MEAN?';

                        // Update an existing Expend
                        agent.put('/api/expends/' + expendSaveRes.body._id)
                            .send(expend)
                            .expect(200)
                            .end(function(expendUpdateErr, expendUpdateRes) {
                                // Handle Expend update error
                                if (expendUpdateErr) {
                                    return done(expendUpdateErr);
                                }

                                // Set assertions
                                (expendUpdateRes.body._id).should.equal(expendSaveRes.body._id);
                                (expendUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should be able to get a list of Expends if not signed in', function(done) {
        // Create new Expend model instance
        var expendObj = new Expend(expend);

        // Save the expend
        expendObj.save(function() {
            // Request Expends
            request(app).get('/api/expends')
                .end(function(req, res) {
                    // Set assertion
                    res.body.should.be.instanceof(Array).and.have.lengthOf(1);

                    // Call the assertion callback
                    done();
                });

        });
    });

    it('should be able to get a single Expend if not signed in', function(done) {
        // Create new Expend model instance
        var expendObj = new Expend(expend);

        // Save the Expend
        expendObj.save(function() {
            request(app).get('/api/expends/' + expendObj._id)
                .end(function(req, res) {
                    // Set assertion
                    res.body.should.be.instanceof(Object).and.have.property('name', expend.name);

                    // Call the assertion callback
                    done();
                });
        });
    });

    it('should return proper error for single Expend with an invalid Id, if not signed in', function(done) {
        // test is not a valid mongoose Id
        request(app).get('/api/expends/test')
            .end(function(req, res) {
                // Set assertion
                res.body.should.be.instanceof(Object).and.have.property('message', 'Expend is invalid');

                // Call the assertion callback
                done();
            });
    });

    it('should return proper error for single Expend which doesnt exist, if not signed in', function(done) {
        // This is a valid mongoose Id but a non-existent Expend
        request(app).get('/api/expends/559e9cd815f80b4c256a8f41')
            .end(function(req, res) {
                // Set assertion
                res.body.should.be.instanceof(Object).and.have.property('message', 'No Expend with that identifier has been found');

                // Call the assertion callback
                done();
            });
    });

    it('should be able to delete an Expend if signed in', function(done) {
        agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                    return done(signinErr);
                }

                // Get the userId
                var userId = user.id;

                // Save a new Expend
                agent.post('/api/expends')
                    .send(expend)
                    .expect(200)
                    .end(function(expendSaveErr, expendSaveRes) {
                        // Handle Expend save error
                        if (expendSaveErr) {
                            return done(expendSaveErr);
                        }

                        // Delete an existing Expend
                        agent.delete('/api/expends/' + expendSaveRes.body._id)
                            .send(expend)
                            .expect(200)
                            .end(function(expendDeleteErr, expendDeleteRes) {
                                // Handle expend error error
                                if (expendDeleteErr) {
                                    return done(expendDeleteErr);
                                }

                                // Set assertions
                                (expendDeleteRes.body._id).should.equal(expendSaveRes.body._id);

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should not be able to delete an Expend if not signed in', function(done) {
        // Set Expend user
        expend.user = user;

        // Create new Expend model instance
        var expendObj = new Expend(expend);

        // Save the Expend
        expendObj.save(function() {
            // Try deleting Expend
            request(app).delete('/api/expends/' + expendObj._id)
                .expect(403)
                .end(function(expendDeleteErr, expendDeleteRes) {
                    // Set message assertion
                    (expendDeleteRes.body.message).should.match('User is not authorized');

                    // Handle Expend error error
                    done(expendDeleteErr);
                });

        });
    });

    it('should be able to get a single Expend that has an orphaned user reference', function(done) {
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

        _orphan.save(function(err, orphan) {
            // Handle save error
            if (err) {
                return done(err);
            }

            agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function(signinErr, signinRes) {
                    // Handle signin error
                    if (signinErr) {
                        return done(signinErr);
                    }

                    // Get the userId
                    var orphanId = orphan._id;

                    // Save a new Expend
                    agent.post('/api/expends')
                        .send(expend)
                        .expect(200)
                        .end(function(expendSaveErr, expendSaveRes) {
                            // Handle Expend save error
                            if (expendSaveErr) {
                                return done(expendSaveErr);
                            }

                            // Set assertions on new Expend
                            (expendSaveRes.body.name).should.equal(expend.name);
                            should.exist(expendSaveRes.body.user);
                            should.equal(expendSaveRes.body.user._id, orphanId);

                            // force the Expend to have an orphaned user reference
                            orphan.remove(function() {
                                // now signin with valid user
                                agent.post('/api/auth/signin')
                                    .send(credentials)
                                    .expect(200)
                                    .end(function(err, res) {
                                        // Handle signin error
                                        if (err) {
                                            return done(err);
                                        }

                                        // Get the Expend
                                        agent.get('/api/expends/' + expendSaveRes.body._id)
                                            .expect(200)
                                            .end(function(expendInfoErr, expendInfoRes) {
                                                // Handle Expend error
                                                if (expendInfoErr) {
                                                    return done(expendInfoErr);
                                                }

                                                // Set assertions
                                                (expendInfoRes.body._id).should.equal(expendSaveRes.body._id);
                                                (expendInfoRes.body.name).should.equal(expend.name);
                                                should.equal(expendInfoRes.body.user, undefined);

                                                // Call the assertion callback
                                                done();
                                            });
                                    });
                            });
                        });
                });
        });
    });

    afterEach(function(done) {
        User.remove().exec(function() {
            Expend.remove().exec(done);
        });
    });
});