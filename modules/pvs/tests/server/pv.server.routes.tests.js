'use strict';

var should = require('should'),
    request = require('supertest'),
    path = require('path'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Pv = mongoose.model('Pv'),
    Contact = mongoose.model('Contact'),
    Ap = mongoose.model('Ap'),
    express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
    agent,
    credentials,
    contact,
    ap,
    user,
    pv;

/**
 * Pv routes tests
 */
describe('Pv CRUD tests', function() {

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

        contact = new Contact({
            name: 'Contact name',
            govermentId: '123458999',
            email: 'account@gmail.com',
            tel: '0894447208',
            address: {
                address: '55/9',
                subdistrict: 'lumlukka',
                district: 'lumlukka',
                province: 'prathumtani',
                postcode: '12150'
            }
        });

        ap = new Ap({
            docno: 'ap1234',
            docdate: new Date(),
            contact: contact,
            items: [{
                productname: 'longan',
                unitprice: 50,
                qty: 10,
                amount: 500,
                vat: 7
            }],
            amount: 500,
            totalamount: 535,
            discount: 100,
            netamount: 435
        });

        // Save a user to the test db and create new Pv
        user.save(function() {
            contact.save(function() {
                ap.save(function() {
                    pv = {
                        docno: 'ap1234',
                        docdate: new Date(),
                        contact: contact,
                        items: [{
                            aps: ap
                        }],
                        status: 'wait',
                        discount: 100,
                        user: user
                    };
                    done();
                });
            });
        });
    });

    it('should be able to save a Pv if logged in', function(done) {
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

                // Save a new Pv
                agent.post('/api/pvs')
                    .send(pv)
                    .expect(200)
                    .end(function(pvSaveErr, pvSaveRes) {
                        // Handle Pv save error
                        if (pvSaveErr) {
                            return done(pvSaveErr);
                        }

                        // Get a list of Pvs
                        agent.get('/api/pvs')
                            .end(function(pvsGetErr, pvsGetRes) {
                                // Handle Pvs save error
                                if (pvsGetErr) {
                                    return done(pvsGetErr);
                                }

                                // Get Pvs list
                                var pvs = pvsGetRes.body;

                                // Set assertions
                                (pvs[0].user._id).should.equal(userId);
                                (pvs[0].docno).should.match('ap1234');
                                (pvs[0].amount).should.match(435);
                                (pvs[0].netamount).should.match(335);

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should not be able to save an Pv if not logged in', function(done) {
        agent.post('/api/pvs')
            .send(pv)
            .expect(403)
            .end(function(pvSaveErr, pvSaveRes) {
                // Call the assertion callback
                done(pvSaveErr);
            });
    });

    it('should not be able to save an Pv if no docno is provided', function(done) {
        // Invalidate name field
        pv.docno = '';

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

                // Save a new Pv
                agent.post('/api/pvs')
                    .send(pv)
                    .expect(400)
                    .end(function(pvSaveErr, pvSaveRes) {
                        // Set message assertion
                        (pvSaveRes.body.message).should.match('Please fill Pv docno');

                        // Handle Pv save error
                        done(pvSaveErr);
                    });
            });
    });

    it('should not be able to save an Pv if no docdate is provided', function(done) {
        // Invalidate name field
        pv.docdate = '';

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

                // Save a new Pv
                agent.post('/api/pvs')
                    .send(pv)
                    .expect(400)
                    .end(function(pvSaveErr, pvSaveRes) {
                        // Set message assertion
                        (pvSaveRes.body.message).should.match('Please fill Pv docdate');

                        // Handle Pv save error
                        done(pvSaveErr);
                    });
            });
    });

    it('should not be able to save an Pv if no contact is provided', function(done) {
        // Invalidate name field
        pv.contact = null;

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

                // Save a new Pv
                agent.post('/api/pvs')
                    .send(pv)
                    .expect(400)
                    .end(function(pvSaveErr, pvSaveRes) {
                        // Set message assertion
                        (pvSaveRes.body.message).should.match('Please fill Pv contact');

                        // Handle Pv save error
                        done(pvSaveErr);
                    });
            });
    });

    it('should not be able to save an Pv if no items is provided', function(done) {
        // Invalidate name field
        pv.items = null;

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

                // Save a new Pv
                agent.post('/api/pvs')
                    .send(pv)
                    .expect(400)
                    .end(function(pvSaveErr, pvSaveRes) {
                        // Set message assertion
                        (pvSaveRes.body.message).should.match('Please fill Pv items');

                        // Handle Pv save error
                        done(pvSaveErr);
                    });
            });
    });


    it('should be able to update an Pv if signed in', function(done) {
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

                // Save a new Pv
                agent.post('/api/pvs')
                    .send(pv)
                    .expect(200)
                    .end(function(pvSaveErr, pvSaveRes) {
                        // Handle Pv save error
                        if (pvSaveErr) {
                            return done(pvSaveErr);
                        }

                        // Update Pv name
                        pv.docno = 'WHY YOU GOTTA BE SO MEAN?';

                        // Update an existing Pv
                        agent.put('/api/pvs/' + pvSaveRes.body._id)
                            .send(pv)
                            .expect(200)
                            .end(function(pvUpdateErr, pvUpdateRes) {
                                // Handle Pv update error
                                if (pvUpdateErr) {
                                    return done(pvUpdateErr);
                                }

                                // Set assertions
                                (pvUpdateRes.body._id).should.equal(pvSaveRes.body._id);
                                (pvUpdateRes.body.docno).should.match('WHY YOU GOTTA BE SO MEAN?');

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should be able to get a list of Pvs if not signed in', function(done) {
        // Create new Pv model instance
        var pvObj = new Pv(pv);

        // Save the pv
        pvObj.save(function() {
            // Request Pvs
            request(app).get('/api/pvs')
                .end(function(req, res) {
                    // Set assertion
                    res.body.should.be.instanceof(Array).and.have.lengthOf(1);

                    // Call the assertion callback
                    done();
                });

        });
    });

    it('should be able to get a single Pv if not signed in', function(done) {
        // Create new Pv model instance
        var pvObj = new Pv(pv);

        // Save the Pv
        pvObj.save(function() {
            request(app).get('/api/pvs/' + pvObj._id)
                .end(function(req, res) {
                    // Set assertion
                    res.body.should.be.instanceof(Object).and.have.property('docno', pv.docno);

                    // Call the assertion callback
                    done();
                });
        });
    });

    it('should return proper error for single Pv with an invalid Id, if not signed in', function(done) {
        // test is not a valid mongoose Id
        request(app).get('/api/pvs/test')
            .end(function(req, res) {
                // Set assertion
                res.body.should.be.instanceof(Object).and.have.property('message', 'Pv is invalid');

                // Call the assertion callback
                done();
            });
    });

    it('should return proper error for single Pv which doesnt exist, if not signed in', function(done) {
        // This is a valid mongoose Id but a non-existent Pv
        request(app).get('/api/pvs/559e9cd815f80b4c256a8f41')
            .end(function(req, res) {
                // Set assertion
                res.body.should.be.instanceof(Object).and.have.property('message', 'No Pv with that identifier has been found');

                // Call the assertion callback
                done();
            });
    });

    it('should be able to delete an Pv if signed in', function(done) {
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

                // Save a new Pv
                agent.post('/api/pvs')
                    .send(pv)
                    .expect(200)
                    .end(function(pvSaveErr, pvSaveRes) {
                        // Handle Pv save error
                        if (pvSaveErr) {
                            return done(pvSaveErr);
                        }

                        // Delete an existing Pv
                        agent.delete('/api/pvs/' + pvSaveRes.body._id)
                            .send(pv)
                            .expect(200)
                            .end(function(pvDeleteErr, pvDeleteRes) {
                                // Handle pv error error
                                if (pvDeleteErr) {
                                    return done(pvDeleteErr);
                                }

                                // Set assertions
                                (pvDeleteRes.body._id).should.equal(pvSaveRes.body._id);

                                // Call the assertion callback
                                done();
                            });
                    });
            });
    });

    it('should not be able to delete an Pv if not signed in', function(done) {
        // Set Pv user
        pv.user = user;

        // Create new Pv model instance
        var pvObj = new Pv(pv);

        // Save the Pv
        pvObj.save(function() {
            // Try deleting Pv
            request(app).delete('/api/pvs/' + pvObj._id)
                .expect(403)
                .end(function(pvDeleteErr, pvDeleteRes) {
                    // Set message assertion
                    (pvDeleteRes.body.message).should.match('User is not authorized');

                    // Handle Pv error error
                    done(pvDeleteErr);
                });

        });
    });

    it('should be able to get a single Pv that has an orphaned user reference', function(done) {
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

                    // Save a new Pv
                    agent.post('/api/pvs')
                        .send(pv)
                        .expect(200)
                        .end(function(pvSaveErr, pvSaveRes) {
                            // Handle Pv save error
                            if (pvSaveErr) {
                                return done(pvSaveErr);
                            }

                            // Set assertions on new Pv
                            (pvSaveRes.body.docno).should.equal(pv.docno);
                            should.exist(pvSaveRes.body.user);
                            should.equal(pvSaveRes.body.user._id, orphanId);

                            // force the Pv to have an orphaned user reference
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

                                        // Get the Pv
                                        agent.get('/api/pvs/' + pvSaveRes.body._id)
                                            .expect(200)
                                            .end(function(pvInfoErr, pvInfoRes) {
                                                // Handle Pv error
                                                if (pvInfoErr) {
                                                    return done(pvInfoErr);
                                                }

                                                // Set assertions
                                                (pvInfoRes.body._id).should.equal(pvSaveRes.body._id);
                                                (pvInfoRes.body.docno).should.equal(pv.docno);
                                                should.equal(pvInfoRes.body.user, undefined);

                                                // Call the assertion callback
                                                done();
                                            });
                                    });
                            });
                        });
                });
        });
    });

    it('should get report PVS successfuly', function(done) {
        agent.post('/api/auth/signin')
            .send(credentials)
            .expect(200)
            .end(function(signinErr, signinRes) {
                // Handle signin error
                if (signinErr) {
                    return done(signinErr);
                }

                agent.post('/api/pvs')
                    .send(pv)
                    .end(function(pvSaveErr, pvSaveRes) {
                        // Call the assertion callback
                        if (pvSaveErr) {
                            return done(pvSaveErr);
                        }
                    });

                // Save a new Pv
                agent.get('/api/reportpvs')
                    .expect(200)
                    .end(function(pvGetRpErr, pvGetRpRes) {
                        // Handle Pv error
                        if (pvGetRpErr) {
                            return done(pvGetRpErr);
                        }

                        // Get Aps list
                        var pvs = pvGetRpRes.body;

                        // Set assertions
                        // (aps[0].user._id).should.equal(userId);
                        (pvs).should.match('');
                        // (pvs[0].debit[0].docref).should.match(pv.docno);
                        // (pvs[0].debit[0].docdate).should.match(pv.docdate);
                        // (pvs[0].debit[0].accname).should.match(pv.contact.name);
                        // (pvs[0].debit[0].amount).should.match(435);


                        // // (pvs[0].debit[0].accname).should.match(pv.items[0].productname);
                        // (pvs[0].debit[0].accname).should.match("รายได้จากการขาย : " + pv.items[0].productname);
                        // (pvs[0].debit[0].amount).should.match(pv.items[0].aps.amount);

                        // (pvs[0].credit[0].docdate).should.match(pv.docdate);
                        // (pvs[0].credit[0].docref).should.match(pv.docno);
                        // (pvs[0].credit[0].accname).should.match(pv.contact.name);
                        // (pvs[0].credit[0].amount).should.match(pv.amount);
                        // Handle Pv save error
                        done();
                    });
            });
    });

});






afterEach(function(done) {
    User.remove().exec(function() {
        Contact.remove().exec(function() {
            Ap.remove().exec(function() {
                Pv.remove().exec(done);
            });
        });
    });
});