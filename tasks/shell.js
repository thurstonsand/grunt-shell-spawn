
/*
 * (c) Sindre Sorhus
 * sindresorhus.com
 * MIT License
 */
module.exports = function( grunt ) {
    'use strict';

    var _ = grunt.util._;
    var log = grunt.log;

    var procs = {};

    grunt.registerMultiTask( 'shell', 'Run shell commands', function() {

        var cp = require('child_process');
        var proc;

        var options = this.options({stdout: true, stderr: true, failOnError: true, canKill: true});

        var data = this.data;
        var done = options.async ? function() {} : this.async();
        var target = this.target;
        var file, args, opts;

        grunt.verbose.writeflags(options, 'Options');

        // Set detached option to make it possible to kill the entire process group later
        opts = _.defaults({}, options.execOptions, { detached: true });

        // Tests to see if user is trying to kill a running process


        var shouldKill = options.canKill && this.args.length === 1 && this.args[0] === 'kill';
        if (shouldKill) {

            proc = procs[target];
            if (!proc) {
                grunt.fatal('No running process for target:' + target);
            }
            grunt.verbose.writeln('Killing process for target: ' + target + ' (pid = ' + proc.pid + ')');

            // Kill the process group. Note that the proc.pid represents the PID of the parent shell
            // process (/bin/sh or cmd.exe). If we simply kill the parent process, the child
            // processes will remain running (they will become orphaned). Methods for killing the
            // entire process group vary by platform.
            if (process.platform === 'win32') {
                // TODO: Handle Windows
                grunt.warn(':kill is not yet implemented on Windows.');
            } else {
                // Kill the entire process group by passing in a negative PID. Note this requires
                // passing in a signal, and it also required us to launch the process with the
                // option { detached: true }.
                process.kill(-proc.pid, 'SIGKILL');
            }

            delete procs[target];
            done();
            return;
        }


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

        var BUFF_LENGTH = 200*1024,
            stdOutPos = 0,
            stdErrPos = 0,
            stdOutBuf, stdErrBuf;

        var stdBuffering = _.isFunction( options.callback );

        if (stdBuffering) {
            stdOutBuf = new Buffer(BUFF_LENGTH);
            stdErrBuf = new Buffer(BUFF_LENGTH);
        }

        proc = cp.spawn(file, args, opts );

        // Store proc to be killed!
        if (options.canKill) {
            if (procs[target]) {
                grunt.fatal('Process :' + target + ' already started.');
            }
            procs[target] = proc;
        }

        proc.stdout.setEncoding('utf8');
        proc.stderr.setEncoding('utf8');

        proc.stdout.on('data', function(data) {
            if (stdBuffering) {
                stdOutPos += stdOutBuf.write(data, stdOutPos);
            }

            if( _.isFunction( options.stdout ) ) {
                options.stdout(data);
            } else if(options.stdout === true || grunt.option('verbose')) {
                log.write(data);
            }
        });

        proc.stderr.on('data', function(data) {
            if (stdBuffering) {
                stdErrPos += stdErrBuf.write(data, stdErrPos);
            }

            if( _.isFunction( options.stderr ) ) {
                options.stderr(data);
            } else if(options.stderr === true || grunt.option('verbose')) {
                log.error(data);
            }
        });


        proc.on('close', function (code) {
            delete procs[target];
            if ( _.isFunction( options.callback ) ) {
                var stdOutString = stdOutBuf.toString('utf8', 0, stdOutPos),
                    stdErrString = stdErrBuf.toString('utf8', 0, stdErrPos);

                options.callback.call(this, code, stdOutString, stdErrString, done);
            } else if (code && options.failOnError){
                grunt.warn("Done, with errors.");
                done();
            } else {
                done();
            }
        });

    });

};
