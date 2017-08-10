'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Ap = mongoose.model('Ap'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    _ = require('lodash');

/**
 * Create a Ap
 */
exports.create = function (req, res) {
    var ap = new Ap(req.body);
    ap.user = req.user;
    ap.amount = 0;
    ap.totalamount = 0;
    ap.netamount = 0;

    if (ap.items && ap.items.length > 0) {
        ap.items.forEach(function (itm) {
            ap.amount += itm.amount;
            var vat = itm.amount * itm.vat / 100;
            ap.totalamount += itm.amount + vat;
        });
    }
    ap.netamount = ap.totalamount - ap.discount;
    if (ap.netamount <= 0) {
        ap.netamount = 0;
    }

    ap.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(ap);
        }
    });
};

exports.createAps = function (req, res) {
    var ap = new Ap(req.body);

    ap.amount = 0;
    ap.totalamount = 0;
    ap.netamount = 0;

    if (ap.items && ap.items.length > 0) {
        ap.items.forEach(function (itm) {
            ap.amount += itm.amount;
            ap.vatamount = itm.amount * itm.vat / 100;
            ap.totalamount += itm.price + ap.vatamount;
        });
    }

    ap.netamount = ap.totalamount - ap.discount;

    if (ap.netamount <= 0) {
        ap.netamount = 0;
    }

    ap.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(ap);
        }
    });
};

/**
 * Show the current Ap
 */
exports.read = function (req, res) {
    // convert mongoose document to JSON
    var ap = req.ap ? req.ap.toJSON() : {};

    // Add a custom field to the Article, for determining if the current User is the "owner".
    // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
    ap.isCurrentUserOwner = req.user && ap.user && ap.user._id.toString() === req.user._id.toString();

    res.jsonp(ap);
};

/**
 * Update a Ap
 */
exports.update = function (req, res) {
    var ap = req.ap;

    ap = _.extend(ap, req.body);

    ap.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(ap);
        }
    });
};

/**
 * Delete an Ap
 */
exports.delete = function (req, res) {
    var ap = req.ap;

    ap.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(ap);
        }
    });
};

/**
 * List of Aps
 */
exports.list = function (req, res) {
    Ap.find().sort('-created').populate('user', 'displayName').exec(function (err, aps) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(aps);
        }
    });
};

/**
 * Ap middleware
 */
exports.apByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Ap is invalid'
        });
    }

    Ap.findById(id).populate('user', 'displayName').exec(function (err, ap) {
        if (err) {
            return next(err);
        } else if (!ap) {
            return res.status(404).send({
                message: 'No Ap with that identifier has been found'
            });
        }
        req.ap = ap;
        next();
    });
};

exports.readaps = function (req, res, next) {
    Ap.find().sort('-created').populate('user', 'displayName').populate('contact').exec(function (err, aps) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            if (aps.length > 0) {
                req.aps = aps;
                next();
            } else {
                res.jsonp(aps);
            }
        }
    });
};

exports.cookingreportaps = function (req, res, next) {
    var cookingaps = req.aps;
    var cookingdatas;
    var datas = [];
    var vat = 0;
    cookingaps.forEach(function (ap) {
        cookingdatas = {
            debit: [],
            credit: []
        };
        vat = 0;
        ap.items.forEach(function (item) {
            cookingdatas.debit.push({
                docref: ap.docno,
                docdate: ap.docdate,
                accname: item.name,
                amount: item.amount
            });
            vat = item.amount * (item.vat / 100);
        });
        cookingdatas.debit.push({
            docref: ap.docno,
            docdate: ap.docdate,
            accname: 'ภาษีซื้อ',
            amount: vat
        });
        cookingdatas.credit.push({
            docref: ap.docno,
            docdate: ap.docdate,
            accname: ap.contact.name,
            amount: ap.totalamount
        });
        datas.push(cookingdatas);
    });
    req.cookingapscomplete = datas;
    next();
};

exports.reportaps = function (req, res) {
    res.jsonp(req.cookingapscomplete);
};
