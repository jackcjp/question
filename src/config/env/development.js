'use strict';

module.exports = {
  db: {
    uri: 'mongodb://{{UPDATE_DBHOST}}/{{UPDATE_DBNAME}}',
    // uri: 'mongodb://n01.lxpt.cn:41204/cap-dev',
    options: {
      user: '{{UPDATE_DBUSER}}',
      pass: '{{UPDATE_DBPASS}}'
      // user: '',
      // pass: ''
    }
  },
  log: {
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: 'dev',
    // Stream defaults to process.stdout
    // Uncomment to enable logging to a log on the file system
    options: {
      //stream: 'access.log'
    }
  }
};
