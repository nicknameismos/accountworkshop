'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Expend Schema
 */
var ExpendSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Please fill name',
        trim: true
    },
    unitprice: {
        type: Number,
        required: 'Please fill unitprice'
    },
    vat: Number,
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

mongoose.model('Expend', ExpendSchema);