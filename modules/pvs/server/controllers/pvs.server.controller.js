'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Pv = mongoose.model('Pv'),
    Ap = mongoose.model('Ap'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    _ = require('lodash');

/**
 * Create a Pv
 */
exports.cookingAp = function(req, res, next) {
    var pv = new Pv(req.body);
    req.amount = 0;
    // pv.amount = 0;
    var filter = [];
    if (pv.items && pv.items.length > 0) {
        pv.items.forEach(function(itm) {
            // pv.amount += itm.aps.netamount;
            filter.push({
                _id: itm.aps
            });
        });
    } else {
        next();
    }
    Ap.find({ $and: filter }).sort('-created').populate('user', 'displayName').exec(function(err, aps) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            if (aps && aps.length > 0) {
                aps.forEach(function(ap) {
                    req.amount += ap.netamount;
                });
                next();
            } else {
                req.amount = 0;
                next();
            }
        }
    });
    // { $and: [{ src: { $ne: 'ios' } }, { src: { $ne: 'android' } }, { src: { $ne: 'web' } }] }
};

exports.create = function(req, res) {
    var pv = new Pv(req.body);
    pv.user = req.user;
    pv.netamount = 0;
    pv.amount = req.amount;
    pv.netamount = pv.amount - pv.discount;
    if (pv.netamount <= 0) {
        pv.netamount = 0;
    }

    pv.save(function(err) {
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
exports.read = function(req, res) {
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
exports.update = function(req, res) {
    var pv = req.pv;

    pv = _.extend(pv, req.body);

    pv.save(function(err) {
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
exports.delete = function(req, res) {
    var pv = req.pv;

    pv.remove(function(err) {
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
exports.list = function(req, res) {
    Pv.find().sort('-created').populate('user', 'displayName').exec(function(err, pvs) {
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
exports.pvByID = function(req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Pv is invalid'
        });
    }

    Pv.findById(id).populate('user', 'displayName').exec(function(err, pv) {
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
exports.readpvs = function(req, res, next) {
    Pv.find().sort('-created').populate('user', 'displayName').populate('contact').populate({
        path: 'items',
        populate: {
            path: 'aps',
            model: 'Ap'
        }
    }).exec(function(err, pvs) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            if (pvs && pvs.length > 0) {
                req.pvs = pvs;
                next();
            } else {
                res.jsonp(pvs);
            }
        }
    });
};

exports.cookingreportpvs = function(req, res, next) {
    var cookingpvs = req.pvs;
    var cookingdatas;
    var datas = [];
    var vat = 0;
    cookingpvs.forEach(function(pv) {
        cookingdatas = {
            debit: [],
            credit: []
        };
        cookingdatas.debit.push({
            docref: pv.docno,
            docdate: pv.docdate,
            accname: pv.contact.name,
            amount: pv.netamount
        });
        pv.items.forEach(function(ap) {
            vat = 0;
            // console.log(ap.aps.items);
            ap.aps.items.forEach(function(item) {
                cookingdatas.credit.push({
                    docdate: pv.docdate,
                    docref: pv.docno,
                    apref: ap.aps.docno,
                    accname: item.productname,
                    amount: item.amount
                });
                vat += item.amount * (item.vat / 100);
            });
            cookingdatas.credit.push({
                docdate: pv.docdate,
                docref: pv.docno,
                apref: ap.aps.docno,
                accname: 'ส่วนลดในบิล',
                amount: ap.aps.discount
            });
            cookingdatas.credit.push({
                docdate: pv.docdate,
                docref: pv.docno,
                apref: ap.aps.docno,
                accname: 'ภาษีจ่าย',
                amount: vat
            });
        });

        cookingdatas.credit.push({
            docdate: pv.docdate,
            docref: pv.docno,
            accname: 'ส่วนลด',
            amount: pv.discount
        });
        datas.push(cookingdatas);
    });
    req.cookingpvscomplete = datas;
    next();
};
exports.reportpvs = function(req, res) {
    res.jsonp(req.cookingpvscomplete);
};