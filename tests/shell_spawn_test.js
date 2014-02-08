'use strict';

var grunt = require('grunt');
var fs = require('fs');
var exec = require('child_process').exec;
var path = require('path');

var grunt = path.normalize('node_modules/.bin/grunt');

var shouldNotError = function (test, error, stderr) {
  test.equal(error, null, 'Error: ' + error);
  test.equal(stderr, '', 'Error: ' + stderr);
};

exports['grunt-shell-spawn'] = {
  defaultSync: function(test) {
    test.expect(2);

    exec(grunt + ' shell:defaultSync', function(error, stdout, stderr) {
      shouldNotError(test, error, stderr);
      test.done();
    });
  },

  'Running a synchronous target twice': function(test) {
    test.expect(2);

    exec(grunt + ' repeat', function(error, stdout, stderr) {
      shouldNotError(test, error, stderr);
      test.done();
    });
  },

  'Captures stdout, stderr, and exit code of synchronous process': function (test) {
    test.expect(2);

    exec(grunt + ' shell:testProcessSync', function(error, stdout, stderr) {
      shouldNotError(test, error, stderr);
      test.done();
    });
  },

  'Captures stdout, stderr, and exit code of async process': function (test) {
    test.expect(2);

    exec(grunt + ' testProcessAsync', function(error, stdout, stderr) {
      shouldNotError(test, error, stderr);
      test.done();
    });
  }
};
