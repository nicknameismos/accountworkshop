'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Pv = mongoose.model('Pv'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Pv
 */
exports.create = function (req, res) {
  var pv = new Pv(req.body);
  pv.user = req.user;

  pv.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(pv);
    }
  });
};

/**
 * Show the current Pv
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var pv = req.pv ? req.pv.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  pv.isCurrentUserOwner = req.user && pv.user && pv.user._id.toString() === req.user._id.toString();

  res.jsonp(pv);
};

/**
 * Update a Pv
 */
exports.update = function (req, res) {
  var pv = req.pv;

  pv = _.extend(pv, req.body);

  pv.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(pv);
    }
  });
};

/**
 * Delete an Pv
 */
exports.delete = function (req, res) {
  var pv = req.pv;

  pv.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(pv);
    }
  });
};

/**
 * List of Pvs
 */
exports.list = function (req, res) {
  Pv.find().sort('-created').populate('user', 'displayName').exec(function (err, pvs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(pvs);
    }
  });
};

/**
 * Pv middleware
 */
exports.pvByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Pv is invalid'
    });
  }

  Pv.findById(id).populate('user', 'displayName').exec(function (err, pv) {
    if (err) {
      return next(err);
    } else if (!pv) {
      return res.status(404).send({
        message: 'No Pv with that identifier has been found'
      });
    }
    req.pv = pv;
    next();
  });
};
exports.readpvs = function (req, res, next) {
  Pv.find().sort('-created').populate('user', 'displayName').exec(function (err, pvs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (pvs.length > 0) {
        req.pvs = pvs;
        next();
      } else {
        res.jsonp(pvs);
      }
    }
  });
};
exports.cookingreportpvs = function (req, res, next) {
  var cookingpvs = req.pvs;
  var cookingdatas;
  var datas = [];
  cookingpvs.forEach(function (pv) {
    cookingdatas = {
      debit: [],
      credit: []
    };
    pv.items.forEach(function (item) {
      cookingdatas.debit.push({
        docdate: pv.docdate,
        docref: pv.docno,
        accname: "รายได้จากการขาย : " + item.productname,
        amount: item.amount
      });
    });
    cookingdatas.credit.push({
      docdate: pv.docdate,
      docref: pv.docno,
      accname: pv.contact,
      amount: pv.amount
    });
    datas.push(cookingdatas);
  });
  req.cookingpvscomplete = datas;
  next();
};
exports.reportpvs = function (req, res) {
  res.jsonp(req.cookingpvscomplete);
};