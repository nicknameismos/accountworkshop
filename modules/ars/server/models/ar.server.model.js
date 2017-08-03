'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Ar Schema
 */
var ArSchema = new Schema({
  docno: {
    type: String,
    unique: true,
    required: 'Please fill Ar Docno'

  },
  docdate: {
    type: Date,
    default: Date.now,
    required: 'Please  fill Ar DocDate'
  },
  items: {
    required: 'Please fill Ar Items',
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
  contact: {
    type: String,
    required: 'Please fill Ar Contact'
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

mongoose.model('Ar', ArSchema);
