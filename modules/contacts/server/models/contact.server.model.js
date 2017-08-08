'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Contact Schema
 */
var ContactSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Please fill Contact name',
        trim: true
    },
    govermentId: {
        type: String,
        required: 'Please fill Contact govermentId',
    },
    email: String,
    tel: String,
    address: {
        type: {
            address: String,
            postcode: String,
            subdistrict: String,
            province: String,
            district: String
        }
    },
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Contact', ContactSchema);