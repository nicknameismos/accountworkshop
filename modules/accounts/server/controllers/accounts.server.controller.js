'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Account = mongoose.model('Account'),
    Accountchart = mongoose.model('Accountchart'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    _ = require('lodash');

/**
 * Create a Account
 */
exports.genDocno = function (req, res, next) {
    var account = new Account(req.body);
    // console.log(account);
    account.user = req.user;
    var date = new Date(account.docdate);
    var reqGltype = account.gltype;
    var year = (date.getFullYear() + 543).toString().substr(2, 2);
    var getmonth = date.getMonth() + 1;
    var month = '';
    var dayOfMonth = '';
    if (getmonth >= 10) {
        month = getmonth;
    } else {
        month = '0' + getmonth;
    }

    if (date.getDate().toString().length === 1) {
        dayOfMonth = '0' + date.getDate();
    } else {
        dayOfMonth = date.getDate();
    }

    var genDocno = reqGltype + '' + year + '' + month + '' + dayOfMonth;
    Account.find({
        gltype: reqGltype
    }).sort('-created').populate('user', 'displayName').exec(function (err, accounts) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            if (accounts && accounts.length > 0) {
                var passSite = accounts.filter(function (obj) {
                    return obj.docno.substr(0, 8) === genDocno.toString();
                });
                if (passSite && passSite.length > 0) {
                    var docno = passSite[0].docno;
                    var subnumber = docno.substr(2, 13);
                    var cookingdocno = parseInt(subnumber) + 1;
                    req.genDocno = reqGltype + cookingdocno.toString();
                    next();
                } else {
                    req.genDocno = genDocno + '01';
                    next();
                }
            } else {
                req.genDocno = genDocno + '01';
                next();
            }
        }
    });
};


exports.create = function (req, res) {
    var account = new Account(req.body);
    account.user = req.user;
    account.docno = req.genDocno;
    account.totaldebit = 0;
    account.totalcredit = 0;

    if (account.debits && account.debits.length > 0) {
        account.debits.forEach(function (debit) {
            account.totaldebit += debit.amount;
        });
    }

    if (account.credits && account.credits.length > 0) {
        account.credits.forEach(function (credit) {
            account.totalcredit += credit.amount;
        });
    }
    if (account.totaldebit !== account.totalcredit) {
        res.jsonp({
            message: 'totalcredit not equal totaldebit!'
        });
    }

    account.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(account);
        }
    });
};

/**
 * Show the current Account
 */
exports.read = function (req, res) {
    // convert mongoose document to JSON
    var account = req.account ? req.account.toJSON() : {};

    // Add a custom field to the Article, for determining if the current User is the "owner".
    // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
    account.isCurrentUserOwner = req.user && account.user && account.user._id.toString() === req.user._id.toString();

    res.jsonp(account);
};

/**
 * Update a Account
 */
exports.update = function (req, res) {
    var account = req.account;

    account = _.extend(account, req.body);

    account.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            Accountchart.populate(account, {
                path: 'debits',
                populate: {
                    path: 'account',
                    model: 'Accountchart'
                }
            }, function (err, data) {
                Accountchart.populate(data, {
                    path: 'credits',
                    populate: {
                        path: 'account',
                        model: 'Accountchart'
                    }
                }, function (err, data2) {
                    var accountSig = data2.toJSON();
                    for (var i = 0; i < accountSig.debits.length; i++) {
                        var accountDebitI = accountSig.debits[i].account;
                        var accountDebitNew = {
                            _id: accountDebitI._id,
                            accountno: accountDebitI.accountno,
                            name: accountDebitI.name,
                            fullname: accountDebitI.accountno + ' ' + accountDebitI.name,
                            status: accountDebitI.status,
                            parent: accountDebitI.parent ? accountDebitI.parent : null,
                            vat: accountDebitI.vat ? accountDebitI.vat : 0,
                            unitprice: accountDebitI.unitprice ? accountDebitI.unitprice : 0,
                            user: accountDebitI.user
                        };
                        accountSig.debits[i].account = accountDebitNew;
                    }
                    for (var ii = 0; ii < accountSig.credits.length; ii++) {
                        var accountCreditI = accountSig.credits[ii].account;
                        var accountCreditNew = {
                            _id: accountCreditI._id,
                            accountno: accountCreditI.accountno,
                            name: accountCreditI.name,
                            fullname: accountCreditI.accountno + ' ' + accountCreditI.name,
                            status: accountCreditI.status,
                            parent: accountCreditI.parent ? accountCreditI.parent : null,
                            vat: accountCreditI.vat ? accountCreditI.vat : 0,
                            unitprice: accountCreditI.unitprice ? accountCreditI.unitprice : 0,
                            user: accountCreditI.user
                        };
                        accountSig.credits[ii].account = accountCreditNew;
                    }
                    res.jsonp(accountSig);
                });
            });
        }
    });
};

