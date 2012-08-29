/*
 * grunt-shell
 * 0.1.2 - 2012-06-28
 * github.com/sindresorhus/grunt-shell
 *
 * (c) Sindre Sorhus
 * sindresorhus.com
 * MIT License
 */
module.exports = function( grunt ) {
	'use strict';

	var _ = grunt.utils._;
	var log = grunt.log;

	grunt.registerMultiTask( 'shell', 'Run shell commands', function() {
		var exec = require('child_process').exec;
		var done = this.async();
		var data = _.extend( [], grunt.config.get('shell')._options, this.data );
		var dataOut = data.stdout;
		var dataErr = data.stderr;

		exec( data.command, data.execOptions, function( err, stdout, stderr ) {
			if ( stdout ) {
				if ( _.isFunction( dataOut ) ) {
					dataOut( stdout );
				} else if ( dataOut === true ) {
					log.write( stdout );
				}
			}

			if ( err ) {
				if ( _.isFunction( dataErr ) ) {
					dataErr( stderr );
				} else if ( data.failOnError === true ) {
					grunt.fatal( err );
				} else if ( dataErr === true ) {
					log.error( err );
				}
			}

			done();
		});
	});

	grunt.registerMultiTask( 'spawn', 'Spawn shell command', function() {
		var exec = require('child_process').spawn;
		var data = _.extend( [], grunt.config.get('spawn')._options, this.data );
		var dataOut = data.stdout;
		var dataErr = data.stderr;
		
		var cp = exec( data.command, data.args, data.execOptions);

		cp.stdout.on('data', function (data) {
			if ( _.isFunction( dataOut ) ) {
				dataOut( data );
			} else if ( dataOut === true ) {
				log.write( data.toString() );
			}
		});

		cp.stderr.on('data', function (data) {
  			if ( _.isFunction( dataErr ) ) {
				dataErr( data );
			} else if ( data.failOnError === true ) {
				grunt.fatal( data );
			} else if ( dataErr === true ) {
				log.error( data.toString() );
			}
		});

		cp.on('exit', function (code) {
			console.log(data.command + ' exited with code ' + code);
		});
	});
};
