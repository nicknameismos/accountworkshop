'use strict';

var should = require('should'),
    request = require('supertest'),
    path = require('path'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Ap = mongoose.model('Ap'),
    express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
    agent,
    credentials,
    user,
    ap;

/**
 * Ap routes tests
 */
describe('Ap CRUD tests', function () {

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

        // Save a user to the test db and create new Ap
        user.save(function () {
            ap = {
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

    it('should be able to save a Ap if logged in', function (done) {
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
                agent.post('/api/aps')
                    .send(ap)
                    .expect(200)
                    .end(function (apSaveErr, apSaveRes) {
                        // Handle Ap save error
                        if (apSaveErr) {
                            return done(apSaveErr);
                        }

                        // Get a list of Aps
                        agent.get('/api/aps')
                            .end(function (apsGetErr, apsGetRes) {
                                // Handle Aps save error
                                if (apsGetErr) {
                                    return done(apsGetErr);
                                }

                                // Get Aps list
                                var aps = apsGetRes.body;

                                // Set assertions
                                (aps[0].user._id).should.equal(userId);
                                (aps[0].docno).should.match('ap1234');

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should not be able to save an Ap if not logged in', function (done) {
        agent.post('/api/aps')
            .send(ap)
            .expect(403)
            .end(function (apSaveErr, apSaveRes) {
                // Call the assertion callback
                done(apSaveErr);
            });
    });

    it('should not be able to save an Ap if no docno is provided', function (done) {
        // Invalidate name field
        ap.docno = '';

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
                agent.post('/api/aps')
                    .send(ap)
                    .expect(400)
                    .end(function (apSaveErr, apSaveRes) {
                        // Set message assertion
                        (apSaveRes.body.message).should.match('Please fill Ap docno');

                        // Handle Ap save error
                        done(apSaveErr);
                    });
            });
    });

    it('should not be able to save an Ap if no docdate is provided', function (done) {
        // Invalidate name field
        ap.docdate = null;

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
                agent.post('/api/aps')
                    .send(ap)
                    .expect(400)
                    .end(function (apSaveErr, apSaveRes) {
                        // Set message assertion
                        (apSaveRes.body.message).should.match('Please fill Ap docdate');

                        // Handle Ap save error
                        done(apSaveErr);
                    });
            });
    });

    it('should not be able to save an Ap if no contact is provided', function (done) {
        // Invalidate name field
        ap.contact = '';

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
                agent.post('/api/aps')
                    .send(ap)
                    .expect(400)
                    .end(function (apSaveErr, apSaveRes) {
                        // Set message assertion
                        (apSaveRes.body.message).should.match('Please fill Ap contact');

                        // Handle Ap save error
                        done(apSaveErr);
                    });
            });
    });

    it('should not be able to save an Ap if no items is provided', function (done) {
        // Invalidate name field
        ap.items = null;

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
                agent.post('/api/aps')
                    .send(ap)
                    .expect(400)
                    .end(function (apSaveErr, apSaveRes) {
                        // Set message assertion
                        (apSaveRes.body.message).should.match('Please fill Ap items');

                        // Handle Ap save error
                        done(apSaveErr);
                    });
            });
    });

    it('should be able to update an Ap if signed in', function (done) {
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
                agent.post('/api/aps')
                    .send(ap)
                    .expect(200)
                    .end(function (apSaveErr, apSaveRes) {
                        // Handle Ap save error
                        if (apSaveErr) {
                            return done(apSaveErr);
                        }

                        // Update Ap name
                        ap.docno = 'WHY YOU GOTTA BE SO MEAN?';

                        // Update an existing Ap
                        agent.put('/api/aps/' + apSaveRes.body._id)
                            .send(ap)
                            .expect(200)
                            .end(function (apUpdateErr, apUpdateRes) {
                                // Handle Ap update error
                                if (apUpdateErr) {
                                    return done(apUpdateErr);
                                }

                                // Set assertions
                                (apUpdateRes.body._id).should.equal(apSaveRes.body._id);
                                (apUpdateRes.body.docno).should.match('WHY YOU GOTTA BE SO MEAN?');

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should be able to get a list of Aps if not signed in', function (done) {
        // Create new Ap model instance
        var apObj = new Ap(ap);

        // Save the ap
        apObj.save(function () {
            // Request Aps
            request(app).get('/api/aps')
                .end(function (req, res) {
                    // Set assertion
                    res.body.should.be.instanceof(Array).and.have.lengthOf(1);

                    // Call the assertion callback
                    done();
                });

        });
    });

    it('should be able to get a single Ap if not signed in', function (done) {
        // Create new Ap model instance
        var apObj = new Ap(ap);

        // Save the Ap
        apObj.save(function () {
            request(app).get('/api/aps/' + apObj._id)
                .end(function (req, res) {
                    // Set assertion
                    res.body.should.be.instanceof(Object).and.have.property('docno', ap.docno);

                    // Call the assertion callback
                    done();
                });
        });
    });

    it('should return proper error for single Ap with an invalid Id, if not signed in', function (done) {
        // test is not a valid mongoose Id
        request(app).get('/api/aps/test')
            .end(function (req, res) {
                // Set assertion
                res.body.should.be.instanceof(Object).and.have.property('message', 'Ap is invalid');

                // Call the assertion callback
                done();
            });
    });

    it('should return proper error for single Ap which doesnt exist, if not signed in', function (done) {
        // This is a valid mongoose Id but a non-existent Ap
        request(app).get('/api/aps/559e9cd815f80b4c256a8f41')
            .end(function (req, res) {
                // Set assertion
                res.body.should.be.instanceof(Object).and.have.property('message', 'No Ap with that identifier has been found');

                // Call the assertion callback
                done();
            });
    });

    it('should be able to delete an Ap if signed in', function (done) {
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
                agent.post('/api/aps')
                    .send(ap)
                    .expect(200)
                    .end(function (apSaveErr, apSaveRes) {
                        // Handle Ap save error
                        if (apSaveErr) {
                            return done(apSaveErr);
                        }

                        // Delete an existing Ap
                        agent.delete('/api/aps/' + apSaveRes.body._id)
                            .send(ap)
                            .expect(200)
                            .end(function (apDeleteErr, apDeleteRes) {
                                // Handle ap error error
                                if (apDeleteErr) {
                                    return done(apDeleteErr);
                                }

                                // Set assertions
                                (apDeleteRes.body._id).should.equal(apSaveRes.body._id);

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should not be able to delete an Ap if not signed in', function (done) {
        // Set Ap user
        ap.user = user;

        // Create new Ap model instance
        var apObj = new Ap(ap);

        // Save the Ap
        apObj.save(function () {
            // Try deleting Ap
            request(app).delete('/api/aps/' + apObj._id)
                .expect(403)
                .end(function (apDeleteErr, apDeleteRes) {
                    // Set message assertion
                    (apDeleteRes.body.message).should.match('User is not authorized');

                    // Handle Ap error error
                    done(apDeleteErr);
                });

        });
    });

    it('should be able to get a single Ap that has an orphaned user reference', function (done) {
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

                    // Save a new Ap
                    agent.post('/api/aps')
                        .send(ap)
                        .expect(200)
                        .end(function (apSaveErr, apSaveRes) {
                            // Handle Ap save error
                            if (apSaveErr) {
                                return done(apSaveErr);
                            }

                            // Set assertions on new Ap
                            (apSaveRes.body.docno).should.equal(ap.docno);
                            should.exist(apSaveRes.body.user);
                            should.equal(apSaveRes.body.user._id, orphanId);

                            // force the Ap to have an orphaned user reference
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

                                        // Get the Ap
                                        agent.get('/api/aps/' + apSaveRes.body._id)
                                            .expect(200)
                                            .end(function (apInfoErr, apInfoRes) {
                                                // Handle Ap error
                                                if (apInfoErr) {
                                                    return done(apInfoErr);
                                                }

                                                // Set assertions
                                                (apInfoRes.body._id).should.equal(apSaveRes.body._id);
                                                (apInfoRes.body.docno).should.equal(ap.docno);
                                                should.equal(apInfoRes.body.user, undefined);

                                                // Call the assertion callback
                                                done();
                                            });
                                    });
                            });
                        });
                });
        });
    });

    it('middleware read ap', function (done) {
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
                agent.post('/api/aps')
                    .send(ap)
                    .expect(200)
                    .end(function (apSaveErr, apSaveRes) {
                        // Handle Ap save error
                        if (apSaveErr) {
                            return done(apSaveErr);
                        }

                        // Get a list of Aps
                        agent.get('/api/reportaps')
                            .end(function (apsGetErr, apsGetRes) {
                                // Handle Aps save error
                                if (apsGetErr) {
                                    return done(apsGetErr);
                                }

                                // Get Aps list
                                var aps = apsGetRes.body;

                                // Set assertions
                                // (aps[0].user._id).should.equal(userId);
                                (aps.length).should.match(1);

                                (aps[0].debit[0].docdate).should.match(ap.docdate);
                                (aps[0].debit[0].docref).should.match(ap.docno);
                                (aps[0].debit[0].accname).should.match(ap.items[0].productname);
                                (aps[0].debit[0].amount).should.match(ap.items[0].amount);

                                (aps[0].credit[0].docdate).should.match(ap.docdate);
                                (aps[0].credit[0].docref).should.match(ap.docno);
                                (aps[0].credit[0].accname).should.match(ap.contact);
                                (aps[0].credit[0].amount).should.match(ap.amount);
                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    afterEach(function (done) {
        User.remove().exec(function () {
            Ap.remove().exec(done);
        });
    });
});
