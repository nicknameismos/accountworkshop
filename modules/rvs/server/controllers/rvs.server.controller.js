'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Rv = mongoose.model('Rv'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Rv
 */
exports.create = function (req, res) {
  var rv = new Rv(req.body);
  rv.user = req.user;

  rv.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(rv);
    }
  });
};

/**
 * Show the current Rv
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var rv = req.rv ? req.rv.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  rv.isCurrentUserOwner = req.user && rv.user && rv.user._id.toString() === req.user._id.toString();

  res.jsonp(rv);
};

/**
 * Update a Rv
 */
exports.update = function (req, res) {
  var rv = req.rv;

  rv = _.extend(rv, req.body);

  rv.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(rv);
    }
  });
};

/**
 * Delete an Rv
 */
exports.delete = function (req, res) {
  var rv = req.rv;

  rv.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(rv);
    }
  });
};

/**
 * List of Rvs
 */
exports.list = function (req, res) {
  Rv.find().sort('-created').populate('user', 'displayName').exec(function (err, rvs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(rvs);
    }
  });
};

/**
 * Rv middleware
 */
exports.rvByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Rv is invalid'
    });
  }

  Rv.findById(id).populate('user', 'displayName').exec(function (err, rv) {
    if (err) {
      return next(err);
    } else if (!rv) {
      return res.status(404).send({
        message: 'No Rv with that identifier has been found'
      });
    }
    req.rv = rv;
    next();
  });
};

exports.readrvs = function (req, res, next) {

  Rv.find().sort('-created').populate('user', 'displayName').exec(function (err, rvs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (rvs.length > 0) {
        req.rvs = rvs;
        next();
      } else {
        res.jsonp(rvs);
      }
    }
  });
};

exports.cookingreportrvs = function (req, res, next) {
  var cookingrvs = req.rvs;
  var cookingdatas;
  var datas = [];

  cookingrvs.forEach(function (rv) {
    cookingdatas = {
      debit: [],
      credit: []
    };

    cookingdatas.debit.push({
      docref: rv.docno,
      docdate: rv.docdate,
      accname: rv.contact,
      amount: rv.amount
    });

    rv.items.forEach(function (item) {
      cookingdatas.credit.push({
        docref: rv.docno,
        docdate: rv.docdate,
        accname: item.productname,
        amount: item.amount
      });
    });

    datas.push(cookingdatas);
  });
  req.cookingrvscomplete = datas;
  next();
};

exports.reportrvs = function (req, res) {
  res.jsonp(req.cookingrvscomplete);
};