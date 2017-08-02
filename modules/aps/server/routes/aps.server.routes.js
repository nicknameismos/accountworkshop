'use strict';

/**
 * Module dependencies
 */
var apsPolicy = require('../policies/aps.server.policy'),
  aps = require('../controllers/aps.server.controller');

module.exports = function(app) {
  // Aps Routes
  app.route('/api/aps').all(apsPolicy.isAllowed)
    .get(aps.list)
    .post(aps.create);

  app.route('/api/aps/:apId').all(apsPolicy.isAllowed)
    .get(aps.read)
    .put(aps.update)
    .delete(aps.delete);

  // Finish by binding the Ap middleware
  app.param('apId', aps.apByID);
};