/**
 * Delete an Account
 */
exports.delete = function (req, res) {
    var account = req.account;

    account.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(account);
        }
    });
};

/**
 * List of Accounts
 */
exports.list = function (req, res) {
    Account.find().sort('-created').populate('user', 'displayName').exec(function (err, accounts) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(accounts);
        }
    });
};

/**
 * Account middleware
 */
exports.accountByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Account is invalid'
        });
    }

    Account.findById(id).populate('user', 'displayName').exec(function (err, account) {
        if (err) {
            return next(err);
        } else if (!account) {
            return res.status(404).send({
                message: 'No Account with that identifier has been found'
            });
        }
        req.account = account;
        next();
    });
};

exports.genDocnoAccount = function (req, res, next) {
    var account = new Account(req.body);
    var date = new Date(account.docdate);
    var reqGltype = account.gltype;
    var year = (date.getFullYear() + 543).toString().substr(2, 2);
    var getmonth = date.getMonth() + 1;
    var month = '';
    var dayOfMonth = '';
    if (getmonth >= 10) {
        month = getmonth;
    } else {
        month = '0' + getmonth;
    }
    if (date.getDate().toString().length === 1) {
        dayOfMonth = '0' + date.getDate();
    } else {
        dayOfMonth = date.getDate();
    }
    var genDocno = reqGltype + '' + year + '' + month + '' + dayOfMonth;
    Account.find({
        gltype: reqGltype
    }).sort('-created').populate('user', 'displayName').exec(function (err, accounts) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            if (accounts && accounts.length > 0) {
                var passSite = accounts.filter(function (obj) {
                    return obj.docno.substr(0, 8) === genDocno.toString();
                });
                if (passSite && passSite.length > 0) {
                    var docno = passSite[0].docno;
                    var subnumber = docno.substr(2, 13);
                    var cookingdocno = parseInt(subnumber) + 1;
                    req.genDocno = reqGltype + cookingdocno.toString();
                    next();
                } else {
                    req.genDocno = genDocno + '01';
                    next();
                }
            } else {
                req.genDocno = genDocno + '01';
                next();
            }
        }
    });
};


