'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Question Schema
 */
var QuestionSchema = new Schema({
  question: {
    type: String,
    default: '',
    trim: true,
    required: true
  },
  choice: {
    type: Object,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  level: {
    type: Number
  },
  createdOn: {
    type: Date,
    default: Date.now()
  }
});

mongoose.model('Questions',QuestionSchema);
