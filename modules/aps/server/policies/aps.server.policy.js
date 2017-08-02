'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Aps Permissions
 */
exports.invokeRolesPolicies = function() {
    acl.allow([{
        roles: ['admin'],
        allows: [{
            resources: '/api/aps',
            permissions: '*'
        }, {
            resources: '/api/aps/:apId',
            permissions: '*'
        }, {
            resources: '/api/reportaps',
            permissions: '*'
        }]
    }, {
        roles: ['user'],
        allows: [{
            resources: '/api/aps',
            permissions: ['get', 'post']
        }, {
            resources: '/api/aps/:apId',
            permissions: ['get']
        }, {
            resources: '/api/reportaps',
            permissions: ['get']
        }]
    }, {
        roles: ['guest'],
        allows: [{
            resources: '/api/aps',
            permissions: ['get']
        }, {
            resources: '/api/aps/:apId',
            permissions: ['get']
        }, {
            resources: '/api/reportaps',
            permissions: ['get']
        }]
    }]);
};

/**
 * Check If Aps Policy Allows
 */
exports.isAllowed = function(req, res, next) {
    var roles = (req.user) ? req.user.roles : ['guest'];

    // If an Ap is being processed and the current user created it then allow any manipulation
    if (req.ap && req.user && req.ap.user && req.ap.user.id === req.user.id) {
        return next();
    }

    // Check for user roles
    acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function(err, isAllowed) {
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