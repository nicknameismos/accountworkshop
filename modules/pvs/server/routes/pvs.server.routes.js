'use strict';

/**
 * Module dependencies
 */
var pvsPolicy = require('../policies/pvs.server.policy'),
    pvs = require('../controllers/pvs.server.controller');

module.exports = function (app) {
    // Pvs Routes
    app.route('/api/pvs').all(pvsPolicy.isAllowed)
        .get(pvs.list)
        .post(pvs.cookingAp, pvs.create);

    app.route('/api/pvs/:pvId').all(pvsPolicy.isAllowed)
        .get(pvs.read)
        .put(pvs.update)
        .delete(pvs.delete);

    app.route('/api/reportpvs').all(pvsPolicy.isAllowed)
        .get(pvs.readpvs, pvs.cookingreportpvs, pvs.reportpvs);

    app.route('/api/orther/pvs')
        .post(pvs.cookingAp, pvs.createPvs);

    app.route('/api/orther/pvs/:pvId')
        .get(pvs.read)
        .put(pvs.update)
        .delete(pvs.delete);

    // Finish by binding the Pv middleware
    app.param('pvId', pvs.pvByID);
};
