'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Ar = mongoose.model('Ar'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Ar
 */
exports.create = function (req, res) {
  var ar = new Ar(req.body);
  ar.user = req.user;

  ar.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(ar);
    }
  });
};

/**
 * Show the current Ar
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var ar = req.ar ? req.ar.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  ar.isCurrentUserOwner = req.user && ar.user && ar.user._id.toString() === req.user._id.toString();

  res.jsonp(ar);
};

/**
 * Update a Ar
 */
exports.update = function (req, res) {
  var ar = req.ar;

  ar = _.extend(ar, req.body);

  ar.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(ar);
    }
  });
};

/**
 * Delete an Ar
 */
exports.delete = function (req, res) {
  var ar = req.ar;

  ar.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(ar);
    }
  });
};

/**
 * List of Ars
 */
exports.list = function (req, res) {
  Ar.find().sort('-created').populate('user', 'displayName').exec(function (err, ars) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(ars);
    }
  });
};

/**
 * Ar middleware
 */
exports.arByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Ar is invalid'
    });
  }

  Ar.findById(id).populate('user', 'displayName').exec(function (err, ar) {
    if (err) {
      return next(err);
    } else if (!ar) {
      return res.status(404).send({
        message: 'No Ar with that identifier has been found'
      });
    }
    req.ar = ar;
    next();
  });
};

exports.readars = function (req, res, next) {
  Ar.find().sort('-created').populate('user', 'displayName').exec(function (err, ars) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (ars.length > 0) {
        req.ars = ars;
        next();

      } else {
        res.jsonp(ars);
      }
    }
  });
};




exports.cookingreportars = function (req, res, next) {
  var cookingars = req.ars;
  var cookingdatas;
  var datas = [];
  cookingars.forEach(function (ar) {
    cookingdatas = {
      debit: [],
      credit: []
    };
    cookingdatas.debit.push({
      docref: ar.docno,
      docdate: ar.docdate,
      accname: ar.contact,
      amount: ar.amount
    });
    ar.items.forEach(function (item) {
      cookingdatas.credit.push({
        docref: ar.docno,
        docdate: ar.docdate,
        accname: item.productname,
        amount: item.amount
      });
    });

    datas.push(cookingdatas);
  });
  req.cookingapscomplete = datas;
  next();
};



exports.reportars = function (req, res) {
  res.jsonp(req.cookingapscomplete);
};