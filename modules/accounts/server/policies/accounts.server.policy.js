'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Accounts Permissions
 */
exports.invokeRolesPolicies = function () {
    acl.allow([{
        roles: ['admin'],
        allows: [{
            resources: '/api/accounts',
            permissions: '*'
        }, {
            resources: '/api/glreport/:type/:date',
            permissions: '*'
        }, {
            resources: '/api/glreport/:type/:date/:enddate',
            permissions: '*'
        }, {
            resources: '/api/accounts/:accountId',
            permissions: '*'
        }, {
            resources: '/api/orther/accounts',
            permissions: '*'
        }, {
            resources: '/api/orther/accounts/:accountId',
            permissions: '*'
        }]
    }, {
        roles: ['user'],
        allows: [{
            resources: '/api/accounts',
            permissions: ['get', 'post']
        }, {
            resources: '/api/glreport/:type/:date',
            permissions: '*'
        },{
            resources: '/api/glreport/:type/:date/:enddate',
            permissions: '*'
        }, {
            resources: '/api/accounts/:accountId',
            permissions: ['get']
        }, {
            resources: '/api/orther/accounts',
            permissions: ['get']
        }, {
            resources: '/api/orther/accounts/:accountId',
            permissions: ['get']
        }]
    }, {
        roles: ['guest'],
        allows: [{
            resources: '/api/accounts',
            permissions: ['get']
        }, {
            resources: '/api/glreport/:type/:date',
            permissions: '*'
        }, {
            resources: '/api/glreport/:type/:date/:enddate',
            permissions: '*'
        }, {
            resources: '/api/accounts/:accountId',
            permissions: ['get']
        }, {
            resources: '/api/orther/accounts',
            permissions: ['get']
        }, {
            resources: '/api/orther/accounts/:accountId',
            permissions: ['get']
        }]
    }]);
};

/**
 * Check If Accounts Policy Allows
 */
exports.isAllowed = function (req, res, next) {
    var roles = (req.user) ? req.user.roles : ['guest'];

    // If an Account is being processed and the current user created it then allow any manipulation
    if (req.account && req.user && req.account.user && req.account.user.id === req.user.id) {
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