'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Accountchart Schema
 */
var AccountchartSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Accountchart name',
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

mongoose.model('Accountchart', AccountchartSchema);
