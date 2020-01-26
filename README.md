# The Collaborative Illustrator [![Build Status][https://travis-ci.com/AChaffangeon/collaborative-illustrator.svg?branch=master](https://travis-ci.com/AChaffangeon/collaborative-illustrator)

The Collaborative Illustrator is a simplified illustrator allowing collaboration between peers with WebRTC.

▶️ [**Collaborative Illustrator web application**](https://https://achaffangeon.github.io/collaborative-illustrator/)

## Building process
The Collaborative Illustrator is written in [TypeScript](https://www.TypeScriptlang.org/), a language that can be compile to JavaScript. It uses [D3](https://d3js.org/) for manipulating the DOM and [Browserify](http://browserify.org/) to pack all the output JavaScript files into a single script.

To build it on your own machine, you need [npm](https://www.npmjs.com/).

Once this is done, **open a terminal and run the following commands**:
1. `git clone https://github.com/AChaffangeon/collaborative-illustrator.git` to clone this repository.
2. `cd collaborative-illustrator` to change you working directory to the clone you just made.
3. `npm install -g grunt-cli` to install the CLI of [Grunt](https://gruntjs.com/), the build system we use.
3. `npm install` to install all the other dependencies (listed in [`package.json`](package.json)).
4. `grunt` to finally build the application.

The `build` folder will contain your own build.
