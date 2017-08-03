'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Rv Schema
 */
var RvSchema = new Schema({
  docno: {
    type: String,
    required: 'Please fill Rv docno',
    trim: true
  },
  docdate: {
    type: Date,
    required: 'Please fill Rv docdate',
    trim: true
  },
  contact: {
    type: String,
    required: 'Please fill Rv contact',
    trim: true
  },

     items: {
        required: 'Please fill Rv items',
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

mongoose.model('Rv', RvSchema);
