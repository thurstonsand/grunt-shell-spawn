
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

        var options = this.options({
            stdout: true,
            stderr: true,
            failOnError: true
        });

        var data = this.data;
        var done = options.async ? function() {} : this.async();
        var file, args, opts;

        grunt.verbose.writeflags(options, 'Options');

        if (process.platform === 'win32') {
            file = 'cmd.exe';
            args = ['/s', '/c', data.command.replace(/\//g, '\\') ];
            opts = _.clone({}, options.execOptions);
            opts.windowsVerbatimArguments = true;
        } else {
            file = '/bin/sh';
            args = ['-c', data.command];
            opts = options.execOptions;
        }

        grunt.verbose.writeln('Command: ' + file);
        grunt.verbose.writeflags(args, 'Args');

        opts.stdio = [process.stdin, null, null];

        if (options.stdout || grunt.options('verbose'))
            opts.stdio[1] = process.stdout;

        if (options.stderr || grunt.options('verbose'))
            opts.stdio[2] = process.stderr;

        // spawn
        var proc = cp.spawn(file, args, opts );

        
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
