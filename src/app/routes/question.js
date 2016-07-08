'use strict';

/**
 * Module dependencies
 */
var checkToken = require('../../app/controllers/check-token'),
    index = require('../../dbconf/index'),
    question = require('../../app/controllers/question');

module.exports = function(app){

  app.route('/').get(question.index);

  app.route('/api/:filename')
  .get(checkToken.checkTokeninUrl,index.getApi);

  app.route('/questions')
  .get(checkToken.checkTokeninUrl,question.list)
  .post(checkToken.checkTokeninBody,question.create);

  app.route('/questions/:questionId')
  .get(checkToken.checkTokeninUrl,question.read)
  .post(checkToken.checkTokeninBody,question.update)
  .delete(checkToken.checkTokeninBody,question.delete);

  app.param('questionId',question.questionById);
};
