'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Quizzes Schema
 */
var QuizzesSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  job_id: {
    type: String,
    required: true
  },
  question_list: {
    type: Array,
    required: true
  },
  amount: {
    type: Number
  },
  createdOn: {
    type: Date,
    default: Date.now()
  }
});

mongoose.model('Quizzes',QuizzesSchema);
