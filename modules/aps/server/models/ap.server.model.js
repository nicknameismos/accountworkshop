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
        type: String,
        required: 'Please fill Ap contact',
        trim: true
    },
    items: {
        required: 'Please fill Ap items',
        type: [{
            productname: String,
            unitprice: Number,
            qty: Number,
            amount: Number
        }]
    },
    amount: Number,
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