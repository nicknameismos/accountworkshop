'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Jv = mongoose.model('Jv'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Jv
 */
exports.create = function (req, res) {
  var jv = new Jv(req.body);
  jv.user = req.user;

  jv.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(jv);
    }
  });
};

/**
 * Show the current Jv
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var jv = req.jv ? req.jv.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  jv.isCurrentUserOwner = req.user && jv.user && jv.user._id.toString() === req.user._id.toString();

  res.jsonp(jv);
};

/**
 * Update a Jv
 */
exports.update = function (req, res) {
  var jv = req.jv;

  jv = _.extend(jv, req.body);

  jv.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(jv);
    }
  });
};

/**
 * Delete an Jv
 */
exports.delete = function (req, res) {
  var jv = req.jv;

  jv.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(jv);
    }
  });
};

/**
 * List of Jvs
 */
exports.list = function (req, res) {
  Jv.find().sort('-created').populate('user', 'displayName').exec(function (err, jvs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(jvs);
    }
  });
};

/**
 * Jv middleware
 */
exports.jvByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Jv is invalid'
    });
  }

  Jv.findById(id).populate('user', 'displayName').exec(function (err, jv) {
    if (err) {
      return next(err);
    } else if (!jv) {
      return res.status(404).send({
        message: 'No Jv with that identifier has been found'
      });
    }
    req.jv = jv;
    next();
  });
};

exports.readjvs = function (req, res, next) {
  Jv.find().sort('-created').populate('user', 'displayName').exec(function (err, jvs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (jvs.length > 0) {
        req.jvs = jvs;
        next();
      } else {
        res.jsonp(jvs);
      }
    }
  });
};

exports.cookingreportjvs = function (req, res, next) {
  var cookingvjs = req.jvs;
  var cookingdatas;
  var datas = [];
  cookingvjs.forEach(function (jv) {
    cookingdatas = {
      debit: [],
      credit: []
    };
    jv.debits.forEach(function (debit) {
      cookingdatas.debit.push({
        docdate: jv.docdate,
        docref: jv.docno,
        accname: debit.accname,
        amount: debit.amount
      });
    });
    jv.credits.forEach(function (credit) {
      cookingdatas.credit.push({
        docdate: jv.docdate,
        docref: jv.docno,
        accname: credit.accname,
        amount: credit.amount
      });
    });
    datas.push(cookingdatas);
  });
  req.cookingjvscomplete = datas;
  next();
};

exports.reportjvs = function (req, res) {
  res.jsonp(req.cookingjvscomplete);
};
