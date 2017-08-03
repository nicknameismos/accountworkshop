'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Ars Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/ars',
      permissions: '*'
    }, {
      resources: '/api/ars/:arId',
      permissions: '*'
    },{
      resources: '/api/reportars',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/ars',
      permissions: ['get', 'post']
    }, {
      resources: '/api/ars/:arId',
      permissions: ['get']
    },{
      resources: '/api/reportars',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/ars',
      permissions: ['get']
    }, {
      resources: '/api/ars/:arId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Ars Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Ar is being processed and the current user created it then allow any manipulation
  if (req.ar && req.user && req.ar.user && req.ar.user.id === req.user.id) {
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
