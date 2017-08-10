'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Account Schema
 */
var AccountSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Please fill Account name',
        unique: true,
        trim: true
    },
    accountno: {
        type: String,
        default: '',
        required: 'Please fill Account no',
        unique: true,
        trim: true
    },
    status: {
        type: String,
        default: 'active'
    },
    parent: Number,
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Account', AccountSchema);