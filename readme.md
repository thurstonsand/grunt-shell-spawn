# grunt-shell-spawn

> A fork on [sindresorhus][1]'s [grunt-shell][2] ***with support for background processes***.
>  
> *(e.g.: start a `compass watch` in the background)*

-----

*This plugin requires grunt >= 0.4.x. For grunt 0.3.x, use version `0.1.3`.*

### Install

    npm install grunt-shell-spawn --save-dev

Once the plugin has been installed, it may be enabled inside your Gruntfile with:

    grunt.loadNpmTasks('grunt-shell-spawn');

### Example usage

Let's take for example launching a `compass watch` in background:

Simple task, no output, current directory:

```javascript
shell: {
    command: 'compass watch',
    options: {
        async: true
    }
}
```

Multitask:

```javascript
shell: {
    compassWatch: {
        command: 'compass watch',
        options: {
            async: true,
            execOptions: {
                cwd: './src/www/'
           }
       }
    },
    coffeeCompile: {
        command: 'coffee -b -c -o /out /src',
        options: {
            async: false,
            execOptions: {
                cwd: './src/www/'
            }
        }
    },
    options: {
        stdout: true,
        stderr: true,
    }
}
```

## License

MIT License
(c) [Sindre Sorhus](http://sindresorhus.com)


[1]: https://github.com/sindresorhus
[2]: https://github.com/sindresorhus/grunt-shell

