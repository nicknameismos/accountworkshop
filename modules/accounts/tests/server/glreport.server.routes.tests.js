

'use strict';

var should = require('should'),
    request = require('supertest'),
    path = require('path'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Account = mongoose.model('Account'),
    Accountchart = mongoose.model('Accountchart'),
    express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
    agent,
    credentials,
    user,
    accountchart,
    accountchart1,
    accountchart2,
    accountchart3,
    accountchart4,
    accountchart5,
    accountchart6,
    accountchart7,
    accountchart8,
    accountchart9,
    account,
    account2,
    account3,
    account4,
    account5,
    account6,
    account7;

/**
 * Account routes tests
 */
describe('GL Report tests', function () {

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

        accountchart1 = new Accountchart({
            name: 'เงินสด TEST',
            accountno: '101101',
            parent: 0,
            user: user
        });
        accountchart2 = new Accountchart({
            name: 'ค่าเครื่องเขียนแบบพิมพ์',
            accountno: '605003',
            parent: 0,
            user: user
        });
        accountchart3 = new Accountchart({
            name: 'ภาษีซื้อ',
            accountno: '101502',
            parent: 0,
            user: user
        });
        accountchart4 = new Accountchart({
            name: 'คอมพิวเตอร์และอุปกรณ์',
            accountno: '102101',
            parent: 0,
            user: user
        });
        accountchart5 = new Accountchart({
            name: 'ซื้อสินค้า',
            accountno: '501001',
            parent: 0,
            user: user
        });
        accountchart6 = new Accountchart({
            name: 'เงินฝากธนาคารออมทรัพย์ TMB',
            accountno: '101111',
            parent: 0,
            user: user
        });
        accountchart7 = new Accountchart({
            name: 'เงินฝากธนาคารกระแสรายวัน TMB',
            accountno: '101211',
            parent: 0,
            user: user
        });
        accountchart8 = new Accountchart({
            name: 'ค่าเช่าสำนักงาน',
            accountno: '605011',
            parent: 0,
            user: user
        });
        accountchart9 = new Accountchart({
            name: 'ปรับเศษสตางค์เงินสด',
            accountno: '605009',
            parent: 0,
            user: user
        });

        account = new Account({
            credits: [{
                account: accountchart1,
                description: "ค่ากระดาษถ่ายเอกสาร",
                amount: 180
            }],
            debits: [{
                account: accountchart2,
                description: "ค่ากระดาษถ่ายเอกสาร",
                amount: 168.22
            },
            {
                account: accountchart3,
                description: "ค่ากระดาษถ่ายเอกสาร",
                amount: 11.78
            }
            ],
            docdate: "2016-01-04T07:00:00.000+07:00",
            docno: "PV59010401",
            gltype: "PV",
            remark: "ค่ากระดาษถ่ายเอกสาร",
            status: "Open",
            totalcredit: 180,
            totaldebit: 180
        });

        account2 = new Account({
            credits: [{
                account: accountchart1,
                description: "ค่าหมึกพิมพ์",
                amount: 11450
            }],
            debits: [{
                account: accountchart2,
                description: "ค่าหมึกพิมพ์",
                amount: 10700.93
            }, {
                account: accountchart3,
                description: "ค่าหมึกพิมพ์",
                amount: 749.07
            }],
            docdate: "2016-01-04T07:00:00.000+07:00",
            docno: "PV59010402",
            gltype: "PV",
            remark: "",
            status: "Open",
            totalcredit: 11450,
            totaldebit: 11450

        });

        account3 = new Account({
            credits: [{
                account: accountchart1,
                description: "ค่าอุปกรณ์คอมพิวเตอร์- Tablet",
                amount: 67561
            }],
            debits: [{
                account: accountchart4,
                description: "ค่าอุปกรณ์คอมพิวเตอร์- Tablet",
                amount: 63141.12
            }, {
                account: accountchart3,
                description: "ค่าอุปกรณ์คอมพิวเตอร์- Tablet",
                amount: 4419.88
            }],
            docdate: "2016-01-04T07:00:00.000+07:00",
            docno: "PV59010403",
            gltype: "PV",
            remark: "",
            status: "Open",
            totalcredit: 67561,
            totaldebit: 67561
        });

        account4 = new Account({
            credits: [{
                account: accountchart1,
                description: "ค่าเครื่งคอมคอมพิวเตอร์",
                amount: 13803
            }],
            debits: [{
                account: accountchart5,
                description: "ค่าเครื่งคอมคอมพิวเตอร์",
                amount: 12900
            }, {
                account: accountchart3,
                description: "ค่าเครื่งคอมคอมพิวเตอร์",
                amount: 903
            }],
            docdate: "2016-01-04T07:00:00.000+07:00",
            docno: "PV59010404",
            gltype: "PV",
            remark: "",
            status: "Open",
            totalcredit: 13803,
            totaldebit: 13803
        });

        account5 = new Account({
            credits: [{
                account: accountchart6,
                description: "โอนเงินระหว่างบัญชี",
                amount: 200000
            }],
            debits: [{
                account: accountchart7,
                description: "โอนเงินระหว่างบัญชี",
                amount: 200000
            }],
            docdate: "2016-02-04T07:00:00.000+07:00",
            docno: "PV59020401",
            gltype: "PV",
            remark: "",
            status: "Open",
            totalcredit: 200000,
            totaldebit: 200000
        });

        account6 = new Account({
            credits: [{
                account: accountchart7,
                description: "ค่าเช่าสำนักงาน",
                amount: 32300
            }],
            debits: [{
                account: accountchart8,
                description: "ค่าเช่าสำนักงาน",
                amount: 32300
            }],
            docdate: "2016-02-05T07:00:00.000+07:00",
            docno: "PV59020501",
            gltype: "PV",
            remark: "",
            status: "Open",
            totalcredit: 32300,
            totaldebit: 32300
        });

        account7 = new Account({
            credits: [{
                account: accountchart7,
                description: "เบิกเงิน",
                amount: 313660.39
            }],
            debits: [{
                account: accountchart9,
                description: "เบิกเงิน",
                amount: 0.39
            }, {
                account: accountchart1,
                description: "เบิกเงิน",
                amount: 313660
            }],
            docdate: "2016-02-05T07:00:00.000+07:00",
            docno: "PV59020502",
            gltype: "PV",
            remark: "",
            status: "Open",
            totalcredit: 313660.39,
            totaldebit: 313660.39
        });


        // Save a user to the test db and create new Account
        user.save(function () {
            accountchart1.save();
            accountchart2.save();
            accountchart3.save();
            accountchart4.save();
            accountchart5.save();
            accountchart6.save();
            accountchart7.save();
            accountchart8.save();
            accountchart9.save(function () {
                account.save();
                account2.save();
                account3.save();
                account4.save();
                account5.save();
                account6.save();
                account7.save(function () {
                    done();
                });
            });
        });
    });

    it('GL Report get accountchart', function (done) {

        // Get a list of Accountcharts
        agent.get('/api/accountcharts')
            .end(function (accountchartsGetErr, accountchartsGetRes) {
                // Handle Accountcharts save error
                if (accountchartsGetErr) {
                    return done(accountchartsGetErr);
                }

                // Get Accountcharts list
                var accountcharts = accountchartsGetRes.body;

                (accountcharts.length).should.match(9);
                // Call the assertion callback
                done();
            });
    });

    it('GL Report get account', function (done) {

        // Get a list of Accountcharts
        agent.get('/api/accounts')
            .end(function (accountsGetErr, accountsGetRes) {
                // Handle Accountcharts save error
                if (accountsGetErr) {
                    return done(accountsGetErr);
                }

                // Get Accountcharts list
                var accounts = accountsGetRes.body;

                (accounts.length).should.match(7);

                // Call the assertion callback
                done();
            });
    });

    it('GL Report daily get by month', function (done) {
        var date = new Date('2016-01-05T07:00:00.000+07:00');
        var type = 'm';
        // Get a list of Accountcharts
        agent.get('/api/glreport/' + type + '/' + date)
            .end(function (glreportsGetErr, glreportsGetRes) {
                // Handle Accountcharts save error
                if (glreportsGetErr) {
                    return done(glreportsGetErr);
                }

                // Get Accountcharts list
                var glreports = glreportsGetRes.body;

                // (glreports).should.match({});

                (glreports.length).should.match(4);
                
                // Call the assertion callback
                done();
            });
            
    });

    it('GL Report daily get by month', function (done) {
        var date = new Date('2016-01-05T07:00:00.000+07:00');
        var type = 'y';
        // Get a list of Accountcharts
        agent.get('/api/glreport/' + type + '/' + date)
            .end(function (glreportsGetErr, glreportsGetRes) {
                // Handle Accountcharts save error
                if (glreportsGetErr) {
                    return done(glreportsGetErr);
                }

                // Get Accountcharts list
                var glreports = glreportsGetRes.body;

                // (glreports).should.match({});

                (glreports.length).should.match(7);
                
                // Call the assertion callback
                done();
            });
            
    });


    afterEach(function (done) {
        User.remove().exec(function () {
            Accountchart.remove().exec(function () {
                Account.remove().exec(done);
            });
        });
    });
});
