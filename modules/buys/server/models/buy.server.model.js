'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Buy Schema
 */
var BuySchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Buy name',
    trim: true
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

mongoose.model('Buy', BuySchema);
