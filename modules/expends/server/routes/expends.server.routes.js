'use strict';

/**
 * Module dependencies
 */
var expendsPolicy = require('../policies/expends.server.policy'),
  expends = require('../controllers/expends.server.controller');

module.exports = function(app) {
  // Expends Routes
  app.route('/api/expends').all(expendsPolicy.isAllowed)
    .get(expends.list)
    .post(expends.create);

  app.route('/api/expends/:expendId').all(expendsPolicy.isAllowed)
    .get(expends.read)
    .put(expends.update)
    .delete(expends.delete);

  // Finish by binding the Expend middleware
  app.param('expendId', expends.expendByID);
};
