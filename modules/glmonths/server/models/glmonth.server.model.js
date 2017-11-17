'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Glmonth Schema
 */
var GlmonthSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Glmonth name',
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

mongoose.model('Glmonth', GlmonthSchema);
