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
    type: String,
    required: 'Please fill Pv contact'
  },
  items: {
    required: 'Please fill Pv items',
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

mongoose.model('Pv', PvSchema);
