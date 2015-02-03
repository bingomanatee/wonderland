// The actual grunt server settings
module.exports =  function (grunt) {
  'use strict';
  return {
    options: {
      port: grunt.option('port') || 1338,
      livereload: grunt.option('livereload') || 35729,
      // Change this to '0.0.0.0' to access the server from outside
      hostname: grunt.option('hostname') || 'localhost'
    },
    livereload: {
      options: {
        open: !grunt.option('no-open'),
        base: [
          '.tmp',
          '<%= config.app %>'
        ]
      }
    },
    dist: {
      options: {
        open: !grunt.option('no-open'),
        base: '<%= config.dist %>',
        livereload: false
      }
    }
  };
};
