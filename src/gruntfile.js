'use strict';

var fs = require('fs');

module.exports = function(grunt) {
  // Unified Watch Object
  var watchFiles = {
    serverViews: ['app/views/**/*.*'],
    serverJS: ['gruntfile.js', 'server.js', 'dbconf/index.js', 'config/**/*.js', 'app/**/*.js', '!app/tests/'],
    mochaTests: ['app/tests/**/*.js']
  };

  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      serverViews: {
        files: watchFiles.serverViews,
        options: {
          livereload: true
        }
      },
      serverJS: {
        files: watchFiles.serverJS,
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      },
      mochaTests: {
        files: watchFiles.mochaTests,
        tasks: ['test:server'],
      }
    },
    jshint: {
      all: {
        src: watchFiles.serverJS,
        options: {
          jshintrc: true
        }
      }
    },
    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          nodeArgs: ['--debug'],
          ext: 'js,html',
          watch: watchFiles.serverViews.concat(watchFiles.serverJS)
        }
      }
    },
    'node-inspector': {
      custom: {
        options: {
          'web-port': 1337,
          'web-host': 'localhost',
          'debug-port': 5858,
          'save-live-edit': true,
          'no-preload': true,
          'stack-trace-limit': 50,
          'hidden': []
        }
      }
    },
    concurrent: {
      default: ['nodemon', 'watch'],
      debug: ['nodemon', 'watch', 'node-inspector'],
      options: {
        logConcurrentOutput: true,
        limit: 10
      }
    },
    env: {
      test: {
        NODE_ENV: 'test'
      },
      secure: {
        NODE_ENV: 'secure'
      }
    },
    mochaTest: {
      src: watchFiles.mochaTests,
      options: {
        reporter: 'spec',
        require: 'server.js'
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },
    copy: {
        localConfig: {
              src: 'config/env/local.example.js',
              dest: 'config/env/local.js',
              filter: function() {
                return !fs.existsSync('config/env/local.js');
              }
        }
    }
  });

  // Load NPM tasks
  require('load-grunt-tasks')(grunt);

  // Making grunt default to force in order not to break the project.
  grunt.option('force', true);

  // A Task for loading the configuration object
  grunt.task.registerTask('loadConfig', 'Task that loads the config into a grunt option.', function() {
    var init = require('./config/init')();
    var config = require('./config/config');

    grunt.config.set('applicationJavaScriptFiles', config.assets.js);
    grunt.config.set('applicationCSSFiles', config.assets.css);
  });

  // Default task(s).
  grunt.registerTask('default', ['lint', 'copy:localConfig', 'concurrent:default']);

  // Debug task.
  grunt.registerTask('debug', ['lint', 'copy:localConfig', 'concurrent:debug']);

  // Secure task(s).
  grunt.registerTask('secure', ['env:secure', 'lint', 'copy:localConfig', 'concurrent:default']);

  // Lint task(s).
  grunt.registerTask('lint', ['jshint']);

  // Build task(s).
  grunt.registerTask('build', ['lint', 'loadConfig']);

  // Test task.
  grunt.registerTask('test', ['copy:localConfig', 'test:server']);
  grunt.registerTask('test:server', ['env:test', 'mochaTest']);
  grunt.registerTask(['env:test', 'karma:unit']);
};
