'use strict';

/**
 * Module dependencies
 */
var checkTocken = require('../../app/controllers/check-token'),
  index = require('../../dbconf/index'),
  quizzes = require('../../app/controllers/quiz');

module.exports = function(app){

  app.route('/api/:filename').get(index.getApi);

  app.route('/quizzes')
  .get(checkTocken.checkTokeninUrl,quizzes.list)
  .post(checkTocken.checkTokeninBody,quizzes.create);

  app.route('/quizzes/:quizId')
  .get(checkTocken.checkTokeninBody,quizzes.read)
  .post(checkTocken.checkTokeninBody,quizzes.update)
  .delete(checkTocken.checkTokeninUrl,quizzes.delete);

  app.param('quizId',quizzes.quizById);
};
