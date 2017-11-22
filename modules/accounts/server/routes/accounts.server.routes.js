'use strict';

/**
 * Module dependencies
 */
var accountsPolicy = require('../policies/accounts.server.policy'),
    accounts = require('../controllers/accounts.server.controller');

module.exports = function (app) {
    // Accounts Routes
    app.route('/api/accounts').all(accountsPolicy.isAllowed)
        .get(accounts.list)
        .post(accounts.genDocno, accounts.create);

    app.route('/api/accounts/:accountId').all(accountsPolicy.isAllowed)
        .get(accounts.read)
        .put(accounts.update)
        .delete(accounts.delete);

    app.route('/api/orther/accounts')
        .post(accounts.genDocnoAccount, accounts.createAccount);

    app.route('/api/orther/accounts/:accountId')
        .get(accounts.read)
        .put(accounts.update)
        .delete(accounts.delete);

    app.route('/api/accounts/search/:docno') // match docno only (*A111 === *A111 : *A111 !== *A11)
        .get(accounts.listSearch);

    app.route('/api/glreport/:type/:date').all(accountsPolicy.isAllowed)
        .get(accounts.generateGlDaily, accounts.getAccountchart, accounts.getBringForwardForAcceach, accounts.generateAcceach, accounts.generateGain, accounts.generateBalance, accounts.returnGlreport);

    // Finish by binding the Account middleware
    app.param('accountId', accounts.accountByID);
    app.param('docno', accounts.accountByDocno);
    app.param('type', accounts.glType);
    app.param('date', accounts.getGlDate);
};
