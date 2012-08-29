# grunt-shell-spawn

This is a fork on [sindresorhus][1]'s [grunt-shell][2] task adding a new task `spawn` that launches a command in background without waiting for it to finish.

E.g.: start a `compass watch` in the background.

[1]: https://github.com/sindresorhus
[2]: https://github.com/sindresorhus/grunt-shell

-----

### Example usage

Run `compass watch`

Simple task, no output, current directory:

```javascript
spawn: {
    command: 'compass',
    args: ['watch'],
}
```

Multitask, advanced:

```javascript
spawn: {
    compassWatch: {
        command: 'compass',
        args: ['watch'],
        execOptions: {
            cwd: './src/www/'
        }
    },
    _options: {
        stdout: true,
        stderr: true,
    }
}
```

## License

MIT License
(c) [Sindre Sorhus](http://sindresorhus.com)

