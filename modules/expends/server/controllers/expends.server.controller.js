'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Expend = mongoose.model('Expend'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Expend
 */
exports.create = function (req, res) {
  var expend = new Expend(req.body);
  expend.user = req.user;

  expend.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(expend);
    }
  });
};

/**
 * Show the current Expend
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var expend = req.expend ? req.expend.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  expend.isCurrentUserOwner = req.user && expend.user && expend.user._id.toString() === req.user._id.toString();

  res.jsonp(expend);
};

/**
 * Update a Expend
 */
exports.update = function (req, res) {
  var expend = req.expend;

  expend = _.extend(expend, req.body);

  expend.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(expend);
    }
  });
};

/**
 * Delete an Expend
 */
exports.delete = function (req, res) {
  var expend = req.expend;

  expend.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(expend);
    }
  });
};

/**
 * List of Expends
 */
exports.list = function (req, res) {
  Expend.find().sort('-created').populate('user', 'displayName').exec(function (err, expends) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(expends);
    }
  });
};

/**
 * Expend middleware
 */
exports.expendByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Expend is invalid'
    });
  }

  Expend.findById(id).populate('user', 'displayName').exec(function (err, expend) {
    if (err) {
      return next(err);
    } else if (!expend) {
      return res.status(404).send({
        message: 'No Expend with that identifier has been found'
      });
    }
    req.expend = expend;
    next();
  });
};

exports.createExpends = function (req, res) {
  var expend = new Expend(req.body);

  expend.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(expend);
    }
  });
};
