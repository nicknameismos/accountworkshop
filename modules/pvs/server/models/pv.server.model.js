'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Pv Schema
 */
var PvSchema = new Schema({
    docno: {
        type: String,
        required: 'Please fill Pv docno',
        trim: true
    },
    docdate: {
        type: Date,
        required: 'Please fill Pv docdate'
    },
    contact: {
        required: 'Please fill Pv contact',
        type: Schema.ObjectId,
        ref: 'Contact'
    },
    items: {
        required: 'Please fill Pv items',
        type: [{
            aps: {
                type: Schema.ObjectId,
                ref: 'Ap'
            }
        }]
    },
    status: {
        type: String,
        default: 'wait for pay'
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

mongoose.model('Pv', PvSchema);