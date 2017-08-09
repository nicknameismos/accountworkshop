'use strict';

/**
 * Module dependencies
 */
var contactsPolicy = require('../policies/contacts.server.policy'),
  contacts = require('../controllers/contacts.server.controller');

module.exports = function (app) {
  // Contacts Routes
  app.route('/api/contacts').all(contactsPolicy.isAllowed)
    .get(contacts.list)
    .post(contacts.create);

  app.route('/api/contacts/:contactId').all(contactsPolicy.isAllowed)
    .get(contacts.read)
    .put(contacts.update)
    .delete(contacts.delete);

  app.route('/api/orther/contacts')
    .post(contacts.createContact);
  app.route('/api/orther/contacts/:contactId')
    .get(contacts.read)
    .put(contacts.update)

  // Finish by binding the Contact middleware
  app.param('contactId', contacts.contactByID);
};
