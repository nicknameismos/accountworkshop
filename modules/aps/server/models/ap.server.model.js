'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Ap Schema
 */
var ApSchema = new Schema({
    docno: {
        type: String,
        required: 'Please fill Ap docno',
        unique: true,
        trim: true
    },
    docdate: {
        type: Date,
        required: 'Please fill Ap docdate',
        trim: true
    },
    contact: {
        required: 'Please fill Ap contact',
        type: Schema.ObjectId,
        ref: 'Contact'
    },
    items: {
        required: 'Please fill Ap items',
        type: [{
            name: String,
            unitprice: Number,
            qty: Number,
            price: Number,
            amount: Number,
            vat: Number,
            vatamount: Number
        }]
    },
    status: {
        type: String,
        default: 'wait'
    },
    amount: Number,
    totalamount: Number,
    discount: Number,
    netamount: Number,
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Ap', ApSchema);
