'use strict';

/**
 * Module dependencies
 */
var jvsPolicy = require('../policies/jvs.server.policy'),
  jvs = require('../controllers/jvs.server.controller');

module.exports = function (app) {
  // Jvs Routes
  app.route('/api/jvs').all(jvsPolicy.isAllowed)
    .get(jvs.list)
    .post(jvs.create);

  app.route('/api/jvs/:jvId').all(jvsPolicy.isAllowed)
    .get(jvs.read)
    .put(jvs.update)
    .delete(jvs.delete);

  app.route('/api/reportjvs').all(jvsPolicy.isAllowed)
    .get(jvs.readjvs, jvs.cookingreportjvs, jvs.reportjvs);

  // Finish by binding the Jv middleware
  app.param('jvId', jvs.jvByID);
};
