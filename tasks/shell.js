
/*
 * (c) Sindre Sorhus
 * sindresorhus.com
 * MIT License
 */
module.exports = function( grunt ) {
    'use strict';

    var _ = grunt.util._;
    var log = grunt.log;

    grunt.registerMultiTask( 'shell', 'Run shell commands', function() {

        var cp = require('child_process');

        var options = _.extend({
            stdout: true,
            stderr: true,
            failOnError: true
        }, grunt.config.get('shell')._options, this.data.options);

        var data = this.data;
        var done = options.async ? function() {} : this.async();
        var file, args, opts;

        grunt.verbose.writeflags(options, 'Options');

        opts = _.clone({}, options.execOptions);

        if (process.platform === 'win32') {
            file = 'cmd.exe';
            args = ['/s', '/c', data.command.replace(/\//g, '\\') ];
            opts.windowsVerbatimArguments = true;
        } else {
            file = '/bin/sh';
            args = ['-c', data.command];
        }

        grunt.verbose.writeln('Command: ' + file);
        grunt.verbose.writeflags(args, 'Args');

        // spawn
        var proc = cp.spawn(file, args, opts );

        proc.stdout.on('data', function(data) {
          if( _.isFunction( options.stdout ) ) {
            options.stdout(data);
          } else if(options.stdout === true || grunt.option('verbose')) {
            log.write(data);
          }
        });

        proc.stderr.on('data', function(data) {
          if( _.isFunction( options.stderr ) ) {
            options.stderr(data);
          } else if(options.stderr === true || grunt.option('verbose')) {
            log.error(data);
          }
        });


        proc.on('close', function (code) {
            if ( _.isFunction( options.callback ) ) {
                options.callback.call(this);
            } else if ( 0 !== code && options.failOnError ){
                grunt.warn("Done, with errors.");
            }
            done();
        });

    });

};
