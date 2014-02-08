'use strict';

var grunt = require('grunt');
var fs = require('fs');
var exec = require('child_process').exec;

var shouldNotError = function (test, error, stderr) {
  test.equal(error, null, 'Error: ' + error);
  test.equal(stderr, '', 'Error: ' + stderr);
};

exports['grunt-shell-spawn'] = {
  defaultSync: function(test) {
    test.expect(2);

    exec('./node_modules/.bin/grunt shell:defaultSync', function(error, stdout, stderr) {
      shouldNotError(test, error, stderr);
      test.done();
    });
  },

  'Running a synchronous target twice': function(test) {
    test.expect(2);

    exec('./node_modules/.bin/grunt repeat', function(error, stdout, stderr) {
      shouldNotError(test, error, stderr);
      test.done();
    });
  }
};
