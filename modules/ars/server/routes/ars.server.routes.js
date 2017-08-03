'use strict';

/**
 * Module dependencies
 */
var arsPolicy = require('../policies/ars.server.policy'),
  ars = require('../controllers/ars.server.controller');

module.exports = function(app) {
  // Ars Routes
  app.route('/api/ars').all(arsPolicy.isAllowed)
    .get(ars.list)
    .post(ars.create);

  app.route('/api/ars/:arId').all(arsPolicy.isAllowed)
    .get(ars.read)
    .put(ars.update)
    .delete(ars.delete);


  // Finish by binding the Ar middleware
  app.param('arId', ars.arByID);
};
