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
    account3;

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
            }, {
                account: accountchart3,
                description: "ค่ากระดาษถ่ายเอกสาร",
                amount: 11.78
            }],
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

        account3 = new Account({
            credits: [{
                account: accountchart1,
                description: "ค่ากระดาษถ่ายเอกสาร",
                amount: 180
            }],
            debits: [{
                account: accountchart2,
                description: "ค่ากระดาษถ่ายเอกสาร",
                amount: 168.22
            }, {
                account: accountchart3,
                description: "ค่ากระดาษถ่ายเอกสาร",
                amount: 11.78
            }],
            docdate: "2015-12-04T07:00:00.000+07:00",
            docno: "PV58120401",
            gltype: "PV",
            remark: "ค่ากระดาษถ่ายเอกสาร",
            status: "Open",
            totalcredit: 180,
            totaldebit: 180
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
                account3.save(function () {
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

                (accounts.length).should.match(3);

                // Call the assertion callback
                done();
            });
    });

    it('GL Report daily get by month', function (done) {
        var date = '2016-01-05';
        var type = 'month';
        // Get a list of Accountcharts
        agent.get('/api/glreport/' + type + '/' + date)
            .end(function (glreportsGetErr, glreportsGetRes) {
                // Handle Accountcharts save error
                if (glreportsGetErr) {
                    return done(glreportsGetErr);
                }

                // Get Accountcharts list
                var glreports = glreportsGetRes.body;

                (glreports.type).should.match("month");
                (glreports.daily.transaction.length).should.match(1);
                (glreports.daily.transaction[0].docno).should.match(account.docno);

                // Call the assertion callback
                done();
            });

    });

    it('GL Report daily get by year', function (done) {
        var date = '2016-01-05';
        var type = 'year';
        // Get a list of Accountcharts
        agent.get('/api/glreport/' + type + '/' + date)
            .end(function (glreportsGetErr, glreportsGetRes) {
                // Handle Accountcharts save error
                if (glreportsGetErr) {
                    return done(glreportsGetErr);
                }

                // Get Accountcharts list
                var glreports = glreportsGetRes.body;

                (glreports.type).should.match("year");
                (glreports.daily.transaction.length).should.match(2);
                (glreports.daily.transaction[0].docno).should.match(account.docno);
                (glreports.daily.transaction[1].docno).should.match(account2.docno);
                // Call the assertion callback
                done();
            });

    });

    it('GL Report get acceach by month', function (done) {

        var date = '2016-01-05';
        var type = 'month';
        // Get a list of Accountcharts
        agent.get('/api/glreport/' + type + '/' + date)
            .end(function (glreportssGetErr, glreportssGetRes) {
                // Handle Accountcharts save error
                if (glreportssGetErr) {
                    return done(glreportssGetErr);
                }

                // Get Accountcharts list
                var glreports = glreportssGetRes.body;

                (glreports.type).should.match("month");
                (glreports.acceach).should.match(3);
                (glreports.acceach[0].accountno).should.match('101101');
                (glreports.acceach[0].transaction[0].list[0].accountno).should.match('605003');
                (glreports.acceach[0].transaction[0].list[1].accountno).should.match('101502');
                // Call the assertion callback
                done();
            });
    });

    it('GL Report get acceach by year', function (done) {

        var date = '2016-01-05';
        var type = 'year';
        // Get a list of Accountcharts
        agent.get('/api/glreport/' + type + '/' + date)
            .end(function (glreportssGetErr, glreportssGetRes) {
                // Handle Accountcharts save error
                if (glreportssGetErr) {
                    return done(glreportssGetErr);
                }

                // Get Accountcharts list
                var glreports = glreportssGetRes.body;

                (glreports.type).should.match("year");
                (glreports.acceach.length).should.match(5);
                (glreports.acceach[0].accountno).should.match('101101');
                (glreports.acceach[0].transaction[0].list[0].accountno).should.match('605003');
                (glreports.acceach[0].transaction[0].list[1].accountno).should.match('101502');
                (glreports.acceach[0].current.debit).should.match(180);
                (glreports.acceach[0].current.credit).should.match(180);
                (glreports.acceach[0].carryforward.accountname).should.match('ยอดยกไป');
                (glreports.acceach[0].carryforward.debit).should.match(0);
                (glreports.acceach[0].carryforward.credit).should.match(0);
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
