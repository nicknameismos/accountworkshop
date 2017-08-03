'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Jvs Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/jvs',
      permissions: '*'
    }, {
      resources: '/api/jvs/:jvId',
      permissions: '*'
    }, {
      resources: '/api/reportjvs',
      permissions: ['get']
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/jvs',
      permissions: ['get', 'post']
    }, {
      resources: '/api/jvs/:jvId',
      permissions: ['get']
    }, {
      resources: '/api/reportjvs',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/jvs',
      permissions: ['get']
    }, {
      resources: '/api/jvs/:jvId',
      permissions: ['get']
    }, {
      resources: '/api/reportjvs',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Jvs Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Jv is being processed and the current user created it then allow any manipulation
  if (req.jv && req.user && req.jv.user && req.jv.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
