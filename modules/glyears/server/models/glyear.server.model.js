'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Glyear Schema
 */
var GlyearSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Glyear name',
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

mongoose.model('Glyear', GlyearSchema);
