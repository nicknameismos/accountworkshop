'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Jv Schema
 */
var JvSchema = new Schema({
  docno: {
    type: String,
    required: 'Please fill Jv docno',
    unique: true,
    trim: true
  },
  docdate: {
    type: Date,
    required: 'Please fill Jv docdate',
    trim: true
  },
  debits: {
    required: 'Please fill Jv debit',
    type: [
      {
        accname: String,
        description: String,
        amount: Number
      }
    ]
  },
  credits: {
    required: 'Please fill Jv credit',
    type: [
      {
        accname: String,
        description: String,
        amount: Number
      }
    ]
  },
  debitamout: Number,
  creditamount: Number,
  remark: {
    type: String
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

mongoose.model('Jv', JvSchema);
