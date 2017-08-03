'use strict';

/**
 * Module dependencies
 */
var rvsPolicy = require('../policies/rvs.server.policy'),
  rvs = require('../controllers/rvs.server.controller');

module.exports = function(app) {
  // Rvs Routes
  app.route('/api/rvs').all(rvsPolicy.isAllowed)
    .get(rvs.list)
    .post(rvs.create);

  app.route('/api/rvs/:rvId').all(rvsPolicy.isAllowed)
    .get(rvs.read)
    .put(rvs.update)
    .delete(rvs.delete);

  // Finish by binding the Rv middleware
  app.param('rvId', rvs.rvByID);
};
