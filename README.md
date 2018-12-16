# alfred-pkill

> [Alfred 3](https://www.alfredapp.com/) workflow，通过名称|端口|PID结束进程 Terminate a process by name or port or pid

![](docs/pkill.gif)
![](docs/byname.jpg)
![](docs/byport.jpg)
![](docs/bypid.jpg)

## Install

```js
$ npm install --global alfred-pkill
```

Requires [Node.js](https://nodejs.org/) 4+ and the Alfred [Powerpack](https://www.alfredapp.com/powerpack/).

## Usage

In Alfred, type `pkill`, <kbd>Enter</kbd> or <kbd>Space</kbd>, and the process name or keyword or :port or ?pid.

alfred-pkill will automatically find the corresponding process(es).

Press <kbd>Enter</kbd>, `kill` it.  
Hold <kbd>Alt</kbd> and Press <kbd>Enter</kbd>, Force `kill -9`.  
Hold <kbd>Command</kbd> and Press <kbd>Enter</kbd>, show the process command.

## Related

- [alfy](https://github.com/sindresorhus/alfy) - Create Alfred workflows with ease
- [execa](https://github.com/sindresorhus/execa) - A better `child_process`
- [pid-from-port](https://github.com/kevva/pid-from-port) - Get PID from a port
- [ps-list](https://github.com/sindresorhus/ps-list) - Get running processes
- [process-exists](https://github.com/sindresorhus/process-exists) - Check if a process is running

## License

[Apache 2.0](LICENSE) © [ManerFan](https://github.com/manerfan)

## Change Log

- [0.1.2] Terminate a process by name or keyword or port or pid
- [0.1.1] Terminate a process by name or port or pid