exports.createAccount = function (req, res) {
    var account = new Account(req.body);
    account.docno = req.genDocno;
    account.totaldebit = 0;
    account.totalcredit = 0;

    if (account.debits && account.debits.length > 0) {
        account.debits.forEach(function (debit) {
            account.totaldebit += debit.amount;
        });
    }

    if (account.credits && account.credits.length > 0) {
        account.credits.forEach(function (credit) {
            account.totalcredit += credit.amount;
        });
    }
    if (account.totaldebit !== account.totalcredit) {
        res.jsonp({
            message: 'totalcredit not equal totaldebit!'
        });
    }

    account.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            Accountchart.populate(account, {
                path: 'debits',
                populate: {
                    path: 'account',
                    model: 'Accountchart'
                }
            }, function (err, data) {
                Accountchart.populate(data, {
                    path: 'credits',
                    populate: {
                        path: 'account',
                        model: 'Accountchart'
                    }
                }, function (err, data2) {
                    var accountSig = data2.toJSON();
                    for (var i = 0; i < accountSig.debits.length; i++) {
                        var accountDebitI = accountSig.debits[i].account;
                        var accountDebitNew = {
                            _id: accountDebitI._id,
                            accountno: accountDebitI.accountno,
                            name: accountDebitI.name,
                            fullname: accountDebitI.accountno + ' ' + accountDebitI.name,
                            status: accountDebitI.status,
                            parent: accountDebitI.parent ? accountDebitI.parent : null,
                            vat: accountDebitI.vat ? accountDebitI.vat : 0,
                            unitprice: accountDebitI.unitprice ? accountDebitI.unitprice : 0,
                            user: accountDebitI.user
                        };
                        accountSig.debits[i].account = accountDebitNew;
                    }
                    for (var ii = 0; ii < accountSig.credits.length; ii++) {
                        var accountCreditI = accountSig.credits[ii].account;
                        var accountCreditNew = {
                            _id: accountCreditI._id,
                            accountno: accountCreditI.accountno,
                            name: accountCreditI.name,
                            fullname: accountCreditI.accountno + ' ' + accountCreditI.name,
                            status: accountCreditI.status,
                            parent: accountCreditI.parent ? accountCreditI.parent : null,
                            vat: accountCreditI.vat ? accountCreditI.vat : 0,
                            unitprice: accountCreditI.unitprice ? accountCreditI.unitprice : 0,
                            user: accountCreditI.user
                        };
                        accountSig.credits[ii].account = accountCreditNew;
                    }
                    res.jsonp(accountSig);
                });
            });
        }
    });
};

// Accounts search
exports.accountByDocno = function (req, res, next, docno) {

    Account.find({
        docno: docno
    }).populate('debits.account').populate('credits.account').populate('user', 'displayName').exec(function (err, account) {
        if (err) {
            return next(err);
        } else if (!account) {
            return res.status(404).send({
                message: 'No Account with that identifier has been found'
            });
        }

        if (account[0]) {
            var accountArr = account[0].toJSON();
            for (var i = 0; i < accountArr.debits.length; i++) {
                var accountDebitI = accountArr.debits[i].account;
                var accountDebitNew = {
                    _id: accountDebitI._id,
                    accountno: accountDebitI.accountno,
                    name: accountDebitI.name,
                    fullname: accountDebitI.accountno + ' ' + accountDebitI.name,
                    status: accountDebitI.status,
                    parent: accountDebitI.parent ? accountDebitI.parent : null,
                    vat: accountDebitI.vat ? accountDebitI.vat : 0,
                    unitprice: accountDebitI.unitprice ? accountDebitI.unitprice : 0,
                    user: accountDebitI.user
                };
                accountArr.debits[i].account = accountDebitNew;
            }
            for (var ii = 0; ii < accountArr.credits.length; ii++) {
                var accountCreditI = accountArr.credits[ii].account;
                var accountCreditNew = {
                    _id: accountCreditI._id,
                    accountno: accountCreditI.accountno,
                    name: accountCreditI.name,
                    fullname: accountCreditI.accountno + ' ' + accountCreditI.name,
                    status: accountCreditI.status,
                    parent: accountCreditI.parent ? accountCreditI.parent : null,
                    vat: accountCreditI.vat ? accountCreditI.vat : 0,
                    unitprice: accountCreditI.unitprice ? accountCreditI.unitprice : 0,
                    user: accountCreditI.user
                };
                accountArr.credits[ii].account = accountCreditNew;
            }
            req.account = accountArr;
            next();

        } else {
            req.account = [];
            next();
        }
    });
};

exports.listSearch = function (req, res) {
    var account = req.account ? req.account : {};
    res.jsonp(account);
};
